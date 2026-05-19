import { Modal } from "components/elements/modal"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"
import { ComponentProps, FC, useEffect, useState } from "react"
import { CheckList } from "./check-list"
import { CommentForm } from "./comment-form"
import { MarkingMap } from "./marking-map"
import { Button } from "components/elements/form"

export const UnitList: FC<{
  house: House
  inspect?: Inspect
  inspects?: Inspect[]
  comments?: HouseComment[]
  openUnitTrigger?: { uid: string }
  onChange?(checkList: UnitCheck[]): void
  onComment?(comment: HouseComment): void
  onUnitPositionChange?(uid: string, position: Position | undefined): void
}> = ({ house, inspect, inspects, comments, openUnitTrigger, onChange, onComment, onUnitPositionChange }) => {
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
              inspects={inspects}
              comments={comments}
              openUnitTrigger={openUnitTrigger}
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
              inspects={inspects}
              comments={comments}
              openUnitTrigger={openUnitTrigger}
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
                            inspects={inspects}
                            comments={comments}
                            openUnitTrigger={openUnitTrigger}
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
                            inspects={inspects}
                            comments={comments}
                            openUnitTrigger={openUnitTrigger}
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
                          inspects={inspects}
                          comments={comments}
                          openUnitTrigger={openUnitTrigger}
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
                          inspects={inspects}
                          comments={comments}
                          openUnitTrigger={openUnitTrigger}
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
    inspects?: Inspect[]
    comments?: HouseComment[]
    openUnitTrigger?: { uid: string }
    onChange?(unitCheck: UnitCheck): void
    onComment?(comment: HouseComment): void
    onUnitPositionChange?(uid: string, position: Position | undefined): void
  }
> = ({ house, unit, unitCheck, inspect, inspects, comments, openUnitTrigger, onChange, onComment, onUnitPositionChange, ...props }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isOpenCheckListModal, setIsOpenCheckListModal] = useState<boolean>(false)
  const [isSettingPosition, setIsSettingPosition] = useState<boolean>(false)
  const [pendingPosition, setPendingPosition] = useState<Position | undefined>(undefined)
  const [selectedImage, setSelectedImage] = useState<string | undefined>()
  const currentPosition = house.unitPositions?.[unit.uid]
  const unitComments = comments?.filter((c) => c.uid === unit.uid) ?? []
  const unitInspects = inspects
    ?.map((i) => ({
      inspect: i,
      unitCheck: (i.payload as UnitCheck[])?.find((uc) => uc.uid === unit.uid),
    }))
    .filter((x): x is { inspect: Inspect; unitCheck: UnitCheck } => !!x.unitCheck && x.unitCheck.checkList.length > 0)

  const handleOpenModal = () => {
    setIsSettingPosition(false)
    setPendingPosition(undefined)
    setIsOpenCheckListModal(true)
  }

  useEffect(() => {
    if (openUnitTrigger?.uid === unit.uid) {
      setIsSettingPosition(false)
      setPendingPosition(undefined)
      setIsOpenCheckListModal(true)
    }
  }, [openUnitTrigger])

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
          {unitInspects && unitInspects.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4>点検リスト</h4>
              {unitInspects.map(({ inspect: i, unitCheck: uc }) => (
                <div key={i.id} style={{ marginBottom: ".75rem" }}>
                  <div style={{ fontSize: ".75rem", color: "#888", marginBottom: ".25rem" }}>
                    {new Date(i.createdAt).toLocaleDateString()}
                    {i.description && <>&nbsp;{i.description}</>}
                  </div>
                  <table style={{ fontSize: ".75rem", width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {uc.checkList.filter((c) => c.rank).map((c) => (
                        <tr key={c.id} style={{ borderTop: "solid 1px #eee" }}>
                          <td style={{ padding: ".2rem .4rem" }}>{c.largeCategory}</td>
                          <td style={{ padding: ".2rem .4rem" }}>{c.mediumCategory}</td>
                          <td style={{ padding: ".2rem .4rem" }}>{c.part}</td>
                          <td style={{ padding: ".2rem .4rem" }}>{c.detail}</td>
                          <td style={{ padding: ".2rem .4rem", fontWeight: "bold" }}>{c.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {unitComments.some((c) => c.image) && (
            <div style={{ marginBottom: "1rem" }}>
              <h4>画像</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                {unitComments.filter((c) => c.image).map((c) => (
                  <div
                    key={c.id}
                    aria-hidden="true"
                    style={{
                      backgroundImage: `url(${c.image})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      cursor: "pointer",
                      height: "6rem",
                      width: "6rem",
                      border: "1px solid #ddd",
                      borderRadius: ".25rem",
                    }}
                    onClick={() => setSelectedImage(c.image)}
                  />
                ))}
              </div>
            </div>
          )}
          {unitComments.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <h4>コメント</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {unitComments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      borderTop: "solid 1px #eee",
                      paddingTop: ".5rem",
                    }}
                  >
                    <div style={{ fontSize: ".75rem", color: "#888" }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                    <div>{comment.body}</div>
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
          <Modal
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(undefined)}
          >
            <div
              style={{
                backgroundColor: "#333",
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                minHeight: "80vh",
                height: "100%",
                width: "100%",
              }}
            />
          </Modal>
        </Modal>
      )}
    </>
  )
}
