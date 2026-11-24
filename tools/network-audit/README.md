# network-audit

Outil Python d'audit et de diagnostic de la connexion Internet et du réseau local
(diagnostic légitime uniquement : aucune connexion à l'interface d'administration du routeur,
aucune attaque).

## Installation

```bash
python3 -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
# ou : pip install speedtest-cli mac-vendor-lookup scapy psutil
```

Optionnel mais recommandé pour les offres fibre > 500 Mb/s : la
[CLI officielle Ookla](https://www.speedtest.net/apps/cli) (plus précise que `speedtest-cli`).
L'utiliser via ce script vaut acceptation de sa licence et de ses conditions RGPD.

## Droits nécessaires

| Fonction | Droits |
|---|---|
| Test de débit, pings, infos Wi-Fi | utilisateur standard |
| Scan ARP actif (Scapy) | `sudo` (Linux/macOS) ou console **Administrateur** + [Npcap](https://npcap.com) (Windows) |

Sans droits élevés, le script bascule automatiquement sur un *ping sweep* + lecture de la
table ARP du système (un peu moins exhaustif).

## Utilisation

```bash
# Débits souscrits : 500 Mb/s descendant, 200 Mb/s montant, alerte sous 50 %
python3 network_audit.py -d 500 -u 200 -t 50

# Scan complet avec droits root et sous-réseau explicite
sudo python3 network_audit.py -d 1000 -u 700 --subnet 192.168.1.0/24

# 1er lancement : créer la liste blanche des appareils (puis éditer known_devices.json)
python3 network_audit.py --skip-speedtest --save-known
```

Les valeurs par défaut se règlent aussi en tête du script (`SUBSCRIBED_DOWNLOAD_MBPS`, etc.).
`python3 network_audit.py --help` liste toutes les options.

Code retour : `0` = pas d'alerte critique, `1` = au moins une alerte critique, `130` = interrompu.
Pratique pour une exécution planifiée (cron / Planificateur de tâches) afin de constituer un
historique à présenter à votre FAI.

## Sorties

- `network_audit_reports/history.csv` — une ligne par audit (séparateur `;`, s'ouvre dans Excel).
- `network_audit_reports/history.jsonl` — rapport complet, un objet JSON par ligne.

## Comment lire le diagnostic

- **Routeur mauvais** (perte, latence ou gigue dès la passerelle) → problème **local** :
  Wi-Fi, câble, routeur surchargé.
- **Routeur sain mais Internet dégradé** → problème côté **box / ligne / FAI**.
- **Débit faible en Wi-Fi mais normal en Ethernet** → le goulot est le **Wi-Fi**
  (bande 2,4 GHz, canal saturé, signal faible).

## Limites

- Le débit consommé *par appareil* n'est pas mesurable depuis un poste client : consultez la
  page « Clients / statistiques / QoS » de votre box.
- Les smartphones récents utilisent des MAC privées (aléatoires) : pas de fabricant résoluble.
- Les infos Wi-Fi proviennent de `nmcli`/`iw` (Linux), `netsh` (Windows) ou
  `system_profiler` (macOS).
