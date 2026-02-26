import { FC, useState } from "react"
import { defaultCheckList } from "lib/constants/check-list"
import { CommentForm } from "./comment-form"
import { Modal } from "components/elements/modal"
import { Button } from "components/elements/form"

export const CheckList: FC<{
  house: House
  unit: Unit
  unitCheck?: UnitCheck
  inspect?: Inspect
  onChange(unitCheck: UnitCheck): void
}> = ({ house, unit, unitCheck, inspect, onChange }) => {
  const [isOpenCommentModal, setIsOpenCommentModal] = useState<boolean>(false)
  return (
    <>
      <h4>{unit.name}</h4>
      <Button onClick={() => setIsOpenCommentModal(true)}>コメント追加</Button>
      <div>
        <table style={{ fontSize: ".75rem", width: "100%" }}>
          <tbody>
            {(house.checkListTemplate ?? defaultCheckList).map((check) => (
              <tr key={check.id}>
                <td>{check.largeCategory}</td>
                <td>{check.mediumCategory}</td>
                <td>{check.smallCategory}</td>
                <td>{check.part}</td>
                <td>{check.detail}</td>
                <td>
                  <select
                    value={
                      unitCheck?.checkList?.find((c) => c.id == check.id)?.rank
                    }
                    onChange={({ target: { value } }) => {
                      onChange({
                        ...(unitCheck ?? { uid: unit.uid }),
                        checkList: [
                          ...(unitCheck?.checkList ?? []).filter(
                            (c) => c.id != check.id
                          ),
                          {
                            ...check,
                            rank: value || undefined,
                          },
                        ],
                      })
                    }}
                  >
                    <option />
                    {["A", "B", "C", "D1", "D2"].map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isOpenCommentModal}
        onClose={() => setIsOpenCommentModal(false)}
      >
        <CommentForm
          house={house}
          inspect={inspect}
          uid={unit.uid}
          uname={unit.name}
          onSave={async () => {}}
        />
      </Modal>
    </>
  )
}
