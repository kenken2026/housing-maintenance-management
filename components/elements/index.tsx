import { ComponentProps, FC } from "react"

export const Card: FC<ComponentProps<"section">> = ({ style, ...props }) => (
  <section
    style={{
      alignItems: "center",
      backgroundColor: "#f9f9f9",
      borderRadius: ".25rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexFlow: "column",
      gap: ".5rem",
      padding: "1rem",
      width: "100%",
      ...style,
    }}
    {...props}
  />
)
