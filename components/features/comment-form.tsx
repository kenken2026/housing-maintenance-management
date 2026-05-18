import { FC, SubmitEventHandler, useState } from "react"
import { Button, Form, Input, Label } from "components/elements/form"
import { commentModel } from "lib/models/comment"
import { ImageFileForm } from "components/modules/image-file-form"
import { MarkingMap } from "./marking-map"
import { useLoadinfState } from "lib/store"
import { DEFAULT_CENTER } from "lib/map"

export const CommentForm: FC<{
  house: House
  comment?: HouseComment
  inspect?: Inspect
  uname?: string
  uid?: string
  onSave: Handler<HouseComment, void>
}> = ({ house, comment: initialComment, inspect, uid, uname, onSave }) => {
  const { setLoadingMessage } = useLoadinfState()
  const [comment, setComment] = useState<HouseComment>({
    latitude: house.latitude,
    longitude: house.longitude,
    ...initialComment,
  })
  const [isSettingPosition, setIsSettingPosition] = useState<boolean>(false)

  const hasHousePosition = !!(house.latitude && house.longitude)
  const showMap = hasHousePosition || isSettingPosition

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault()
    if (comment?.id) {
      setLoadingMessage("コメントを更新中...")
      await commentModel().update({ ...comment })
      await onSave(comment)
    } else {
      setLoadingMessage("コメントを作成中...")
      const id = await commentModel().create({
        ...comment,
        houseId: house.id,
        inspectId: inspect?.id,
        uname,
        uid,
      })
      const newComment = await commentModel().show(id)
      await onSave(newComment)
    }
    setLoadingMessage(undefined)
  }
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {showMap ? (
          <MarkingMap
            initialPosition={hasHousePosition ? { ...house } : DEFAULT_CENTER}
            onChangePosition={(position) =>
              setComment({
                ...comment,
                ...position,
              })
            }
          />
        ) : (
          <Button type="button" onClick={() => setIsSettingPosition(true)}>
            位置を設定
          </Button>
        )}
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
        <Label>ユニット</Label>
        <Input value={uname} readOnly={true} />
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
