import { ComponentProps, FC } from "react"

export const Modal: FC<
  ComponentProps<"div"> & { isOpen: boolean; onClose: () => void }
> = ({ children, isOpen, onClose, ...props }) => {
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
            justifyContent: "center",
            left: 0,
            position: "fixed",
            right: 0,
            top: 0,
          }}
          onClick={() => onClose()}
        >
          <div
            aria-hidden="true"
            style={{
              background: "#fff",
              borderRadius: ".5rem",
              boxShadow: "0 0 1rem rgba(0, 0, 0, 0.2)",
              maxWidth: "32rem",
              padding: "1rem",
              width: "100%",
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
