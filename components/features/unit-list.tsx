import { Modal } from "components/elements/modal"
import { OuteriorUnits, ResidenceUnits } from "lib/constants"
import { defaultCheckList } from "lib/constants/check-list"
import { ComponentProps, FC, useState } from "react"

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
                  key={unit.uid}
                  unit={unit}
                  unitCheck={(inspect?.payload as UnitCheck[])?.find(
                    (uc) => uc.uid == unit.uid
                  )}
                  onChange={(uc) => {
                    const payload = (inspect?.payload ?? []) as UnitCheck[]
                    onChange?.([
                      ...payload.filter((c) => c.uid != unit.uid),
                      uc,
                    ])
                  }}
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
                  key={unit.uid}
                  unit={unit}
                  unitCheck={(inspect?.payload as UnitCheck[])?.find(
                    (uc) => uc.uid == unit.uid
                  )}
                  onChange={(uc) => {
                    const payload = (inspect?.payload ?? []) as UnitCheck[]
                    onChange?.([
                      ...payload.filter((c) => c.uid != unit.uid),
                      uc,
                    ])
                  }}
                />
              ))}
            </>
          )}
        </UnitGroup>
      </UnitGroupWrapper>
      <UnitGroupWrapper>
        <h3>ユニット</h3>
        {house.floorInformation ? (
          <></>
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
                          key={j}
                          unit={{
                            uid: `f${i}r${j}`,
                            name: `部屋${j + 1}`,
                          }}
                          unitCheck={(inspect?.payload as UnitCheck[])?.find(
                            (uc) => uc.uid == `f${i}r${j}`
                          )}
                          onChange={(uc) => {
                            const payload = (inspect?.payload ??
                              []) as UnitCheck[]
                            onChange?.([
                              ...payload.filter((c) => c.uid != `f${i}r${j}`),
                              uc,
                            ])
                          }}
                        />
                      ))}
                    {Array(house.stepCount)
                      .fill(0)
                      .map((_, j) => (
                        <UnitBox
                          key={j}
                          unit={{ uid: `f${i}s${j}`, name: `階段${j + 1}` }}
                          unitCheck={(inspect?.payload as UnitCheck[])?.find(
                            (uc) => uc.uid == `f${i}s${j}`
                          )}
                          onChange={(uc) => {
                            const payload = (inspect?.payload ??
                              []) as UnitCheck[]
                            onChange?.([
                              ...payload.filter((c) => c.uid != `f${i}s${j}`),
                              uc,
                            ])
                          }}
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
    unit: Unit
    unitCheck?: UnitCheck
    onChange?(unitCheck: UnitCheck): void
  }
> = ({ unit, unitCheck, onChange, ...props }) => {
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
        onClick={() => setIsOpenCheckListModal(true)}
        {...props}
      >
        <h4>{unit.name}</h4>
      </div>
      <Modal
        isOpen={isOpenCheckListModal}
        onClose={() => setIsOpenCheckListModal(false)}
      >
        <h4>{unit.name}</h4>
        <div>
          <table style={{ fontSize: ".75rem", width: "100%" }}>
            <tbody>
              {defaultCheckList.map((check) => (
                <tr key={check.id}>
                  <td>{check.largeCategory}</td>
                  <td>{check.mediumCategory}</td>
                  <td>{check.smallCategory}</td>
                  <td>{check.part}</td>
                  <td>{check.detail}</td>
                  <td>
                    <select
                      value={
                        unitCheck?.checkList?.find((c) => c.id == check.id)
                          ?.rank
                      }
                      onChange={({ target: { value } }) => {
                        if (!unitCheck) return
                        onChange?.({
                          ...unitCheck,
                          checkList: [
                            ...(unitCheck.checkList ?? []).filter(
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
      </Modal>
    </>
  )
}
