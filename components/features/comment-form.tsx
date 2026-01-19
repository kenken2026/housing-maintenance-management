import { FC, useState } from "react"
import { Button, Form, Input, Label } from "components/elements/form"
import { commentModel } from "lib/models/comment"
import { ImageFileForm } from "components/modules/image-file-form"
import { MarkingMap } from "./marking-map"

export const CommentForm: FC<{
  house: House
  comment?: HouseComment
  inspect?: Inspect
  uname?: string
  uid?: string
  onSave: Handler<void, void>
}> = ({ house, comment: initialComment, inspect, uid, uname, onSave }) => {
  const [comment, setComment] = useState<HouseComment>({
    latitude: house.latitude,
    longitude: house.longitude,
    ...initialComment,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (comment?.id) {
      await commentModel().update({ ...comment })
    } else {
      await commentModel().create({
        ...comment,
        houseId: house.id,
        inspectId: inspect?.id,
        uname,
        uid,
      })
    }
    await onSave()
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <MarkingMap
          initialPosition={{ ...house }}
          onChangePosition={(position) =>
            setComment({
              ...comment,
              ...position,
            })
          }
        />
        <Label>緯度</Label>
        <Input
          value={comment?.latitude ?? house.latitude}
          onChange={({ target: { value } }) =>
            setComment({ ...comment, latitude: Number(value) })
          }
        />
        <Label>経度</Label>
        <Input
          value={comment?.longitude ?? house.longitude}
          onChange={({ target: { value } }) =>
            setComment({ ...comment, longitude: Number(value) })
          }
        />
        <p>本文</p>
        <Input
          value={comment?.body ?? ""}
          onChange={({ target: { value } }) =>
            setComment({ ...comment, body: value })
          }
        />
        <ImageFileForm
          onChange={(image) => setComment({ ...comment, image })}
        />
        <Button>保存</Button>
      </Form>
    </div>
  )
}
