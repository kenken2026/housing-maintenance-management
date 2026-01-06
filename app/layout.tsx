import { Header } from "components/features/header"
import "./reset.css"
import { Main } from "components/main"

export const metadata = {
  title: "公共賃貸住宅維持管理",
  description: "公共賃貸住宅維持管理用WEBアプリケーション",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <Header />
        <Main>{children}</Main>
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
