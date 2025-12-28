import { Host } from "./index";

// ============ Session Types ============

/**
 * A terminal session representing a single PTY instance
 */
export interface TerminalSession {
  id: string;
  host?: Host; // undefined = local terminal
  title: string;
  createdAt: number;
}

// ============ Layout Types ============

/**
 * A terminal node in the layout tree
 */
export interface TerminalNode {
  type: "terminal";
  sessionId: string;
}

/**
 * A split node containing two child nodes
 */
export interface SplitNode {
  type: "split";
  direction: "horizontal" | "vertical";
  first: LayoutNode;
  second: LayoutNode;
  ratio: number; // 0-1, proportion of first child
}

/**
 * A node in the layout tree (either terminal or split)
 */
export type LayoutNode = TerminalNode | SplitNode;

// ============ Tab Types ============

/**
 * A tab containing a layout of terminal panes
 */
export interface Tab {
  id: string;
  title: string;
  layout: LayoutNode;
  activeSessionId: string;
}

// ============ Layout Preset Types ============

/**
 * A saved layout preset
 */
export interface LayoutPreset {
  id: string;
  name: string;
  layout: LayoutNode;
  createdAt: number;
}

// ============ Default Layouts ============

export const DEFAULT_LAYOUTS: Record<string, () => LayoutNode> = {
  single: () => ({
    type: "terminal",
    sessionId: "",
  }),
  splitVertical: () => ({
    type: "split",
    direction: "vertical",
    ratio: 0.5,
    first: { type: "terminal", sessionId: "" },
    second: { type: "terminal", sessionId: "" },
  }),
  splitHorizontal: () => ({
    type: "split",
    direction: "horizontal",
    ratio: 0.5,
    first: { type: "terminal", sessionId: "" },
    second: { type: "terminal", sessionId: "" },
  }),
  grid2x2: () => ({
    type: "split",
    direction: "horizontal",
    ratio: 0.5,
    first: {
      type: "split",
      direction: "vertical",
      ratio: 0.5,
      first: { type: "terminal", sessionId: "" },
      second: { type: "terminal", sessionId: "" },
    },
    second: {
      type: "split",
      direction: "vertical",
      ratio: 0.5,
      first: { type: "terminal", sessionId: "" },
      second: { type: "terminal", sessionId: "" },
    },
  }),
};
