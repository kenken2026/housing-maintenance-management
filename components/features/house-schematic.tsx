import { type FC } from "react"

const CELL_W = 48
const CELL_H = 32
const LABEL_W = 28
const FONT_SIZE = 10
const GROUND_H = 8

// Returns column indices that should be stairs (0-indexed, evenly distributed)
const stairColumns = (totalColumns: number, stepCount: number): Set<number> => {
  const indices = new Set<number>()
  for (let i = 0; i < stepCount; i++) {
    indices.add(Math.floor(((i + 1) * totalColumns) / (stepCount + 1)))
  }
  return indices
}

export const HouseSchematic: FC<{
  floorCount: number
  roomCount: number
  stepCount: number
  floorInformation?: FloorInformation
}> = ({ floorCount, roomCount, stepCount, floorInformation }) => {
  const floorData = floorInformation
    ? [...floorInformation].sort((a, b) => b.floor - a.floor)
    : Array.from({ length: floorCount }, (_, i) => ({
        floor: floorCount - i,
        roomCount,
        stepCount,
      }))

  const maxTotalColumns = Math.max(
    ...floorData.map((f) => f.roomCount + f.stepCount)
  )
  const svgWidth = LABEL_W + maxTotalColumns * CELL_W + 1
  const svgHeight = floorData.length * CELL_H + GROUND_H + 1

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{ display: "block", overflow: "visible" }}
    >
      {floorData.map((fd, fi) => {
        const totalColumns = fd.roomCount + fd.stepCount
        const stairs = stairColumns(totalColumns, fd.stepCount)
        const y = fi * CELL_H
        return (
          <g key={fd.floor}>
            <text
              x={LABEL_W / 2}
              y={y + CELL_H / 2 + FONT_SIZE / 3}
              textAnchor="middle"
              fontSize={FONT_SIZE}
              fill="#555"
            >
              {fd.floor}F
            </text>
            {Array.from({ length: totalColumns }, (_, ci) => {
              const isStair = stairs.has(ci)
              const x = LABEL_W + ci * CELL_W
              return (
                <g key={ci}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL_W}
                    height={CELL_H}
                    fill={isStair ? "#fffbe6" : "#e8f0fe"}
                    stroke="#aaa"
                    strokeWidth={1}
                  />
                  {isStair && (
                    <>
                      <line
                        x1={x + 4}
                        y1={y + CELL_H - 4}
                        x2={x + CELL_W - 4}
                        y2={y + 4}
                        stroke="#bbb"
                        strokeWidth={1}
                      />
                      <text
                        x={x + CELL_W / 2}
                        y={y + CELL_H / 2 + FONT_SIZE / 3}
                        textAnchor="middle"
                        fontSize={FONT_SIZE - 1}
                        fill="#888"
                      >
                        階段
                      </text>
                    </>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
      <rect
        x={LABEL_W}
        y={floorData.length * CELL_H}
        width={maxTotalColumns * CELL_W}
        height={GROUND_H}
        fill="#c8b99a"
        stroke="#aaa"
        strokeWidth={1}
      />
    </svg>
  )
}
