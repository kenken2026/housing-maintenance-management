import { Modal } from "components/elements/modal"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"
import { ComponentProps, FC, useState } from "react"
import { CheckList } from "./check-list"

export const UnitList: FC<{
  house: House
  inspect?: Inspect
  onChange?(checkList: UnitCheck[]): void
}> = ({ house, inspect, onChange }) => {
  return (
    <>
      <UnitGroupWrapper>
        <h3>外構</h3>
        <UnitGroup>
          {house.exteriorInformation ? (
            <></>
          ) : (
            <>
              {OuteriorUnits.map((unit) => (
                <UnitBox
                  house={house}
                  key={unit.uid}
                  unit={unit}
                  unitCheck={(inspect?.payload as UnitCheck[])?.find(
                    (uc) => uc.uid == unit.uid
                  )}
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
                />
              ))}
            </>
          )}
        </UnitGroup>
      </UnitGroupWrapper>
      <UnitGroupWrapper>
        <h3>住棟</h3>
        <UnitGroup>
          {house.exteriorInformation ? (
            <></>
          ) : (
            <>
              {ResidenceUnits.map((unit) => (
                <UnitBox
                  house={house}
                  key={unit.uid}
                  unit={unit}
                  unitCheck={(inspect?.payload as UnitCheck[])?.find(
                    (uc) => uc.uid == unit.uid
                  )}
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
                />
              ))}
            </>
          )}
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
                              name: `部屋${j + 1}`,
                            }}
                            unitCheck={(inspect?.payload as UnitCheck[])?.find(
                              (uc) => uc.uid == `f${i}r${j}`
                            )}
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
                          />
                        ))}
                      {Array(fi.stepCount)
                        .fill(0)
                        .map((_, j) => (
                          <UnitBox
                            key={j}
                            house={house}
                            unit={{ uid: `f${i}s${j}`, name: `階段${j + 1}` }}
                            unitCheck={(inspect?.payload as UnitCheck[])?.find(
                              (uc) => uc.uid == `f${i}s${j}`
                            )}
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
                        />
                      ))}
                    {Array(house.stepCount)
                      .fill(0)
                      .map((_, j) => (
                        <UnitBox
                          key={j}
                          house={house}
                          unit={{ uid: `f${i}s${j}`, name: `階段${j + 1}` }}
                          unitCheck={(inspect?.payload as UnitCheck[])?.find(
                            (uc) => uc.uid == `f${i}s${j}`
                          )}
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
    onChange?(unitCheck: UnitCheck): void
  }
> = ({ house, unit, unitCheck, inspect, onChange, ...props }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isOpenCheckListModal, setIsOpenCheckListModal] =
    useState<boolean>(false)
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
        onClick={() => onChange && setIsOpenCheckListModal(true)}
        {...props}
      >
        <h4>
          {unitCheck && <>✓&nbsp;</>}
          {unit.name}
        </h4>
      </div>
      {onChange && (
        <Modal
          isOpen={isOpenCheckListModal}
          onClose={() => setIsOpenCheckListModal(false)}
        >
          <CheckList
            house={house}
            unit={unit}
            unitCheck={unitCheck}
            inspect={inspect}
            onChange={onChange}
          />
        </Modal>
      )}
    </>
  )
}
