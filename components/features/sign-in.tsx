"use client"

import { useEffect, useState, type FC, type FormEvent } from "react"
import { Card } from "components/elements"
import { Button, Form, Input } from "components/elements/form"
import { TeamCard } from "components/modules/team-card"
import { useTeamState } from "lib/store"
import { teamModel } from "lib/models/team"
import { Modal } from "components/elements/modal"

export const SiginIn: FC = () => {
  const [formInput, setFormInput] = useState<{
    teamId?: number
  }>({})
  const [isOpenNewTeamModal, setIsOpenNewTeamModal] = useState<boolean>(false)
  const [newTeamInput, setNewTeamInput] = useState<{
    name: string
  }>({ name: "" })
  const { setTeam } = useTeamState()
  const [teams, setTeams] = useState<Team[]>([])
  const fetchTeams = async () => {
    const teams = await teamModel().index()

    setTeams(teams)
  }

  useEffect(() => {
    const loadTeams = async () => {
      await fetchTeams()
    }
    loadTeams()
  }, [])

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault()
    setTeam(teams.find((t) => t.id == formInput.teamId))
  }
  const handleNewTeamSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await teamModel().create({ ...newTeamInput })
    await fetchTeams()
    setIsOpenNewTeamModal(false)
    setNewTeamInput({ name: "" })
  }
  const isValid = !!formInput.teamId
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
          <Button disabled={!isValid}>ログイン</Button>
        </Form>
        <div
          style={{
            background: "#e9e9e9",
            height: ".125rem",
            margin: ".5rem",
          }}
        />
        <Button type="button" onClick={() => setIsOpenNewTeamModal(true)}>
          新しいチームを作成
        </Button>
      </Card>
      <Modal
        isOpen={isOpenNewTeamModal}
        onClose={() => setIsOpenNewTeamModal(false)}
      >
        <h2>新しいチーム</h2>
        <br />
        <Form onSubmit={handleNewTeamSubmit}>
          <Input
            placeholder="チーム名"
            required
            value={newTeamInput.name}
            onChange={({ target: { value } }) =>
              setNewTeamInput({ ...newTeamInput, name: value })
            }
          />
          <Button type="submit" disabled={newTeamInput.name.length == 0}>
            作成
          </Button>
        </Form>
      </Modal>
    </>
  )
}
