import React from "react";
import { LayoutNode } from "@/types";
import { TerminalTheme } from "@/themes";
import TerminalPane from "./TerminalPane";
import SplitContainer from "./SplitContainer";

interface LayoutRendererProps {
  node: LayoutNode;
  activeSessionId: string;
  onSessionFocus: (sessionId: string) => void;
  onLayoutChange: (updatedNode: LayoutNode) => void;
  theme: TerminalTheme;
  fontSize: number;
  cursorStyle: "block" | "underline" | "bar";
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  node,
  activeSessionId,
  onSessionFocus,
  onLayoutChange,
  theme,
  fontSize,
  cursorStyle,
}) => {
  if (node.type === "terminal") {
    return (
      <TerminalPane
        sessionId={node.sessionId}
        isActive={node.sessionId === activeSessionId}
        onFocus={() => onSessionFocus(node.sessionId)}
        theme={theme}
        fontSize={fontSize}
        cursorStyle={cursorStyle}
      />
    );
  }

  // Split node
  return (
    <SplitContainer
      direction={node.direction}
      ratio={node.ratio}
      onRatioChange={(newRatio) => {
        onLayoutChange({
          ...node,
          ratio: newRatio,
        });
      }}
      first={
        <LayoutRenderer
          node={node.first}
          activeSessionId={activeSessionId}
          onSessionFocus={onSessionFocus}
          onLayoutChange={(updatedFirst) => {
            onLayoutChange({
              ...node,
              first: updatedFirst,
            });
          }}
          theme={theme}
          fontSize={fontSize}
          cursorStyle={cursorStyle}
        />
      }
      second={
        <LayoutRenderer
          node={node.second}
          activeSessionId={activeSessionId}
          onSessionFocus={onSessionFocus}
          onLayoutChange={(updatedSecond) => {
            onLayoutChange({
              ...node,
              second: updatedSecond,
            });
          }}
          theme={theme}
          fontSize={fontSize}
          cursorStyle={cursorStyle}
        />
      }
    />
  );
};

export default LayoutRenderer;
