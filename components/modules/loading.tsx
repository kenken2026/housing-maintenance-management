"use client"

import { useLoadinfState } from "lib/store"
import { FC } from "react"

export const Loading: FC = () => {
  const { isLoading, loagingMessage } = useLoadinfState()

  if (!isLoading) return null

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "center",
        left: 0,
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          animation: "spin .8s linear infinite",
          borderRadius: "50%",
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTopColor: "#fff",
          height: "3rem",
          width: "3rem",
        }}
      />
      {loagingMessage && (
        <p
          style={{
            color: "#fff",
            fontSize: ".9rem",
            fontWeight: "bold",
          }}
        >
          {loagingMessage}
        </p>
      )}
    </div>
  )
}
