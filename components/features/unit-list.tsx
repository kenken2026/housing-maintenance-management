import { OuteriorUnits, ResidenceUnits } from "lib/constant"
import { ComponentProps, FC } from "react"

export const UnitList: FC<{ house: House }> = ({ house }) => {
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
                <UnitBox key={unit.uid} unit={unit} />
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
                <UnitBox key={unit.uid} unit={unit} />
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
                        />
                      ))}
                    {Array(house.stepCount)
                      .fill(0)
                      .map((_, j) => (
                        <UnitBox
                          key={j}
                          unit={{ uid: `f${i}s${j}`, name: `階段${j + 1}` }}
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

const UnitBox: FC<ComponentProps<"div"> & { unit: Unit }> = ({
  unit,
  ...props
}) => {
  return (
    <div
      style={{
        border: "2px solid #ddd",
        borderRadius: ".25rem",
        padding: ".5rem 1rem",
      }}
      {...props}
    >
      <h4>{unit.name}</h4>
    </div>
  )
}
