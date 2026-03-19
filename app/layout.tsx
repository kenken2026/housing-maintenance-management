import { Header } from "components/features/header"
import "./reset.css"
import { Main } from "components/main"
import { Loading } from "components/modules/loading"

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
            fontSize: ".7rem",
            lineHeight: "1.6",
            padding: "1rem 1.5rem",
            color: "#555",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: ".5rem" }}>
            Copyright &copy; 2026 Building Research Institute, Japan /
            国立研究開発法人 建築研究所
          </p>
        </footer>
        <Loading />
      </body>
    </html>
  )
}
export default RootLayout
