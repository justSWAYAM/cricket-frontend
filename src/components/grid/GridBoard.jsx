import { useTheme } from "../../context/ThemeContext";
import GridCell from "./GridCell";
import CriteriaBadge from "./CriteriaBadge";
import Logo from "../Logo";

/**
 * GridBoard
 * Renders the full 3×3 grid with row/col headers
 *
 * Props:
 *   rowCriteria    - array of 3 criteria (left headers)
 *   colCriteria    - array of 3 criteria (top headers)
 *   cells          - array of 9 cell states
 *   availableCells - array of cell indices that can be selected
 *   onCellClick    - fn(cellIndex) - called when highlighted cell is clicked
 */
export default function GridBoard({
  rowCriteria,
  colCriteria,
  cells,
  availableCells = [],
  isMultiplayer = false,
  multiplayerMarks = [],
  multiplayerPlayers = { X: "Player X", O: "Player O" },
  onCellClick,
}) {
  const { colors } = useTheme();

  return (
    <div className="flex items-center justify-center w-full px-2 md:px-4">
      <div
        className="w-full max-w-3xl"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          border: `1px solid ${colors.border}`,
          gap: "0",
          aspectRatio: "1 / 1",
        }}
      >
        {/* Top-left corner with CricketXI logo */}
        <div 
          className="flex items-center justify-center overflow-hidden" 
          style={{ 
            background: colors.bg, 
            border: `1px solid ${colors.border}`,
            aspectRatio: "1 / 1",
          }}
        >
          <Logo size="md" variant="full" />
        </div>

        {/* Column headers */}
        {colCriteria.map((criterion, i) => (
          <div 
            key={i} 
            style={{ 
              border: `1px solid ${colors.border}`,
              aspectRatio: "1 / 1",
              overflow: "hidden",
            }}
          >
            <CriteriaBadge criterion={criterion} size="sm" />
          </div>
        ))}

        {/* Rows: row header + 3 cells */}
        {rowCriteria.map((rowCriterion, rowIndex) => (
          <>
            {/* Row header */}
            <div 
              key={`row-${rowIndex}`} 
              style={{ 
                border: `1px solid ${colors.border}`,
                aspectRatio: "1 / 1",
                overflow: "hidden",
              }}
            >
              <CriteriaBadge criterion={rowCriterion} size="sm" />
            </div>

            {/* 3 cells for this row */}
            {colCriteria.map((colCriterion, colIndex) => {
              const cellIndex = rowIndex * 3 + colIndex;
              return (
                <div 
                  key={cellIndex} 
                  style={{ 
                    border: `1px solid ${colors.border}`,
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                  }}
                >
                  <GridCell
                    cellIndex={cellIndex}
                    status={cells[cellIndex].status}
                    player={cells[cellIndex].player}
                    hints={cells[cellIndex].hints}
                    isHighlighted={availableCells.includes(cellIndex)}
                    isMultiplayer={isMultiplayer}
                    marker={multiplayerMarks[cellIndex] ?? null}
                    multiplayerPlayers={multiplayerPlayers}
                    onCellClick={onCellClick}
                  />
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}