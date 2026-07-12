"use client";
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => typeof window !== "undefined" && document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return { isDark, setIsDark } as const;
}
