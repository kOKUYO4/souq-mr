#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
network_audit.py — Audit et diagnostic de la connexion Internet et du réseau local.

Fonctionnalités
---------------
1. Test de débit réel (download / upload / latence / gigue) comparé au débit souscrit.
2. Inventaire des appareils du LAN / Wi-Fi (IP, MAC, fabricant OUI, nom d'hôte).
3. Diagnostic de la passerelle (perte de paquets, temps de réponse, gigue) et du Wi-Fi
   (bande, canal, signal, congestion du canal).
4. Rapport lisible dans le terminal (alertes + recommandations) et historique CSV / JSONL.

Périmètre éthique
-----------------
Le script se limite à du diagnostic PASSIF ou standard sur VOTRE propre réseau :
pings ICMP, requêtes ARP, lecture de la table ARP et des informations Wi-Fi exposées
par le système d'exploitation. Il ne tente aucune connexion à l'interface
d'administration du routeur, aucune attaque, aucun contournement d'authentification.

Dépendances (toutes optionnelles : le script se dégrade proprement si l'une manque)
----------------------------------------------------------------------------------
    pip install speedtest-cli mac-vendor-lookup scapy psutil

Droits
------
- Test de débit, pings, lecture Wi-Fi : utilisateur standard.
- Scan ARP actif via Scapy : root (Linux/macOS, `sudo`) ou Administrateur (Windows,
  avec Npcap installé). Sans ces droits, le script bascule automatiquement sur un
  « ping sweep » + lecture de la table ARP du système (un peu moins exhaustif).

Utilisation rapide
------------------
    python3 network_audit.py --download 500 --upload 200
    sudo python3 network_audit.py -d 1000 -u 700 --subnet 192.168.1.0/24
    python3 network_audit.py --skip-speedtest --save-known   # initialise la liste blanche
"""

from __future__ import annotations

import argparse
import csv
import ctypes
import ipaddress
import json
import logging
import os
import platform
import re
import shutil
import socket
import statistics
import struct
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from concurrent.futures import TimeoutError as FutureTimeout
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

# psutil est facultatif : il fournit masque de sous-réseau et MAC locale de façon portable.
try:
    import psutil  # type: ignore
except ImportError:  # pragma: no cover - dépend de l'environnement
    psutil = None


# =============================================================================
# 1. CONFIGURATION — à adapter à votre abonnement
# =============================================================================

SUBSCRIBED_DOWNLOAD_MBPS: float = 500.0   # Débit descendant souscrit (Mb/s)
SUBSCRIBED_UPLOAD_MBPS: float = 200.0     # Débit montant souscrit (Mb/s)
ALERT_RATIO: float = 0.50                 # Alerte si débit réel < 50 % du souscrit

PING_COUNT: int = 20                                  # Paquets ICMP par cible
EXTERNAL_PING_TARGETS: tuple[str, ...] = ("1.1.1.1", "8.8.8.8")
KNOWN_DEVICES_FILE: str = "known_devices.json"        # Liste blanche MAC -> libellé
OUTPUT_DIR: str = "network_audit_reports"             # Dossier de l'historique
MAX_SCAN_HOSTS: int = 1024                            # Garde-fou sur la taille du scan
CONGESTED_CHANNEL_THRESHOLD: int = 4                  # Réseaux voisins sur le même canal

# Seuils de qualité (valeurs usuelles pour un usage domestique)
GATEWAY_RTT_WARN_WIRED_MS = 5.0
GATEWAY_RTT_WARN_WIFI_MS = 20.0
GATEWAY_JITTER_WARN_MS = 10.0
INTERNET_RTT_WARN_MS = 60.0
INTERNET_JITTER_WARN_MS = 30.0
LOSS_WARN_PCT = 1.0
LOSS_CRIT_PCT = 5.0
WIFI_SIGNAL_WEAK_DBM = -70

OS_NAME = platform.system()  # "Linux", "Darwin" (macOS) ou "Windows"
log = logging.getLogger("network_audit")


# =============================================================================
# 2. MODÈLES DE DONNÉES
# =============================================================================

@dataclass
class PingStats:
    """Statistiques d'une série de pings vers une cible."""
    target: str
    sent: int = 0
    received: int = 0
    loss_pct: Optional[float] = None
    min_ms: Optional[float] = None
    avg_ms: Optional[float] = None
    max_ms: Optional[float] = None
    jitter_ms: Optional[float] = None
    error: Optional[str] = None

    @classmethod
    def from_rtts(cls, target: str, sent: int, rtts: list[float]) -> "PingStats":
        received = min(len(rtts), sent)
        stats = cls(target=target, sent=sent, received=received,
                    loss_pct=round(100.0 * (sent - received) / sent, 1) if sent else None)
        if rtts:
            stats.min_ms = round(min(rtts), 2)
            stats.max_ms = round(max(rtts), 2)
            stats.avg_ms = round(statistics.mean(rtts), 2)
            # Gigue = moyenne des écarts absolus entre deux RTT consécutifs
            # (approche simplifiée inspirée de la RFC 3550).
            if len(rtts) > 1:
                diffs = [abs(b - a) for a, b in zip(rtts, rtts[1:])]
                stats.jitter_ms = round(statistics.mean(diffs), 2)
            else:
                stats.jitter_ms = 0.0
        return stats


@dataclass
class SpeedResult:
    download_mbps: Optional[float] = None
    upload_mbps: Optional[float] = None
    ping_ms: Optional[float] = None
    jitter_ms: Optional[float] = None
    packet_loss_pct: Optional[float] = None
    server: Optional[str] = None
    isp: Optional[str] = None
    backend: Optional[str] = None
    error: Optional[str] = None


@dataclass
class WifiInfo:
    ssid: Optional[str] = None
    channel: Optional[int] = None
    frequency_mhz: Optional[int] = None
    band: Optional[str] = None            # "2.4 GHz", "5 GHz", "6 GHz"
    signal_percent: Optional[int] = None
    signal_dbm: Optional[int] = None
    rate_mbps: Optional[float] = None
    neighbours_total: Optional[int] = None
    neighbours_same_channel: Optional[int] = None
    source: Optional[str] = None


@dataclass
class Device:
    ip: str
    mac: str
    vendor: str = "Inconnu"
    hostname: Optional[str] = None
    randomized_mac: bool = False
    known_label: Optional[str] = None
    is_gateway: bool = False
    is_self: bool = False


@dataclass
class NetworkContext:
    local_ip: Optional[str] = None
    gateway_ip: Optional[str] = None
    interface: Optional[str] = None
    subnet: Optional[str] = None
    connection_type: str = "inconnu"      # "wifi", "ethernet", "inconnu"


@dataclass
class Alert:
    level: str      # "CRITIQUE", "ATTENTION", "INFO"
    message: str


@dataclass
class AuditReport:
    timestamp: str
    host: str
    os: str
    subscribed_download_mbps: float
    subscribed_upload_mbps: float
    alert_ratio: float
    context: NetworkContext = field(default_factory=NetworkContext)
    internet_ok: bool = False
    dns_ok: bool = False
    gateway_ping: Optional[PingStats] = None
    external_pings: list[PingStats] = field(default_factory=list)
    speed: Optional[SpeedResult] = None
    wifi: Optional[WifiInfo] = None
    devices: list[Device] = field(default_factory=list)
    scan_method: Optional[str] = None
    known_list_loaded: bool = False
    alerts: list[Alert] = field(default_factory=list)
    recommendations: list[str] = field(default_factory=list)
    duration_s: Optional[float] = None


# =============================================================================
# 3. UTILITAIRES (affichage, sous-processus, privilèges)
# =============================================================================

class Style:
    """Codes ANSI ; désactivés si la sortie n'est pas un terminal ou si NO_COLOR est défini."""
    enabled = sys.stdout.isatty() and "NO_COLOR" not in os.environ
    RED, YELLOW, GREEN, CYAN, BOLD, DIM = "31", "33", "32", "36", "1", "2"


def paint(text: str, *codes: str) -> str:
    if not Style.enabled or not codes:
        return text
    return f"\033[{';'.join(codes)}m{text}\033[0m"


def step(message: str) -> None:
    """Affiche une étape de progression."""
    print(paint("» ", Style.CYAN) + message, flush=True)


def run_cmd(cmd: list[str], timeout: float = 10.0) -> Optional[str]:
    """
    Exécute une commande système et renvoie sa sortie standard (même si le code
    retour est non nul, car `ping` renvoie 1 en cas de perte partielle).
    Renvoie None si la commande est introuvable, a expiré ou a échoué au lancement.
    """
    try:
        completed = subprocess.run(
            cmd, capture_output=True, text=True, timeout=timeout,
            errors="replace", stdin=subprocess.DEVNULL,
        )
    except FileNotFoundError:
        log.debug("Commande introuvable : %s", cmd[0])
        return None
    except subprocess.TimeoutExpired:
        log.debug("Délai dépassé (%ss) : %s", timeout, " ".join(cmd))
        return None
    except OSError as exc:
        log.debug("Erreur d'exécution %s : %s", cmd[0], exc)
        return None
    return completed.stdout


def is_admin() -> bool:
    """True si le script tourne avec les droits root / Administrateur."""
    try:
        if OS_NAME == "Windows":
            return bool(ctypes.windll.shell32.IsUserAnAdmin())  # type: ignore[attr-defined]
        return os.geteuid() == 0
    except Exception:  # noqa: BLE001 - détection best-effort
        return False


def normalize_mac(raw: str) -> str:
    """'0:1A-2b:3:4:5' -> '00:1a:2b:03:04:05'."""
    parts = re.split(r"[:\-.]", raw.strip())
    if len(parts) == 3:  # format Cisco aabb.ccdd.eeff
        joined = "".join(parts)
        parts = [joined[i:i + 2] for i in range(0, 12, 2)]
    return ":".join(p.zfill(2) for p in parts).lower()


def is_randomized_mac(mac: str) -> bool:
    """
    Bit « localement administré » (2e bit de poids faible du 1er octet).
    Les smartphones récents (iOS, Android, Windows) utilisent ces adresses
    « privées » : elles n'ont pas de fabricant OUI.
    """
    try:
        return bool(int(mac.split(":")[0], 16) & 0x02)
    except (ValueError, IndexError):
        return False


def is_multicast_or_broadcast(mac: str) -> bool:
    try:
        return mac == "ff:ff:ff:ff:ff:ff" or bool(int(mac.split(":")[0], 16) & 0x01)
    except (ValueError, IndexError):
        return True


def fmt(value: Optional[float], unit: str = "", digits: int = 1) -> str:
    return "n/d" if value is None else f"{value:.{digits}f}{unit}"


# =============================================================================
# 4. DÉTECTION DU CONTEXTE RÉSEAU (IP locale, passerelle, sous-réseau)
# =============================================================================

def get_local_ip() -> Optional[str]:
    """
    IP locale utilisée pour sortir vers Internet. Un `connect()` UDP n'envoie
    aucun paquet : il demande seulement au noyau quelle interface il utiliserait.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("192.0.2.1", 80))  # TEST-NET-1 (RFC 5737), jamais routé réellement
        return sock.getsockname()[0]
    except OSError:
        return None
    finally:
        sock.close()


def _gateway_linux() -> tuple[Optional[str], Optional[str]]:
    # Lecture directe de la table de routage du noyau : aucun binaire requis.
    best: tuple[int, str, str] | None = None
    try:
        with open("/proc/net/route", encoding="ascii") as fh:
            next(fh)  # en-tête
            for line in fh:
                cols = line.split()
                if len(cols) < 7:
                    continue
                iface, dest, gw_hex, flags, metric = cols[0], cols[1], cols[2], int(cols[3], 16), int(cols[6])
                if dest == "00000000" and flags & 0x2:  # route par défaut + flag RTF_GATEWAY
                    gw_ip = socket.inet_ntoa(struct.pack("<L", int(gw_hex, 16)))
                    if best is None or metric < best[0]:
                        best = (metric, gw_ip, iface)
    except (OSError, ValueError, StopIteration) as exc:
        log.debug("Lecture /proc/net/route impossible : %s", exc)
    if best:
        return best[1], best[2]
    out = run_cmd(["ip", "route", "show", "default"]) or ""
    match = re.search(r"default via (\S+) dev (\S+)", out)
    return (match.group(1), match.group(2)) if match else (None, None)


def _gateway_macos() -> tuple[Optional[str], Optional[str]]:
    out = run_cmd(["route", "-n", "get", "default"]) or ""
    gw = re.search(r"gateway:\s*(\S+)", out)
    iface = re.search(r"interface:\s*(\S+)", out)
    return (gw.group(1) if gw else None, iface.group(1) if iface else None)


def _gateway_windows() -> tuple[Optional[str], Optional[str]]:
    out = run_cmd(["route", "print", "-4"]) or ""
    best: tuple[int, str, str] | None = None
    pattern = re.compile(
        r"^\s*0\.0\.0\.0\s+0\.0\.0\.0\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+)", re.M)
    for gw, iface_ip, metric in pattern.findall(out):
        if best is None or int(metric) < best[0]:
            best = (int(metric), gw, iface_ip)
    return (best[1], best[2]) if best else (None, None)


def get_default_gateway() -> tuple[Optional[str], Optional[str]]:
    """Renvoie (IP passerelle, interface) selon l'OS."""
    if OS_NAME == "Linux":
        return _gateway_linux()
    if OS_NAME == "Darwin":
        return _gateway_macos()
    if OS_NAME == "Windows":
        return _gateway_windows()
    return None, None


def get_prefix_length(local_ip: str) -> Optional[int]:
    """Longueur de préfixe (/24…) de l'interface portant `local_ip`."""
    if psutil:
        for addrs in psutil.net_if_addrs().values():
            for addr in addrs:
                if addr.family == socket.AF_INET and addr.address == local_ip and addr.netmask:
                    return ipaddress.IPv4Network(f"0.0.0.0/{addr.netmask}").prefixlen
    if OS_NAME == "Linux":
        out = run_cmd(["ip", "-o", "-f", "inet", "addr", "show"]) or ""
        match = re.search(rf"inet {re.escape(local_ip)}/(\d+)", out)
        if match:
            return int(match.group(1))
    return None


def get_local_mac(local_ip: str) -> Optional[str]:
    if not psutil:
        return None
    link_family = getattr(psutil, "AF_LINK", None)
    for addrs in psutil.net_if_addrs().values():
        if any(a.family == socket.AF_INET and a.address == local_ip for a in addrs):
            for a in addrs:
                if a.family == link_family and a.address:
                    return normalize_mac(a.address)
    return None


def detect_context(subnet_override: Optional[str]) -> NetworkContext:
    ctx = NetworkContext()
    ctx.local_ip = get_local_ip()
    ctx.gateway_ip, ctx.interface = get_default_gateway()

    if subnet_override:
        network = ipaddress.ip_network(subnet_override, strict=False)
    elif ctx.local_ip:
        prefix = get_prefix_length(ctx.local_ip) or 24
        network = ipaddress.ip_interface(f"{ctx.local_ip}/{prefix}").network
    else:
        network = None

    if network is not None and network.num_addresses > MAX_SCAN_HOSTS:
        # Réseau très large (/16…) : on limite le scan au /24 de la machine.
        log.warning("Sous-réseau %s trop large, limitation du scan au /24 local.", network)
        anchor = ctx.local_ip or str(network.network_address)
        network = ipaddress.ip_interface(f"{anchor}/24").network
    ctx.subnet = str(network) if network else None

    # Type de connexion : fiable sous Linux via sysfs, affiné ensuite par l'info Wi-Fi.
    if OS_NAME == "Linux" and ctx.interface:
        ctx.connection_type = "wifi" if Path(f"/sys/class/net/{ctx.interface}/wireless").exists() \
            else "ethernet"
    return ctx


# =============================================================================
# 5. CONNECTIVITÉ ET LATENCE (ping)
# =============================================================================

_RTT_RE = re.compile(r"[=<]\s*(\d+(?:[.,]\d+)?)\s*ms", re.I)


def ping(host: str, count: int = PING_COUNT, timeout_s: float = 1.0) -> PingStats:
    """
    Ping via la commande système (aucun droit root requis, contrairement aux
    sockets ICMP brutes). On ne parse que les lignes de réponse (contenant « TTL »),
    ce qui rend l'analyse indépendante de la langue du système (FR/EN/…).
    """
    if not shutil.which("ping"):
        return PingStats(target=host, error="commande `ping` introuvable")

    if OS_NAME == "Windows":
        interval = 1.0
        cmd = ["ping", "-n", str(count), "-w", str(int(timeout_s * 1000)), host]
    elif OS_NAME == "Darwin":
        # Sous macOS, un intervalle < 1 s peut exiger les droits root.
        interval = 0.2 if is_admin() else 1.0
        cmd = ["ping", "-c", str(count), "-i", str(interval), "-W", str(int(timeout_s * 1000)), host]
    else:
        interval = 0.2
        cmd = ["ping", "-c", str(count), "-i", str(interval), "-W", str(max(1, int(timeout_s))), host]

    out = run_cmd(cmd, timeout=count * (interval + timeout_s) + 10)
    if out is None:
        return PingStats(target=host, sent=count, received=0, loss_pct=100.0,
                         error="ping impossible (délai dépassé ou permission refusée)")
    rtts = [float(m.group(1).replace(",", "."))
            for line in out.splitlines() if "ttl" in line.lower()
            for m in [_RTT_RE.search(line)] if m]
    return PingStats.from_rtts(host, count, rtts)


def check_internet(timeout: float = 3.0) -> tuple[bool, bool]:
    """
    (internet_ok, dns_ok). On distingue une panne de connectivité IP d'une panne
    DNS : symptôme fréquent « Internet ne marche plus » alors que seul le DNS du
    routeur / FAI est en cause.
    """
    internet_ok = False
    for host, port in (("1.1.1.1", 443), ("8.8.8.8", 53), ("9.9.9.9", 443)):
        try:
            with socket.create_connection((host, port), timeout=timeout):
                internet_ok = True
                break
        except OSError:
            continue

    # getaddrinfo n'a pas de timeout natif : on l'exécute dans un thread borné.
    dns_ok = False
    executor = ThreadPoolExecutor(max_workers=1)
    try:
        dns_ok = bool(executor.submit(socket.getaddrinfo, "www.cloudflare.com", 443)
                      .result(timeout=timeout + 2))
    except (FutureTimeout, OSError):
        dns_ok = False
    finally:
        executor.shutdown(wait=False, cancel_futures=True)
    return internet_ok, dns_ok


# =============================================================================
# 6. TEST DE DÉBIT
# =============================================================================

def _is_ookla_cli() -> bool:
    """Le binaire `speedtest` peut être l'officiel Ookla ou celui de speedtest-cli."""
    if not shutil.which("speedtest"):
        return False
    out = run_cmd(["speedtest", "--version"], timeout=10) or ""
    return "ookla" in out.lower()


def _speedtest_ookla(timeout: int) -> SpeedResult:
    # NB : --accept-license/--accept-gdpr valent acceptation des conditions d'Ookla.
    out = run_cmd(["speedtest", "--accept-license", "--accept-gdpr",
                   "--format=json", "--progress=no"], timeout=timeout * 6)
    if not out:
        raise RuntimeError("Ookla CLI : aucune sortie (délai dépassé ?)")
    data = json.loads(out.strip().splitlines()[-1])
    server = data.get("server", {})
    return SpeedResult(
        download_mbps=round(data["download"]["bandwidth"] * 8 / 1e6, 2),
        upload_mbps=round(data["upload"]["bandwidth"] * 8 / 1e6, 2),
        ping_ms=round(data["ping"]["latency"], 2),
        jitter_ms=round(data["ping"].get("jitter", 0.0), 2),
        packet_loss_pct=data.get("packetLoss"),
        server=f"{server.get('name', '?')} ({server.get('location', '?')})",
        isp=data.get("isp"),
        backend="Ookla CLI",
    )


def _speedtest_python(timeout: int) -> SpeedResult:
    import speedtest  # type: ignore  # paquet `speedtest-cli`

    tester = speedtest.Speedtest(secure=True, timeout=timeout)
    tester.get_best_server()
    download = tester.download()
    upload = tester.upload(pre_allocate=False)
    res = tester.results
    srv = res.server or {}
    return SpeedResult(
        download_mbps=round(download / 1e6, 2),
        upload_mbps=round(upload / 1e6, 2),
        ping_ms=round(res.ping, 2) if res.ping else None,
        server=f"{srv.get('sponsor', '?')} ({srv.get('name', '?')}, {srv.get('country', '?')})",
        isp=(res.client or {}).get("isp"),
        backend="speedtest-cli",
    )


def run_speedtest(backend: str = "auto", timeout: int = 20) -> SpeedResult:
    """
    Backends :
      - "ookla"  : CLI officielle Ookla (plus précise au-delà de ~500 Mb/s, fournit la gigue)
      - "python" : bibliothèque speedtest-cli (pip), pratique mais peut sous-estimer la fibre
      - "auto"   : Ookla si installée, sinon speedtest-cli, avec repli mutuel.
    """
    order: list[str]
    if backend == "ookla":
        order = ["ookla"]
    elif backend == "python":
        order = ["python"]
    else:
        order = ["ookla", "python"] if _is_ookla_cli() else ["python", "ookla"]

    errors: list[str] = []
    for name in order:
        try:
            if name == "ookla":
                if not _is_ookla_cli():
                    errors.append("Ookla CLI non installée")
                    continue
                return _speedtest_ookla(timeout)
            return _speedtest_python(timeout)
        except ImportError:
            errors.append("speedtest-cli non installé (pip install speedtest-cli)")
        except Exception as exc:  # noqa: BLE001 - erreurs réseau hétérogènes des libs
            errors.append(f"{name} : {type(exc).__name__}: {exc}")
            log.debug("Échec backend %s", name, exc_info=True)
    return SpeedResult(error=" | ".join(errors) or "aucun backend disponible")


# =============================================================================
# 7. INFORMATIONS WI-FI (lecture seule des données exposées par l'OS)
# =============================================================================

def freq_to_channel(freq: int) -> Optional[int]:
    if 2412 <= freq <= 2472:
        return (freq - 2407) // 5
    if freq == 2484:
        return 14
    if 5160 <= freq <= 5885:
        return (freq - 5000) // 5
    if 5955 <= freq <= 7115:
        return (freq - 5950) // 5
    return None


def band_of(freq: Optional[int], channel: Optional[int]) -> Optional[str]:
    if freq:
        return "2.4 GHz" if freq < 3000 else ("5 GHz" if freq < 5925 else "6 GHz")
    if channel:
        return "2.4 GHz" if channel <= 14 else "5 GHz"
    return None


def _wifi_linux(interface: Optional[str]) -> Optional[WifiInfo]:
    out = run_cmd(["nmcli", "-t", "-f", "IN-USE,SSID,CHAN,FREQ,SIGNAL,RATE",
                   "dev", "wifi", "list", "--rescan", "no"], timeout=15)
    if out:
        rows = []
        for line in out.splitlines():
            cols = [c.replace("\\:", ":") for c in re.split(r"(?<!\\):", line)]
            if len(cols) >= 6:
                rows.append(cols)
        current = next((r for r in rows if r[0].strip() == "*"), None)
        if current:
            chan = int(current[2]) if current[2].isdigit() else None
            freq_m = re.search(r"\d+", current[3])
            freq = int(freq_m.group()) if freq_m else None
            rate_m = re.search(r"[\d.]+", current[5])
            signal = int(current[4]) if current[4].isdigit() else None
            same = sum(1 for r in rows if r is not current and r[2] == current[2])
            return WifiInfo(
                ssid=current[1] or "(masqué)", channel=chan, frequency_mhz=freq,
                band=band_of(freq, chan), signal_percent=signal,
                signal_dbm=int(signal / 2 - 100) if signal is not None else None,
                rate_mbps=float(rate_m.group()) if rate_m else None,
                neighbours_total=len(rows) - 1, neighbours_same_channel=same, source="nmcli")

    # Repli : `iw` (pas d'info sur les voisins sans droits root).
    if interface:
        out = run_cmd(["iw", "dev", interface, "link"]) or ""
        if "Connected" in out:
            ssid = re.search(r"SSID:\s*(.+)", out)
            freq_m = re.search(r"freq:\s*(\d+)", out)
            sig = re.search(r"signal:\s*(-?\d+)\s*dBm", out)
            rate = re.search(r"tx bitrate:\s*([\d.]+)", out)
            freq = int(freq_m.group(1)) if freq_m else None
            chan = freq_to_channel(freq) if freq else None
            dbm = int(sig.group(1)) if sig else None
            return WifiInfo(
                ssid=ssid.group(1).strip() if ssid else None, channel=chan, frequency_mhz=freq,
                band=band_of(freq, chan), signal_dbm=dbm,
                signal_percent=max(0, min(100, 2 * (dbm + 100))) if dbm is not None else None,
                rate_mbps=float(rate.group(1)) if rate else None, source="iw")
    return None


def _wifi_windows() -> Optional[WifiInfo]:
    out = run_cmd(["netsh", "wlan", "show", "interfaces"], timeout=10)
    if not out:
        return None
    kv: dict[str, str] = {}
    for line in out.splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            kv.setdefault(key.strip().lower(), value.strip())

    def pick(*keys: str) -> Optional[str]:
        return next((kv[k] for k in keys if k in kv and kv[k]), None)

    ssid = pick("ssid")
    if not ssid:
        return None
    chan_s = pick("channel", "canal")
    chan = int(chan_s) if chan_s and chan_s.isdigit() else None
    sig_s = pick("signal")
    signal = int(re.sub(r"\D", "", sig_s)) if sig_s and re.search(r"\d", sig_s) else None
    band_s = pick("band", "bande")
    rate_s = next((v for k, v in kv.items() if "(mbps)" in k or "(mbit" in k), None)
    info = WifiInfo(
        ssid=ssid, channel=chan,
        band=(band_s.replace(",", ".") if band_s else band_of(None, chan)),
        signal_percent=signal,
        signal_dbm=int(signal / 2 - 100) if signal is not None else None,
        rate_mbps=float(rate_s.replace(",", ".")) if rate_s and re.fullmatch(r"[\d.,]+", rate_s) else None,
        source="netsh")

    # Réseaux voisins (liste déjà connue du système, pas d'injection de paquets).
    nets = run_cmd(["netsh", "wlan", "show", "networks", "mode=bssid"], timeout=15) or ""
    channels = [int(c) for c in re.findall(r"^\s*(?:Channel|Canal)\s*:\s*(\d+)", nets, re.M | re.I)]
    if channels:
        info.neighbours_total = max(0, len(channels) - 1)
        if chan is not None:
            info.neighbours_same_channel = max(0, channels.count(chan) - 1)
    return info


def _wifi_macos() -> Optional[WifiInfo]:
    out = run_cmd(["system_profiler", "SPAirPortDataType", "-json"], timeout=30)
    if not out:
        return None
    try:
        data = json.loads(out)
        interfaces = data["SPAirPortDataType"][0]["spairport_airport_interfaces"]
    except (json.JSONDecodeError, KeyError, IndexError, TypeError):
        return None
    for iface in interfaces:
        cur = iface.get("spairport_current_network_information")
        if not cur:
            continue
        chan_raw = str(cur.get("spairport_network_channel", ""))
        chan_m = re.match(r"(\d+)", chan_raw)
        chan = int(chan_m.group(1)) if chan_m else None
        band = "6 GHz" if "6GHz" in chan_raw else "5 GHz" if "5GHz" in chan_raw else \
            "2.4 GHz" if "2GHz" in chan_raw else band_of(None, chan)
        sig_m = re.search(r"(-?\d+)\s*dBm", str(cur.get("spairport_signal_noise", "")))
        dbm = int(sig_m.group(1)) if sig_m else None
        others = iface.get("spairport_airport_other_local_wireless_networks", []) or []
        other_chans = [re.match(r"(\d+)", str(o.get("spairport_network_channel", ""))) for o in others]
        same = sum(1 for m in other_chans if m and chan is not None and int(m.group(1)) == chan)
        rate = cur.get("spairport_network_rate")
        return WifiInfo(
            ssid=cur.get("_name"), channel=chan, band=band, signal_dbm=dbm,
            signal_percent=max(0, min(100, 2 * (dbm + 100))) if dbm is not None else None,
            rate_mbps=float(rate) if isinstance(rate, (int, float)) else None,
            neighbours_total=len(others), neighbours_same_channel=same, source="system_profiler")
    return None


def get_wifi_info(interface: Optional[str]) -> Optional[WifiInfo]:
    try:
        if OS_NAME == "Linux":
            return _wifi_linux(interface)
        if OS_NAME == "Windows":
            return _wifi_windows()
        if OS_NAME == "Darwin":
            return _wifi_macos()
    except Exception:  # noqa: BLE001 - parsing best-effort, ne doit jamais bloquer l'audit
        log.debug("Lecture Wi-Fi impossible", exc_info=True)
    return None


# =============================================================================
# 8. INVENTAIRE DES APPAREILS DU LAN
# =============================================================================

class VendorResolver:
    """Résolution OUI (préfixe MAC -> fabricant) avec dégradation silencieuse."""

    def __init__(self) -> None:
        self._mvl = None
        self._manuf = None
        try:
            from mac_vendor_lookup import MacLookup  # type: ignore
            self._mvl = MacLookup()
        except ImportError:
            try:
                import manuf  # type: ignore  # alternative 100 % hors-ligne
                self._manuf = manuf.MacParser()
            except Exception:  # noqa: BLE001
                log.debug("Aucune base OUI disponible")

    def resolve(self, mac: str) -> str:
        if is_randomized_mac(mac):
            return "MAC privée (aléatoire)"
        if self._mvl is not None:
            try:
                return self._mvl.lookup(mac)
            except KeyError:  # VendorNotFoundError hérite de KeyError
                return "Inconnu"
            except Exception as exc:  # noqa: BLE001 - téléchargement de la base impossible
                log.warning("Base OUI indisponible (%s) ; fabricants non résolus.", exc)
                self._mvl = None
        if self._manuf is not None:
            return self._manuf.get_manuf_long(mac) or self._manuf.get_manuf(mac) or "Inconnu"
        return "Inconnu"


def _arp_scan_scapy(subnet: str, interface: Optional[str]) -> dict[str, str]:
    """Scan ARP actif (broadcast « who-has ») : le plus exhaustif, requiert root/admin."""
    from scapy.all import ARP, Ether, conf, srp  # type: ignore  # import lent : local

    conf.verb = 0
    kwargs = {"iface": interface} if interface and OS_NAME != "Windows" else {}
    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    answered, _ = srp(packet, timeout=2, retry=2, verbose=False, **kwargs)
    return {rcv.psrc: normalize_mac(rcv.hwsrc) for _, rcv in answered}


def _ping_one(ip: str) -> None:
    if OS_NAME == "Windows":
        cmd = ["ping", "-n", "1", "-w", "800", ip]
    elif OS_NAME == "Darwin":
        cmd = ["ping", "-c", "1", "-W", "800", ip]
    else:
        cmd = ["ping", "-c", "1", "-W", "1", ip]
    run_cmd(cmd, timeout=5)


def _read_arp_table() -> dict[str, str]:
    table: dict[str, str] = {}
    if OS_NAME == "Linux" and Path("/proc/net/arp").exists():
        with open("/proc/net/arp", encoding="ascii") as fh:
            next(fh, None)
            for line in fh:
                cols = line.split()
                if len(cols) >= 4 and cols[2] != "0x0":  # 0x0 = entrée incomplète
                    table[cols[0]] = normalize_mac(cols[3])
        return table
    out = run_cmd(["arp", "-a"]) or ""
    for line in out.splitlines():
        ip_m = re.search(r"(\d{1,3}(?:\.\d{1,3}){3})", line)
        mac_m = re.search(r"((?:[0-9a-fA-F]{1,2}[:-]){5}[0-9a-fA-F]{1,2})", line)
        if ip_m and mac_m:
            table[ip_m.group(1)] = normalize_mac(mac_m.group(1))
    return table


def _ping_sweep(subnet: str) -> dict[str, str]:
    """
    Mode sans privilèges : un ping par hôte force le système à résoudre l'adresse
    en ARP. Même si l'appareil ignore l'ICMP (pare-feu de smartphone, PC Windows),
    sa réponse ARP remplit la table du système, que l'on lit ensuite.
    """
    hosts = [str(h) for h in ipaddress.ip_network(subnet).hosts()]
    with ThreadPoolExecutor(max_workers=64) as pool:
        list(pool.map(_ping_one, hosts))
    time.sleep(0.5)
    return _read_arp_table()


def _reverse_dns(ips: list[str], timeout: float = 8.0) -> dict[str, str]:
    names: dict[str, str] = {}
    pool = ThreadPoolExecutor(max_workers=32)
    futures = {pool.submit(socket.gethostbyaddr, ip): ip for ip in ips}
    try:
        for fut in as_completed(futures, timeout=timeout):
            try:
                names[futures[fut]] = fut.result()[0]
            except (socket.herror, socket.gaierror, OSError):
                pass
    except FutureTimeout:
        log.debug("Résolution DNS inverse partielle (délai dépassé)")
    finally:
        pool.shutdown(wait=False, cancel_futures=True)
    return names


def load_known_devices(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return {normalize_mac(k): str(v) for k, v in data.items()}
    except (OSError, json.JSONDecodeError, AttributeError) as exc:
        log.warning("Fichier %s illisible (%s) : liste blanche ignorée.", path, exc)
        return {}


def save_known_devices(path: Path, devices: list[Device], existing: dict[str, str]) -> None:
    merged = dict(existing)
    for d in devices:
        if d.mac and d.mac != "?" and d.mac not in merged:
            merged[d.mac] = d.hostname or f"{d.vendor} ({d.ip})"
    path.write_text(json.dumps(merged, indent=2, ensure_ascii=False, sort_keys=True), encoding="utf-8")


def scan_devices(ctx: NetworkContext, known: dict[str, str],
                 resolve_names: bool = True) -> tuple[list[Device], str]:
    if not ctx.subnet:
        return [], "aucun (sous-réseau inconnu)"

    found: dict[str, str] = {}
    method = ""
    if is_admin():
        try:
            found = _arp_scan_scapy(ctx.subnet, ctx.interface)
            method = "scan ARP actif (Scapy)"
        except ImportError:
            log.info("Scapy non installé : bascule sur le ping sweep.")
        except Exception as exc:  # noqa: BLE001 - Npcap absent, interface invalide, etc.
            log.warning("Scan ARP Scapy impossible (%s) : bascule sur le ping sweep.", exc)
    if not method:
        if not shutil.which("ping"):
            found = _read_arp_table()
            method = "lecture table ARP seule (ping indisponible)"
        else:
            found = _ping_sweep(ctx.subnet)
            method = "ping sweep + table ARP (mode sans privilèges)"

    network = ipaddress.ip_network(ctx.subnet)
    found = {ip: mac for ip, mac in found.items()
             if ipaddress.ip_address(ip) in network
             and ip not in (str(network.network_address), str(network.broadcast_address))
             and not is_multicast_or_broadcast(mac) and mac != "00:00:00:00:00:00"}

    if ctx.local_ip and ctx.local_ip not in found:
        found[ctx.local_ip] = get_local_mac(ctx.local_ip) or "?"

    names = _reverse_dns(list(found)) if resolve_names else {}
    resolver = VendorResolver()
    devices = []
    for ip, mac in found.items():
        devices.append(Device(
            ip=ip, mac=mac,
            vendor=resolver.resolve(mac) if mac != "?" else "-",
            hostname=names.get(ip),
            randomized_mac=is_randomized_mac(mac) if mac != "?" else False,
            known_label=known.get(mac),
            is_gateway=(ip == ctx.gateway_ip),
            is_self=(ip == ctx.local_ip),
        ))
    devices.sort(key=lambda d: ipaddress.ip_address(d.ip))
    return devices, method


# =============================================================================
# 9. ANALYSE : ALERTES ET RECOMMANDATIONS
# =============================================================================

def analyse(r: AuditReport) -> None:
    alerts, recos = r.alerts, r.recommendations
    is_wifi = r.context.connection_type == "wifi"

    # --- Connectivité ---------------------------------------------------------
    if not r.context.gateway_ip:
        alerts.append(Alert("CRITIQUE", "Aucune passerelle par défaut : la machine n'est pas connectée au réseau."))
        recos.append("Vérifiez le câble Ethernet / la connexion Wi-Fi, puis redémarrez la carte réseau.")
    if not r.internet_ok:
        alerts.append(Alert("CRITIQUE", "Internet injoignable (aucune connexion TCP vers 1.1.1.1 / 8.8.8.8 / 9.9.9.9)."))
        recos.append("Vérifiez les voyants de la box (synchro ADSL/VDSL/fibre), redémarrez box et ONT, "
                     "puis consultez la page d'incidents de votre FAI.")
    elif not r.dns_ok:
        alerts.append(Alert("CRITIQUE", "Connectivité IP OK mais résolution DNS en échec."))
        recos.append("Problème DNS : redémarrez la box ou configurez un DNS public (1.1.1.1, 9.9.9.9) "
                     "sur le routeur ou sur la machine.")

    # --- Débit ------------------------------------------------------------------
    s = r.speed
    if s and s.error and s.download_mbps is None:
        alerts.append(Alert("ATTENTION", f"Test de débit impossible : {s.error}"))
    if s and s.download_mbps is not None:
        for label, measured, subscribed in (("descendant", s.download_mbps, r.subscribed_download_mbps),
                                            ("montant", s.upload_mbps, r.subscribed_upload_mbps)):
            if measured is None or not subscribed:
                continue
            ratio = measured / subscribed
            msg = (f"Débit {label} : {measured:.1f} Mb/s = {ratio:.0%} du débit souscrit "
                   f"({subscribed:.0f} Mb/s)")
            if ratio < r.alert_ratio:
                alerts.append(Alert("CRITIQUE", msg + f" — sous le seuil de {r.alert_ratio:.0%}."))
            elif ratio < 0.8:
                alerts.append(Alert("INFO", msg + " — correct mais perfectible."))
        low = s.download_mbps < r.alert_ratio * r.subscribed_download_mbps
        if low and is_wifi:
            recos.append("Refaites le test en Ethernet, à côté de la box : si le débit redevient normal, "
                         "le goulot est le Wi-Fi, pas la ligne.")
        elif low:
            recos.append("Débit faible même en filaire : testez directement sur la box (autre câble, "
                         "port différent), coupez les autres appareils, puis contactez le FAI avec "
                         "l'historique CSV comme preuve.")
        if is_wifi and r.subscribed_download_mbps >= 500:
            recos.append("En Wi-Fi, atteindre >500 Mb/s exige du Wi-Fi 6/6E/7 en 5-6 GHz à faible distance ; "
                         "seul l'Ethernet permet de vérifier le débit fibre complet.")
        if s.jitter_ms is not None and s.jitter_ms > INTERNET_JITTER_WARN_MS:
            alerts.append(Alert("ATTENTION", f"Gigue Internet élevée ({s.jitter_ms:.1f} ms) : visio / jeux impactés."))

    # --- Passerelle (réseau local) --------------------------------------------
    gw = r.gateway_ping
    gw_bad = False
    if gw and gw.error:
        alerts.append(Alert("ATTENTION", f"Ping passerelle impossible : {gw.error}"))
    elif gw and gw.received == 0:
        gw_bad = True
        alerts.append(Alert("ATTENTION", "La passerelle ne répond pas au ping (ICMP peut être bloqué par le routeur)."))
    elif gw:
        rtt_limit = GATEWAY_RTT_WARN_WIFI_MS if is_wifi else GATEWAY_RTT_WARN_WIRED_MS
        if gw.loss_pct and gw.loss_pct >= LOSS_CRIT_PCT:
            gw_bad = True
            alerts.append(Alert("CRITIQUE", f"Perte de paquets vers le routeur : {gw.loss_pct:.0f} %."))
        elif gw.loss_pct and gw.loss_pct >= LOSS_WARN_PCT:
            gw_bad = True
            alerts.append(Alert("ATTENTION", f"Perte de paquets vers le routeur : {gw.loss_pct:.0f} %."))
        if gw.avg_ms is not None and gw.avg_ms > rtt_limit:
            gw_bad = True
            alerts.append(Alert("ATTENTION", f"Latence vers le routeur élevée ({gw.avg_ms:.1f} ms, "
                                             f"attendu < {rtt_limit:.0f} ms)."))
        if gw.jitter_ms is not None and gw.jitter_ms > GATEWAY_JITTER_WARN_MS:
            gw_bad = True
            alerts.append(Alert("ATTENTION", f"Gigue vers le routeur élevée ({gw.jitter_ms:.1f} ms) : "
                                             "interférences Wi-Fi ou routeur surchargé."))

    # --- Internet (au-delà du routeur) ---------------------------------------
    ext_bad = False
    for p in r.external_pings:
        if p.error or p.received == 0:
            continue
        if p.loss_pct and p.loss_pct >= LOSS_WARN_PCT:
            ext_bad = True
            alerts.append(Alert("CRITIQUE" if p.loss_pct >= LOSS_CRIT_PCT else "ATTENTION",
                                f"Perte de paquets vers {p.target} : {p.loss_pct:.0f} %."))
        if p.avg_ms is not None and p.avg_ms > INTERNET_RTT_WARN_MS:
            ext_bad = True
            alerts.append(Alert("ATTENTION", f"Latence vers {p.target} élevée ({p.avg_ms:.1f} ms)."))
        if p.jitter_ms is not None and p.jitter_ms > INTERNET_JITTER_WARN_MS:
            ext_bad = True
            alerts.append(Alert("ATTENTION", f"Gigue vers {p.target} élevée ({p.jitter_ms:.1f} ms)."))

    # Localisation du problème : la comparaison LAN / WAN est le cœur du diagnostic.
    if gw_bad:
        recos.append("Les défauts apparaissent dès le routeur : le problème est LOCAL (Wi-Fi, câble, "
                     "routeur surchargé). Inutile d'appeler le FAI avant d'avoir corrigé ce point.")
    elif ext_bad:
        recos.append("Le lien vers le routeur est sain mais Internet se dégrade : le problème est "
                     "probablement côté box/ligne/FAI. Relancez le test à différentes heures "
                     "(saturation en soirée ?) et conservez l'historique.")

    # --- Wi-Fi --------------------------------------------------------------------
    w = r.wifi
    if w:
        if w.band == "2.4 GHz":
            alerts.append(Alert("INFO", f"Connecté en 2,4 GHz (canal {w.channel})."))
            recos.append("Passez en 5 GHz (ou 6 GHz) si l'appareil est à portée : bande moins encombrée et "
                         "bien plus rapide. Gardez le 2,4 GHz pour la portée et les objets connectés.")
            if w.channel and w.channel not in (1, 6, 11):
                recos.append(f"En 2,4 GHz, le canal {w.channel} chevauche ses voisins : préférez 1, 6 ou 11.")
        if w.signal_dbm is not None and w.signal_dbm < WIFI_SIGNAL_WEAK_DBM:
            alerts.append(Alert("ATTENTION", f"Signal Wi-Fi faible (~{w.signal_dbm} dBm / {w.signal_percent} %)."))
            recos.append("Rapprochez l'appareil ou le routeur (en hauteur, dégagé, loin des murs porteurs, "
                         "micro-ondes, aquariums) ou ajoutez un répéteur/mesh ou un CPL.")
        if w.neighbours_same_channel is not None and w.neighbours_same_channel >= CONGESTED_CHANNEL_THRESHOLD:
            alerts.append(Alert("ATTENTION", f"Canal {w.channel} encombré : {w.neighbours_same_channel} "
                                             "autres réseaux visibles sur le même canal."))
            recos.append("Changez le canal Wi-Fi dans l'interface de la box (ou activez la sélection "
                         "automatique), en choisissant le canal le moins occupé.")

    # --- Appareils ------------------------------------------------------------
    if r.devices:
        others = [d for d in r.devices if not d.is_self and not d.is_gateway]
        if r.known_list_loaded:
            unknown = [d for d in others if not d.known_label]
            if unknown:
                alerts.append(Alert("ATTENTION", f"{len(unknown)} appareil(s) absent(s) de la liste blanche : "
                                    + ", ".join(f"{d.ip} [{d.mac}]" for d in unknown[:8])
                                    + (" …" if len(unknown) > 8 else "")))
                recos.append("Appareil inconnu ? Identifiez-le (nom, fabricant, éteignez vos appareils un à un). "
                             "En cas de doute : changez la clé Wi-Fi (WPA2-AES/WPA3), désactivez le WPS, "
                             "et vérifiez la liste des clients dans l'interface de la box.")
        else:
            alerts.append(Alert("INFO", "Aucune liste blanche chargée : lancez une fois avec --save-known, "
                                        "éditez les libellés ; les appareils non listés seront ensuite signalés."))
        randomized = sum(1 for d in others if d.randomized_mac)
        if randomized:
            recos.append(f"{randomized} appareil(s) utilisent une MAC privée (iPhone/Android/Windows) : "
                         "le fabricant n'est pas résoluble, identifiez-les via leur nom ou l'interface de la box.")
        if len(others) > 25:
            alerts.append(Alert("INFO", f"{len(others)} appareils actifs : la box peut saturer "
                                        "(table NAT, temps d'antenne Wi-Fi)."))

    # --- Recommandations générales (toujours utiles) ------------------------------
    recos.extend([
        "Appareils gourmands : le débit par appareil n'est visible que sur la box (page « Clients », "
        "statistiques ou QoS). Repérez-y les mises à jour, sauvegardes cloud, torrents ou caméras.",
        "Redémarrez la box une fois (débranchement 30 s) et vérifiez qu'elle est à jour (firmware).",
        "Privilégiez l'Ethernet pour les postes fixes (TV, console, PC de bureau, NAS).",
    ])
    # Dédoublonnage en conservant l'ordre
    r.recommendations = list(dict.fromkeys(recos))


# =============================================================================
# 10. RAPPORT TERMINAL
# =============================================================================

LEVEL_STYLE = {"CRITIQUE": (Style.RED, Style.BOLD), "ATTENTION": (Style.YELLOW,), "INFO": (Style.CYAN,)}


def section(title: str) -> None:
    print("\n" + paint(f"━━ {title} ".ljust(78, "━"), Style.BOLD))


def print_table(headers: list[str], rows: list[list[str]]) -> None:
    widths = [max(len(h), *(len(r[i]) for r in rows)) if rows else len(h) for i, h in enumerate(headers)]
    print("  " + "  ".join(paint(h.ljust(w), Style.BOLD) for h, w in zip(headers, widths)))
    print("  " + "  ".join("─" * w for w in widths))
    for row in rows:
        print("  " + "  ".join(c.ljust(w) for c, w in zip(row, widths)))


def ratio_badge(measured: Optional[float], subscribed: float, alert_ratio: float) -> str:
    if measured is None or not subscribed:
        return ""
    ratio = measured / subscribed
    color = Style.RED if ratio < alert_ratio else (Style.YELLOW if ratio < 0.8 else Style.GREEN)
    return paint(f"{ratio:>4.0%} du souscrit", color)


def print_report(r: AuditReport) -> None:
    c = r.context
    section("CONTEXTE")
    print(f"  Machine          : {r.host} ({r.os})")
    print(f"  IP locale        : {c.local_ip or 'n/d'}   Interface : {c.interface or 'n/d'}")
    print(f"  Passerelle       : {c.gateway_ip or 'n/d'}   Sous-réseau : {c.subnet or 'n/d'}")
    print(f"  Connexion        : {c.connection_type}")
    ok = lambda b: paint("OK", Style.GREEN) if b else paint("ÉCHEC", Style.RED)  # noqa: E731
    print(f"  Internet / DNS   : {ok(r.internet_ok)} / {ok(r.dns_ok)}")

    section("DÉBIT")
    s = r.speed
    if not s:
        print("  Test non exécuté.")
    elif s.download_mbps is None:
        print(paint(f"  Échec : {s.error}", Style.RED))
    else:
        print(f"  Download : {fmt(s.download_mbps, ' Mb/s'):>14}   "
              f"{ratio_badge(s.download_mbps, r.subscribed_download_mbps, r.alert_ratio)}")
        print(f"  Upload   : {fmt(s.upload_mbps, ' Mb/s'):>14}   "
              f"{ratio_badge(s.upload_mbps, r.subscribed_upload_mbps, r.alert_ratio)}")
        print(f"  Latence  : {fmt(s.ping_ms, ' ms'):>14}   Gigue : {fmt(s.jitter_ms, ' ms')}")
        print(paint(f"  Serveur  : {s.server}  •  FAI : {s.isp or 'n/d'}  •  via {s.backend}", Style.DIM))

    section("LATENCE & STABILITÉ")
    pings = ([r.gateway_ping] if r.gateway_ping else []) + r.external_pings
    rows = []
    for p in pings:
        label = f"{p.target} (routeur)" if r.gateway_ping is p else p.target
        if p.error:
            rows.append([label, "-", "-", "-", "-", p.error])
        else:
            rows.append([label, f"{p.received}/{p.sent}", fmt(p.loss_pct, " %", 0),
                         fmt(p.avg_ms, " ms"), fmt(p.jitter_ms, " ms"),
                         f"{fmt(p.min_ms)}–{fmt(p.max_ms)} ms"])
    print_table(["Cible", "Reçus", "Perte", "Moy.", "Gigue", "Min–Max"], rows) if rows else print("  n/d")

    section("WI-FI")
    w = r.wifi
    if not w:
        print("  Pas d'information Wi-Fi (connexion filaire, ou outil système indisponible).")
    else:
        print(f"  SSID : {w.ssid}   Bande : {w.band or 'n/d'}   Canal : {w.channel or 'n/d'}")
        print(f"  Signal : {w.signal_percent if w.signal_percent is not None else 'n/d'} % "
              f"(~{w.signal_dbm if w.signal_dbm is not None else 'n/d'} dBm)   "
              f"Débit radio : {fmt(w.rate_mbps, ' Mb/s', 0)}")
        if w.neighbours_total is not None:
            print(f"  Réseaux voisins : {w.neighbours_total} (dont {w.neighbours_same_channel} sur le même canal)")

    section(f"APPAREILS DU RÉSEAU ({len(r.devices)})")
    print(paint(f"  Méthode : {r.scan_method or 'non exécuté'}", Style.DIM))
    if r.devices:
        rows = []
        for d in r.devices:
            tag = "routeur" if d.is_gateway else "cet ordi" if d.is_self else \
                (d.known_label or ("INCONNU" if r.known_list_loaded else ""))
            rows.append([d.ip, d.mac, d.vendor[:32], (d.hostname or "")[:28], tag[:24]])
        print_table(["IP", "MAC", "Fabricant", "Nom d'hôte", "Statut"], rows)

    section("ALERTES")
    if not r.alerts:
        print(paint("  ✔ Aucune anomalie détectée.", Style.GREEN))
    for a in sorted(r.alerts, key=lambda a: ["CRITIQUE", "ATTENTION", "INFO"].index(a.level)):
        print("  " + paint(f"[{a.level}]", *LEVEL_STYLE[a.level]) + f" {a.message}")

    section("RECOMMANDATIONS")
    for i, reco in enumerate(r.recommendations, 1):
        print(f"  {i:>2}. {reco}")
    print()


# =============================================================================
# 11. EXPORT DE L'HISTORIQUE
# =============================================================================

CSV_FIELDS = ["timestamp", "connection_type", "gateway_ip", "download_mbps", "upload_mbps",
              "download_ratio", "upload_ratio", "speed_ping_ms", "speed_jitter_ms",
              "gw_loss_pct", "gw_avg_ms", "gw_jitter_ms", "inet_loss_pct", "inet_avg_ms",
              "inet_jitter_ms", "wifi_band", "wifi_channel", "wifi_signal_pct",
              "devices", "unknown_devices", "critical_alerts", "warnings", "backend"]


def report_to_csv_row(r: AuditReport) -> dict:
    s = r.speed or SpeedResult()
    gw = r.gateway_ping or PingStats(target="")
    ext = next((p for p in r.external_pings if p.received), PingStats(target=""))
    w = r.wifi or WifiInfo()
    div = lambda a, b: round(a / b, 3) if a is not None and b else None  # noqa: E731
    return {
        "timestamp": r.timestamp, "connection_type": r.context.connection_type,
        "gateway_ip": r.context.gateway_ip,
        "download_mbps": s.download_mbps, "upload_mbps": s.upload_mbps,
        "download_ratio": div(s.download_mbps, r.subscribed_download_mbps),
        "upload_ratio": div(s.upload_mbps, r.subscribed_upload_mbps),
        "speed_ping_ms": s.ping_ms, "speed_jitter_ms": s.jitter_ms,
        "gw_loss_pct": gw.loss_pct, "gw_avg_ms": gw.avg_ms, "gw_jitter_ms": gw.jitter_ms,
        "inet_loss_pct": ext.loss_pct, "inet_avg_ms": ext.avg_ms, "inet_jitter_ms": ext.jitter_ms,
        "wifi_band": w.band, "wifi_channel": w.channel, "wifi_signal_pct": w.signal_percent,
        "devices": len(r.devices),
        "unknown_devices": sum(1 for d in r.devices if r.known_list_loaded and not d.known_label
                               and not d.is_self and not d.is_gateway),
        "critical_alerts": sum(1 for a in r.alerts if a.level == "CRITIQUE"),
        "warnings": sum(1 for a in r.alerts if a.level == "ATTENTION"),
        "backend": s.backend,
    }


def export_report(r: AuditReport, out_dir: Path, fmt_choice: str) -> list[Path]:
    """
    - history.csv   : une ligne synthétique par audit (idéal pour Excel / graphiques)
    - history.jsonl : le rapport complet, un objet JSON par ligne (append-only, robuste)
    """
    written: list[Path] = []
    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        if fmt_choice in ("csv", "both"):
            csv_path = out_dir / "history.csv"
            new_file = not csv_path.exists() or csv_path.stat().st_size == 0
            with csv_path.open("a", newline="", encoding="utf-8") as fh:
                writer = csv.DictWriter(fh, fieldnames=CSV_FIELDS, delimiter=";")
                if new_file:
                    writer.writeheader()
                writer.writerow(report_to_csv_row(r))
            written.append(csv_path)
        if fmt_choice in ("json", "both"):
            json_path = out_dir / "history.jsonl"
            with json_path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(asdict(r), ensure_ascii=False) + "\n")
            written.append(json_path)
    except OSError as exc:
        print(paint(f"Impossible d'écrire l'historique dans {out_dir} : {exc}", Style.RED), file=sys.stderr)
    return written


# =============================================================================
# 12. ORCHESTRATION & CLI
# =============================================================================

def parse_args(argv: Optional[list[str]] = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Audit de la connexion Internet et du réseau local (diagnostic légitime uniquement).",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    p.add_argument("-d", "--download", type=float, default=SUBSCRIBED_DOWNLOAD_MBPS,
                   help="Débit descendant souscrit (Mb/s)")
    p.add_argument("-u", "--upload", type=float, default=SUBSCRIBED_UPLOAD_MBPS,
                   help="Débit montant souscrit (Mb/s)")
    p.add_argument("-t", "--threshold", type=float, default=ALERT_RATIO,
                   help="Seuil d'alerte : 0.5 ou 50 = 50 %% du débit souscrit")
    p.add_argument("--subnet", help="Sous-réseau à scanner (ex. 192.168.1.0/24). Auto-détecté par défaut.")
    p.add_argument("--ping-count", type=int, default=PING_COUNT, help="Pings par cible")
    p.add_argument("--backend", choices=["auto", "ookla", "python"], default="auto",
                   help="Moteur du test de débit")
    p.add_argument("--known", default=KNOWN_DEVICES_FILE, help="Liste blanche JSON {MAC: libellé}")
    p.add_argument("--save-known", action="store_true",
                   help="Ajoute les appareils détectés à la liste blanche (à éditer ensuite)")
    p.add_argument("--output-dir", default=OUTPUT_DIR, help="Dossier de l'historique")
    p.add_argument("--format", choices=["both", "csv", "json"], default="both", help="Format d'export")
    p.add_argument("--skip-speedtest", action="store_true", help="Ne pas mesurer le débit")
    p.add_argument("--skip-scan", action="store_true", help="Ne pas scanner les appareils")
    p.add_argument("--skip-wifi", action="store_true", help="Ne pas lire les infos Wi-Fi")
    p.add_argument("--no-dns", action="store_true", help="Pas de résolution DNS inverse des appareils")
    p.add_argument("--no-color", action="store_true", help="Désactiver les couleurs")
    p.add_argument("-v", "--verbose", action="store_true", help="Journalisation détaillée")
    args = p.parse_args(argv)
    if args.threshold > 1:
        args.threshold /= 100.0
    if not 0 < args.threshold <= 1:
        p.error("--threshold doit être compris entre 0 et 1 (ou 1 et 100 en %).")
    if args.download <= 0 or args.upload <= 0:
        p.error("Les débits souscrits doivent être strictement positifs.")
    if args.ping_count < 2:
        p.error("--ping-count doit être ≥ 2 (nécessaire au calcul de la gigue).")
    if args.subnet:
        try:
            ipaddress.ip_network(args.subnet, strict=False)
        except ValueError as exc:
            p.error(f"--subnet invalide : {exc}")
    return args


def run_audit(args: argparse.Namespace) -> AuditReport:
    start = time.monotonic()
    report = AuditReport(
        timestamp=datetime.now().astimezone().isoformat(timespec="seconds"),
        host=socket.gethostname(), os=f"{OS_NAME} {platform.release()}",
        subscribed_download_mbps=args.download, subscribed_upload_mbps=args.upload,
        alert_ratio=args.threshold)

    step("Détection de la configuration réseau…")
    report.context = detect_context(args.subnet)
    report.internet_ok, report.dns_ok = check_internet()

    # Les pings sont lancés AVANT le test de débit : un lien saturé fausserait la latence.
    step(f"Mesure de latence / perte ({args.ping_count} pings par cible, en parallèle)…")
    targets = ([report.context.gateway_ip] if report.context.gateway_ip else []) + \
        (list(EXTERNAL_PING_TARGETS) if report.internet_ok else [])
    with ThreadPoolExecutor(max_workers=max(1, len(targets))) as pool:
        results = dict(zip(targets, pool.map(lambda h: ping(h, args.ping_count), targets)))
    if report.context.gateway_ip:
        report.gateway_ping = results.get(report.context.gateway_ip)
    report.external_pings = [results[t] for t in EXTERNAL_PING_TARGETS if t in results]

    if not args.skip_wifi:
        step("Lecture des informations Wi-Fi…")
        report.wifi = get_wifi_info(report.context.interface)
        if report.wifi and report.wifi.ssid:
            report.context.connection_type = "wifi"
        elif report.context.connection_type == "inconnu" and report.context.gateway_ip:
            report.context.connection_type = "ethernet (probable)"

    known_path = Path(args.known)
    known = load_known_devices(known_path)
    report.known_list_loaded = bool(known)
    if not args.skip_scan:
        mode = "scan ARP" if is_admin() else "ping sweep (sans droits admin)"
        step(f"Inventaire des appareils sur {report.context.subnet} — {mode}…")
        report.devices, report.scan_method = scan_devices(report.context, known, not args.no_dns)
        if args.save_known:
            try:
                save_known_devices(known_path, report.devices, known)
                print(paint(f"  Liste blanche mise à jour : {known_path.resolve()}", Style.GREEN))
            except OSError as exc:
                print(paint(f"  Écriture de {known_path} impossible : {exc}", Style.RED))

    if args.skip_speedtest:
        report.speed = None
    elif not report.internet_ok:
        report.speed = SpeedResult(error="pas de connexion Internet")
    else:
        step("Test de débit en cours (30 à 60 s, évitez d'utiliser le réseau)…")
        report.speed = run_speedtest(args.backend)

    analyse(report)
    report.duration_s = round(time.monotonic() - start, 1)
    return report


def main(argv: Optional[list[str]] = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.WARNING,
                        format="%(levelname)s: %(message)s")
    if args.no_color:
        Style.enabled = False
    if OS_NAME == "Windows":
        os.system("")  # active le support ANSI de la console Windows 10+

    print(paint("\n  AUDIT RÉSEAU — connexion Internet & réseau local\n", Style.BOLD))
    if not is_admin():
        print(paint("  Droits standard : scan ARP actif indisponible, utilisation du mode dégradé.\n"
                    "  (Linux/macOS : sudo python3 network_audit.py — Windows : console Administrateur + Npcap)",
                    Style.DIM))
    try:
        report = run_audit(args)
    except KeyboardInterrupt:
        print("\nAudit interrompu par l'utilisateur.", file=sys.stderr)
        return 130

    print_report(report)
    for path in export_report(report, Path(args.output_dir), args.format):
        print(paint(f"  Historique : {path.resolve()}", Style.DIM))
    print(paint(f"  Durée de l'audit : {report.duration_s} s\n", Style.DIM))
    return 1 if any(a.level == "CRITIQUE" for a in report.alerts) else 0


if __name__ == "__main__":
    sys.exit(main())
