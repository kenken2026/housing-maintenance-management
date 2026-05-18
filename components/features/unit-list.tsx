import { Modal } from "components/elements/modal"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"
import { ComponentProps, FC, useState } from "react"
import { CheckList } from "./check-list"
import { CommentForm } from "./comment-form"
import { MarkingMap } from "./marking-map"
import { Button } from "components/elements/form"

export const UnitList: FC<{
  house: House
  inspect?: Inspect
  comments?: HouseComment[]
  onChange?(checkList: UnitCheck[]): void
  onComment?(comment: HouseComment): void
  onUnitPositionChange?(uid: string, position: Position | undefined): void
}> = ({ house, inspect, comments, onChange, onComment, onUnitPositionChange }) => {
  return (
    <>
      <UnitGroupWrapper>
        <h3>外構</h3>
        <UnitGroup>
          {(house.exteriorInformation ?? OuteriorUnits).map((unit) => (
            <UnitBox
              house={house}
              key={unit.uid}
              unit={unit}
              unitCheck={(inspect?.payload as UnitCheck[])?.find(
                (uc) => uc.uid == unit.uid
              )}
              comments={comments}
              onChange={
                onChange &&
                ((uc) => {
                  const payload = (inspect?.payload ?? []) as UnitCheck[]
                  onChange?.([
                    ...payload.filter((c) => c.uid != unit.uid),
                    uc,
                  ])
                })
              }
              onComment={onComment}
              onUnitPositionChange={onUnitPositionChange}
            />
          ))}
        </UnitGroup>
      </UnitGroupWrapper>
      <UnitGroupWrapper>
        <h3>住棟</h3>
        <UnitGroup>
          {(house.residenceInformation ?? ResidenceUnits).map((unit) => (
            <UnitBox
              house={house}
              key={unit.uid}
              unit={unit}
              unitCheck={(inspect?.payload as UnitCheck[])?.find(
                (uc) => uc.uid == unit.uid
              )}
              comments={comments}
              onChange={
                onChange &&
                ((uc) => {
                  const payload = (inspect?.payload ?? []) as UnitCheck[]
                  onChange?.([
                    ...payload.filter((c) => c.uid != unit.uid),
                    uc,
                  ])
                })
              }
              onUnitPositionChange={onUnitPositionChange}
            />
          ))}
        </UnitGroup>
      </UnitGroupWrapper>
      <UnitGroupWrapper>
        <h3>ユニット</h3>
        {house.floorInformation ? (
          <>
            {[...house.floorInformation]
              .sort((a, b) => a.floor - b.floor)
              .map((fi) => {
                const i = fi.floor - 1
                return (
                  <UnitGroupWrapper key={fi.floor}>
                    <h4>{fi.floor}階</h4>
                    <UnitGroup>
                      {Array(fi.roomCount)
                        .fill(0)
                        .map((_, j) => (
                          <UnitBox
                            house={house}
                            key={j}
                            unit={{
                              uid: `f${i}r${j}`,
                              name: `U${j + 1}`,
                            }}
                            unitCheck={(inspect?.payload as UnitCheck[])?.find(
                              (uc) => uc.uid == `f${i}r${j}`
                            )}
                            comments={comments}
                            onChange={
                              onChange &&
                              ((uc) => {
                                const payload = (inspect?.payload ??
                                  []) as UnitCheck[]
                                onChange?.([
                                  ...payload.filter(
                                    (c) => c.uid != `f${i}r${j}`
                                  ),
                                  uc,
                                ])
                              })
                            }
                            onComment={onComment}
                            onUnitPositionChange={onUnitPositionChange}
                          />
                        ))}
                      {Array(fi.stepCount)
                        .fill(0)
                        .map((_, j) => (
                          <UnitBox
                            key={j}
                            house={house}
                            unit={{ uid: `f${i}s${j}`, name: `S${j + 1}` }}
                            unitCheck={(inspect?.payload as UnitCheck[])?.find(
                              (uc) => uc.uid == `f${i}s${j}`
                            )}
                            comments={comments}
                            onChange={
                              onChange &&
                              ((uc) => {
                                const payload = (inspect?.payload ??
                                  []) as UnitCheck[]
                                onChange?.([
                                  ...payload.filter(
                                    (c) => c.uid != `f${i}s${j}`
                                  ),
                                  uc,
                                ])
                              })
                            }
                            onComment={onComment}
                            onUnitPositionChange={onUnitPositionChange}
                          />
                        ))}
                    </UnitGroup>
                  </UnitGroupWrapper>
                )
              })}
          </>
        ) : (
          <>
            {Array(house.floorCount)
              .fill(0)
              .map((_, i) => (
                <UnitGroupWrapper key={i}>
                  <h4>{i + 1}階</h4>
                  <UnitGroup>
                    {Array(house.roomCount)
                      .fill(0)
                      .map((_, j) => (
                        <UnitBox
                          house={house}
                          key={j}
                          unit={{
                            uid: `f${i}r${j}`,
                            name: `部屋${j + 1}`,
                          }}
                          unitCheck={(inspect?.payload as UnitCheck[])?.find(
                            (uc) => uc.uid == `f${i}r${j}`
                          )}
                          comments={comments}
                          onChange={
                            onChange &&
                            ((uc) => {
                              const payload = (inspect?.payload ??
                                []) as UnitCheck[]
                              onChange?.([
                                ...payload.filter((c) => c.uid != `f${i}r${j}`),
                                uc,
                              ])
                            })
                          }
                          onComment={onComment}
                          onUnitPositionChange={onUnitPositionChange}
                        />
                      ))}
                    {Array(house.stepCount)
                      .fill(0)
                      .map((_, j) => (
                        <UnitBox
                          key={j}
                          house={house}
                          unit={{ uid: `f${i}s${j}`, name: `S${j + 1}` }}
                          unitCheck={(inspect?.payload as UnitCheck[])?.find(
                            (uc) => uc.uid == `f${i}s${j}`
                          )}
                          comments={comments}
                          onChange={
                            onChange &&
                            ((uc) => {
                              const payload = (inspect?.payload ??
                                []) as UnitCheck[]
                              onChange?.([
                                ...payload.filter((c) => c.uid != `f${i}s${j}`),
                                uc,
                              ])
                            })
                          }
                          onComment={onComment}
                          onUnitPositionChange={onUnitPositionChange}
                        />
                      ))}
                  </UnitGroup>
                </UnitGroupWrapper>
              ))}
          </>
        )}
      </UnitGroupWrapper>
    </>
  )
}

