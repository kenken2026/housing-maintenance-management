import { FC, useState } from "react"
import { UnitList } from "./unit-list"
import { inspectModel } from "lib/models/inspect"
import { Button, Form, Input, Label } from "components/elements/form"

export const InspectForm: FC<{
  house: House
  inspect?: Inspect
  onSave: Handler<void, void>
}> = ({ house, inspect: initialInspect, onSave }) => {
  const [inspect, setInspect] = useState<Inspect>(initialInspect)
  const handleChange = async (unitChecks: UnitCheck[]) => {
    setInspect({ ...inspect, payload: unitChecks })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inspect?.id) {
      await inspectModel().update({ ...inspect })
    } else {
      await inspectModel().create({
        ...inspect,
        houseId: house.id,
        status: "in_progress",
      })
    }
    await onSave()
  }
  return (
    <div>
      <h3>{house.name}点検</h3>
      <p>
        {(inspect?.createdAt
          ? new Date(inspect.createdAt)
          : new Date()
        ).toLocaleDateString()}
      </p>

      <Form onSubmit={handleSubmit}>
        <Label htmlFor="inspect-description">説明</Label>
        <Input
          id="inspect-description"
          value={inspect?.description ?? ""}
          onChange={(e) =>
            setInspect({ ...inspect, description: e.target.value })
          }
        />
        <UnitList house={house} inspect={inspect} onChange={handleChange} />
        <Button>保存</Button>
      </Form>
    </div>
  )
}
