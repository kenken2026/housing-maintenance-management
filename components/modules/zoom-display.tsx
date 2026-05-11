import type { FC } from "react"

export const ZoomDisplay: FC<{ zoom: number }> = ({ zoom }) => (
  <div
    style={{
      position: "absolute",
      bottom: 24,
      right: 8,
      zIndex: 1,
      background: "rgba(255,255,255,0.85)",
      borderRadius: 4,
      padding: "2px 6px",
      fontSize: 12,
      fontWeight: "bold",
      pointerEvents: "none",
      lineHeight: "1.5",
    }}
  >
    zoom: {Math.round(zoom * 10) / 10}
  </div>
)
