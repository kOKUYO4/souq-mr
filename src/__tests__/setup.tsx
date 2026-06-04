import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Stub fetch globalement — disponible dans tous les tests via global.fetch
vi.stubGlobal("fetch", vi.fn());
beforeEach(() => { (global.fetch as ReturnType<typeof vi.fn>).mockReset(); });

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
