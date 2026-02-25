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
          <p style={{ marginBottom: ".25rem" }}>
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the &ldquo;Software&rdquo;), to deal in the Software without
            restriction, including without limitation the rights to use, copy,
            modify, merge, publish, distribute, sublicense, and/or sell copies
            of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions: The above
            copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software. THE SOFTWARE IS
            PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS
            OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
          </p>
          <p>
            許可は、以下の条件を満たす限りにおいて、無料で繰り返し使用、コピー、変更、マージ、公開、配布、サブライセンス、および/または販売することができます。上記の著作権表示および本許諾表示を、ソフトウェアのすべてのコピーまたは重要な部分に含めること。本ソフトウェアは、明示黙示を問わず、商業利用、特定の目的への適合性、および非侵害性に関する暗黙の保証を含め、いかなる種類の保証も提供しません。著作権者または本ソフトウェアの使用に関与した人物は、いかなる場合も、契約、不法行為またはその他の行為に基づき、ソフトウェアに起因または関連し、またはソフトウェアの使用またはその他の取引に関連して生じた契約外の損害について責任を負うことはありません。
          </p>
        </footer>
        <Loading />
      </body>
    </html>
  )
}
export default RootLayout
