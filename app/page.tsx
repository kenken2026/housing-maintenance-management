"use client"

import { Card } from "components/elements"
import { Button, Form, Input } from "components/elements/form"
import { TeamCard } from "components/modules/team-card"
import { FC, FormEvent } from "react"

const Page: FC = () => {
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault()
  }
  return (
    <>
      <Card style={{ maxWidth: "32rem" }}>
        <h2 style={{}}>点検をはじめる</h2>
        <div style={{ display: "flex", gap: ".5rem", padding: "1rem" }}>
          <TeamCard team={{ name: "東京住居" }} />
          <TeamCard team={{ name: "千代田区住宅管理" }} />
        </div>
        <Form onSubmit={handleSignIn}>
          <Input placeholder="ユーザーネーム" required />
          <Input placeholder="パスワード" type="password" required />
          <div />
          <Button>ログイン</Button>
        </Form>
      </Card>
    </>
  )
}

export default Page
