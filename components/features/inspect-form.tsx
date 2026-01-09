import { FC } from "react"
import { UnitList } from "./unit-list"

export const InspectForm: FC<{ house: House; inspect?: Inspect }> = ({
  house,
  inspect,
}) => {
  return (
    <div>
      <h3>{house.name}点検</h3>
      <p>
        {(inspect
          ? new Date(inspect.createdAt)
          : new Date()
        ).toLocaleDateString()}
      </p>
      <UnitList house={house} />
    </div>
  )
}
