"use client"
import { FC, useEffect, useState } from "react"
import { initializeDB } from "lib/db"

export const Main: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  useEffect(() => {
    const load = async () => {
      await initializeDB()
      setIsLoaded(true)
    }
    load()
  }, [])
  return (
    <>
      {isLoaded && (
        <>
          <main
            style={{
              alignItems: "center",
              background: "#f0f0f0",
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              minHeight: "calc(100dvh - 5.625rem)",
              padding: "1rem",
            }}
          >
            {children}
          </main>
        </>
      )}
    </>
  )
}
