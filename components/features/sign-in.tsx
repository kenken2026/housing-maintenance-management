"use client"

import { useState, type FC, type FormEvent } from "react"
import { Card } from "components/elements"
import { Button, Form, Input } from "components/elements/form"
import { TeamCard } from "components/modules/team-card"

const teams = [
  { id: 1, name: "東京住居" },
  { id: 2, name: "千代田区住宅管理" },
]

export const SiginIn: FC = () => {
  const [formInput, setFormInput] = useState<{
    teamId?: number
    name?: string
    password?: string
  }>({})
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault()
  }
  return (
    <>
      <Card style={{ maxWidth: "32rem" }}>
        <h2 style={{}}>点検をはじめる</h2>
        <Form onSubmit={handleSignIn}>
          <div
            style={{
              display: "flex",
              gap: ".5rem",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            {teams.map((team) => (
              <TeamCard
                team={team}
                key={team.id}
                isChecked={formInput.teamId == team.id}
                onCheck={() => setFormInput({ ...formInput, teamId: team.id })}
              />
            ))}
          </div>
          <Input
            placeholder="ユーザーネーム"
            required
            value={formInput.name ?? ""}
            onChange={({ target: { value } }) =>
              setFormInput({ ...formInput, name: value })
            }
          />
          <Input
            placeholder="パスワード"
            type="password"
            required
            value={formInput.password ?? ""}
            onChange={({ target: { value } }) =>
              setFormInput({ ...formInput, password: value })
            }
          />
          <div />
          <Button>ログイン</Button>
        </Form>
      </Card>
    </>
  )
}
