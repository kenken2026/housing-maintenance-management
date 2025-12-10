import "./reset.css"

export const metadata = {
  title: "公共賃貸住宅維持管理",
  description: "公共賃貸住宅維持管理用WEBアプリケーション",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: ".5rem",
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: "1rem",
              margin: 0,
            }}
          >
            公共賃貸住宅維持管理
          </h1>
        </header>
        <main
          style={{
            background: "#f0f0f0",
            minHeight: "calc(100dvh - 5.625rem)",
            padding: "1rem",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            backgroundColor: "#f9f9f9",
            boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: ".75rem",
            padding: "1rem",
          }}
        >
          <p>
            国立研究開発法人 建築研究所, BUILDING RESEARCH INSTITUTE &copy; BRI
            All Rights Reserved
          </p>
        </footer>
      </body>
    </html>
  )
}
export default RootLayout
