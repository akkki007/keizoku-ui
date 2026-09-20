"use client";

import { createContext, useContext } from "react";

/** Code inside an installation card already sits on a framed surface, so it
 *  drops its own frame, line numbers and header rather than nesting two. */
export const CodeCardContext = createContext(false);

export function useCodeCard() {
  return useContext(CodeCardContext);
}
