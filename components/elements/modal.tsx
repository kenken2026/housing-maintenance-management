import { ComponentProps, FC } from "react"

export const Modal: FC<
  ComponentProps<"div"> & { isOpen: boolean; onClose: () => void }
> = ({ children, isOpen, onClose, style, ...props }) => {
  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          style={{
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.5)",
            bottom: 0,
            display: "flex",
            height: "100%",
            inset: 0,
            justifyContent: "center",
            left: 0,
            padding: "1rem",
            position: "fixed",
            right: 0,
            top: 0,
            zIndex: 1000,
          }}
          onClick={() => onClose()}
        >
          <div
            aria-hidden="true"
            style={{
              background: "#fff",
              borderRadius: ".5rem",
              boxShadow: "0 0 1rem rgba(0, 0, 0, 0.2)",
              maxHeight: "90vh",
              maxWidth: "64rem",
              overflow: "scroll",
              padding: "1rem",
              width: "100%",
              ...style,
            }}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {children}
          </div>
        </div>
      )}
    </>
  )
}
