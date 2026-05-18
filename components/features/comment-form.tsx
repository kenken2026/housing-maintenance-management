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
  const [comment, setComment] = useState<Partial<HouseComment>>(
    initialComment ?? {}
  )
  const [isSettingPosition, setIsSettingPosition] = useState<boolean>(false)

  const hasCommentPosition = !!(comment?.latitude && comment?.longitude)
  const showMap = hasCommentPosition || isSettingPosition

  const handleSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault()
    if (comment?.id) {
      setLoadingMessage("コメントを更新中...")
      await commentModel().update({ ...comment as HouseComment })
      await onSave(comment as HouseComment)
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
            initialPosition={
              hasCommentPosition
                ? { latitude: comment.latitude!, longitude: comment.longitude! }
                : house.latitude && house.longitude
                ? { latitude: house.latitude, longitude: house.longitude }
                : DEFAULT_CENTER
            }
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
          value={comment?.latitude ?? ""}
          onChange={({ target: { value } }) =>
            setComment({ ...comment, latitude: value ? Number(value) : undefined })
          }
        />
        <Label>経度</Label>
        <Input
          value={comment?.longitude ?? ""}
          onChange={({ target: { value } }) =>
            setComment({ ...comment, longitude: value ? Number(value) : undefined })
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
