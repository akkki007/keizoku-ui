"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { SearchTrigger } from "./command-menu";

/* Nextra's Layout forwards a `search` slot to its mobile panel but gives the
 * desktop sidebar no header of its own, so the trigger is portalled into the
 * real <aside> rather than floated over it with coordinate maths that would
 * have to track the centred content column.
 *
 * The element is server-rendered by Nextra, so it is already in the document
 * at hydration — reading it during render rather than from an effect means
 * the trigger appears on the first client paint. docs.css reserves the strip
 * it sits in regardless, so the page list never shifts. */
const subscribe = () => () => {};
const getSidebar = () => document.querySelector<HTMLElement>("aside.nextra-sidebar");

export function SidebarSearch() {
  const sidebar = useSyncExternalStore(subscribe, getSidebar, () => null);
  if (!sidebar) return null;

  return createPortal(
    <div className="keizoku-sidebar-search">
      <SearchTrigger />
    </div>,
    sidebar,
  );
}
