import { FC } from "react"

export const TeamCard: FC<{ team: { name: string } }> = ({ team }) => {
  return (
    <div
      style={{
        alignItems: "center",
        border: "solid #ddd 1px",
        borderRadius: ".25rem",
        display: "flex",
        flexDirection: "column",
        height: "8rem",
        gap: "1rem",
        padding: "1rem 0",
        width: "8rem",
      }}
    >
      <div
        style={{
          background: "#ddd",
          borderRadius: "2rem",
          fontSize: "2rem",
          height: "4rem",
          lineHeight: 2,
          textAlign: "center",
          textTransform: "capitalize",
          width: "4rem",
        }}
      >
        {team.name.slice(0, 1)}
      </div>
      <p
        style={{
          color: "#666",
          fontSize: ".75rem",
          fontWeight: "bold",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {team.name}
      </p>
    </div>
  )
}
