"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      /* A theme flip changes colour, background and border on nearly
         every element at once. Without this, every transition on those
         properties fires together and the switch smears instead of
         snapping. */
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
