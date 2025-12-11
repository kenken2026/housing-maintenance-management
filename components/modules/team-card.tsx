import { FC } from "react"

export const TeamCard: FC<{
  team: { id: number; name: string }
  isChecked?: boolean
  onCheck?: () => void
}> = ({ team, isChecked, onCheck }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        alignItems: "center",
        border: "solid 1px",
        borderColor: isChecked ? "#999" : "#ddd",
        borderRadius: ".25rem",
        display: "flex",
        flexDirection: "column",
        height: "8rem",
        gap: "1rem",
        padding: "1rem 0",
        width: "8rem",
      }}
      onClick={() => onCheck?.()}
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
