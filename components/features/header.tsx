"use client"

import { FC } from "react"
import Link from "next/link"

export const Header: FC = () => {
  return (
    <header
      style={{
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        padding: ".5rem",
        position: "relative",
      }}
    >
      <Link
        href="/"
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: "1rem",
          fontWeight: "bold",
          gap: ".25rem",
          margin: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        公共賃貸住宅維持管理
      </Link>
      <p
        aria-hidden="true"
        style={{
          fontSize: ".75rem",
          cursor: "pointer",
        }}
        onClick={() => {}}
      >
        設定
      </p>
    </header>
  )
}
