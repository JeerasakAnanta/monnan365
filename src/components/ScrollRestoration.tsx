"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "scroll_positions";
const MAX_ENTRIES = 20;

type ScrollPositions = Record<string, number>;

function readStorage(): ScrollPositions {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStorage(positions: ScrollPositions) {
  const entries = Object.entries(positions);
  if (entries.length > MAX_ENTRIES) {
    const trimmed = Object.fromEntries(entries.slice(-MAX_ENTRIES));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  }
}

function saveScrollKey(key: string, y: number) {
  const positions = readStorage();
  positions[key] = y;
  writeStorage(positions);
}

function restoreScrollKey(key: string) {
  const positions = readStorage();
  const y = positions[key];
  if (y == null || y <= 0) return;

  const tryScroll = (attempt: number) => {
    window.scrollTo({ top: y, behavior: "instant" });
    if (Math.abs(window.scrollY - y) > 5 && attempt < 3) {
      requestAnimationFrame(() => tryScroll(attempt + 1));
    }
  };

  requestAnimationFrame(() => tryScroll(0));
}

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    restoreScrollKey(pathname);
  }, [pathname]);

  useEffect(() => {
    const save = () => saveScrollKey(pathname, window.scrollY);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") save();
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("/") && !href.includes("#")) save();
    };

    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", save);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleClick, true);
    };
  }, [pathname]);

  return null;
}
