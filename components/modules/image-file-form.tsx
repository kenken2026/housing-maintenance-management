import { ChangeEvent, FC, useRef, useState } from "react"

export const ImageFileForm: FC<{
  onChange: (image: string) => void
}> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [base64Image, setBase64Image] = useState<string>()

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result !== "string") {
        return
      }
      setBase64Image(result)
      onChange(result)
    }
    reader.readAsDataURL(file)
  }
  return (
    <>
      <div
        aria-hidden={true}
        style={{
          alignItems: "center",
          background: "#e9e9e9",
          backgroundImage: base64Image && `url(${base64Image})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          border: 0,
          borderRadius: ".25rem",
          color: "#444",
          display: "flex",
          height: "50vh",
          justifyContent: "center",
          padding: "1rem",
        }}
        onClick={() => fileInputRef.current.click()}
      >
        {!base64Image && <p>画像を選択</p>}
      </div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleChange}
      />
    </>
  )
}
