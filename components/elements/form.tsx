import { ComponentProps, FC } from "react"

export const Form: FC<ComponentProps<"form">> = ({ style, ...props }) => (
  <form
    style={{
      display: "flex",
      flexFlow: "column",
      gap: ".5rem",
      width: "100%",
      ...style,
    }}
    {...props}
  />
)

export const Label: FC<ComponentProps<"label">> = ({
  children,
  style,
  ...props
}) => (
  <label
    style={{
      ...style,
    }}
    {...props}
  >
    {children}
  </label>
)

export const Input: FC<ComponentProps<"input">> = ({ style, ...props }) => (
  <input
    style={{
      background: "#e9e9e9",
      border: 0,
      borderRadius: ".25rem",
      color: "#444",
      fontSize: "1rem",
      outline: 0,
      padding: ".5rem 1rem",
      ...style,
    }}
    {...props}
  />
)

export const Button: FC<ComponentProps<"button">> = ({
  disabled,
  style,
  ...props
}) => (
  <button
    style={{
      background: "#e9e9e9",
      border: 0,
      borderRadius: "2rem",
      color: disabled ? "#ccc" : "#444",
      fontSize: "1rem",
      fontWeight: "bold",
      padding: ".5rem 1rem",
      ...style,
    }}
    disabled={disabled}
    {...props}
  />
)