const UnitGroupWrapper: FC<ComponentProps<"div">> = ({ ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        gap: ".25rem",
        padding: ".25rem 0",
      }}
      {...props}
    />
  )
}

const UnitGroup: FC<ComponentProps<"div">> = ({ ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row",
        flexWrap: "wrap",
        gap: ".5rem",
      }}
      {...props}
    />
  )
}

const UnitBox: FC<
  ComponentProps<"div"> & {
    house: House
    unit: Unit
    unitCheck?: UnitCheck
    inspect?: Inspect
    comments?: HouseComment[]
    onChange?(unitCheck: UnitCheck): void
    onComment?(comment: HouseComment): void
    onUnitPositionChange?(uid: string, position: Position | undefined): void
  }
> = ({ house, unit, unitCheck, inspect, comments, onChange, onComment, onUnitPositionChange, ...props }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isOpenCheckListModal, setIsOpenCheckListModal] = useState<boolean>(false)
  const [isSettingPosition, setIsSettingPosition] = useState<boolean>(false)
  const [pendingPosition, setPendingPosition] = useState<Position | undefined>(undefined)
  const currentPosition = house.unitPositions?.[unit.uid]
  const unitComments = comments?.filter((c) => c.uid === unit.uid) ?? []

  const handleOpenModal = () => {
    setIsSettingPosition(false)
    setPendingPosition(undefined)
    setIsOpenCheckListModal(true)
  }

  const handleSavePosition = () => {
    if (pendingPosition) {
      onUnitPositionChange?.(unit.uid, pendingPosition)
      setPendingPosition(undefined)
      setIsSettingPosition(false)
    }
  }

  const positionSection = onUnitPositionChange && (
    <div style={{ marginBottom: "1rem" }}>
      <h4>位置</h4>
      {isSettingPosition || currentPosition ? (
        <>
          <MarkingMap
            initialPosition={
              currentPosition ??
              (house.latitude && house.longitude
                ? { latitude: house.latitude, longitude: house.longitude }
                : undefined)
            }
            onChangePosition={(pos) => {
              setPendingPosition(pos)
              setIsSettingPosition(true)
            }}
          />
          <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
            {pendingPosition && (
              <Button type="button" onClick={handleSavePosition}>
                位置を保存
              </Button>
            )}
            {currentPosition && (
              <Button
                type="button"
                onClick={() => {
                  onUnitPositionChange(unit.uid, undefined)
                  setIsSettingPosition(false)
                  setPendingPosition(undefined)
                }}
              >
                位置を削除
              </Button>
            )}
          </div>
        </>
      ) : (
        <Button type="button" onClick={() => setIsSettingPosition(true)}>
          位置を設定
        </Button>
      )}
    </div>
  )

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          backgroundColor: isHovered ? "#f5f5f5" : "#fff",
          border: "2px solid",
          borderColor: unitCheck ? "#4caf50" : "#ddd",
          borderRadius: ".25rem",
          padding: ".5rem 1rem",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleOpenModal}
        {...props}
      >
        <h4>
          {unitCheck && <>✓&nbsp;</>}
          {unit.name}
          {currentPosition && <>&nbsp;📍</>}
        </h4>
      </div>
      {onChange ? (
        <Modal
          isOpen={isOpenCheckListModal}
          onClose={() => setIsOpenCheckListModal(false)}
        >
          {positionSection}
          <CheckList
            house={house}
            unit={unit}
            unitCheck={unitCheck}
            inspect={inspect}
            onChange={onChange}
          />
        </Modal>
      ) : (
        <Modal
          isOpen={isOpenCheckListModal}
          onClose={() => setIsOpenCheckListModal(false)}
        >
          {positionSection}
          {unitComments.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4>コメント一覧</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {unitComments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      borderTop: "solid 1px #eee",
                      display: "flex",
                      gap: ".5rem",
                      paddingTop: ".5rem",
                    }}
                  >
                    {comment.image && (
                      <img
                        src={comment.image}
                        alt=""
                        style={{ height: "4rem", objectFit: "contain", width: "4rem" }}
                      />
                    )}
                    <div>
                      <div style={{ fontSize: ".75rem", color: "#888" }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                      <div>{comment.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <CommentForm
            house={house}
            uname={unit.name}
            uid={unit.uid}
            onSave={(comment) => {
              setIsOpenCheckListModal(false)
              onComment?.({ ...comment })
            }}
          />
        </Modal>
      )}
    </>
  )
}
