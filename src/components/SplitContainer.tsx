import React, { useState, useRef, useCallback } from "react";

interface SplitContainerProps {
  direction: "horizontal" | "vertical";
  first: React.ReactNode;
  second: React.ReactNode;
  ratio: number;
  onRatioChange: (ratio: number) => void;
  minSize?: number;
}

const SplitContainer: React.FC<SplitContainerProps> = ({
  direction,
  first,
  second,
  ratio,
  onRatioChange,
  minSize = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newRatio: number;

      if (direction === "horizontal") {
        const y = e.clientY - rect.top;
        newRatio = y / rect.height;
      } else {
        const x = e.clientX - rect.left;
        newRatio = x / rect.width;
      }

      // Clamp ratio based on minSize
      const containerSize =
        direction === "horizontal" ? rect.height : rect.width;
      const minRatio = minSize / containerSize;
      const maxRatio = 1 - minRatio;

      newRatio = Math.max(minRatio, Math.min(maxRatio, newRatio));
      onRatioChange(newRatio);
    },
    [isDragging, direction, minSize, onRatioChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    onRatioChange(0.5);
  }, [onRatioChange]);

  // Add/remove global mouse listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor =
        direction === "horizontal" ? "row-resize" : "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, direction, handleMouseMove, handleMouseUp]);

  const isHorizontal = direction === "horizontal";
  const firstSize = `${ratio * 100}%`;
  const secondSize = `${(1 - ratio) * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`flex w-full h-full ${isHorizontal ? "flex-col" : "flex-row"}`}
    >
      {/* First Pane */}
      <div
        style={{
          [isHorizontal ? "height" : "width"]: firstSize,
          overflow: "hidden",
        }}
        className="relative"
      >
        {first}
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className={`
          flex-shrink-0 group relative z-10
          ${isHorizontal ? "h-1 w-full cursor-row-resize" : "w-1 h-full cursor-col-resize"}
          ${isDragging ? "bg-blue-500" : "bg-neutral-700 hover:bg-blue-500/50"}
          transition-colors
        `}
      >
        {/* Visual indicator on hover */}
        <div
          className={`
            absolute opacity-0 group-hover:opacity-100 transition-opacity
            ${isHorizontal 
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 rounded-full bg-neutral-500" 
              : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-neutral-500"
            }
          `}
        />
      </div>

      {/* Second Pane */}
      <div
        style={{
          [isHorizontal ? "height" : "width"]: secondSize,
          overflow: "hidden",
        }}
        className="relative"
      >
        {second}
      </div>
    </div>
  );
};

export default SplitContainer;
