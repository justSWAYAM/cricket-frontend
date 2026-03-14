import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getPlayers, getHints } from "../services/PlayerService";
import { useGrid, isValidForCell } from "../hooks/useGrid";
import GridBoard from "../components/grid/GridBoard";
import PlayerSearch from "../components/PlayerSearch";
import FormulaPanel from "../components/Formulapanel";
import PlayOptionsPanel from "../components/PlayOptionsPanel";
import FeedbackForm from "../components/FeedbackForm";

const DIFFICULTIES = [
  { label: "EASY", value: "easy",  live: true },
  { label: "HARD", value: "hard",  live: true },
];

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const createEmptyMarks = () => Array(9).fill(null);

export default function GridPage() {
  const { colors } = useTheme();
  const [mode, setMode] = useState("easy");

  const [players,     setPlayers]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const [selectedPlayer,    setSelectedPlayer]    = useState(null);
  const [availableCells,    setAvailableCells]    = useState([]);
  const [noFormationError,  setNoFormationError]  = useState(false);
  const [showFeedback,      setShowFeedback]      = useState(false);
  const [givingUp,          setGivingUp]          = useState(false);
  const [isMultiplayer,     setIsMultiplayer]     = useState(false);
  const [useTurnTimer,      setUseTurnTimer]      = useState(false);
  const [turnDuration,      setTurnDuration]      = useState(10);
  const [customTime,        setCustomTime]        = useState("10");
  const [timeLeft,          setTimeLeft]          = useState(10);
  const [currentTurn,       setCurrentTurn]       = useState("X");
  const [multiplayerMarks,  setMultiplayerMarks]  = useState(createEmptyMarks);
  const [multiplayerResult, setMultiplayerResult] = useState(null);
  const [multiplayerStarted, setMultiplayerStarted] = useState(false);

  const xPlayerName = "Player X";
  const oPlayerName = "Player O";

  const {
    rowCriteria, colCriteria, cells,
    validateCell, newGame, isComplete, giveUpCell,
    prefetchHardCells, prefetching, validPlayers,
  } = useGrid(mode);

  // Load players once
  useEffect(() => {
    getPlayers()
      .then(setPlayers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Prefetch hard cells whenever we switch to hard mode or start a new hard game
  useEffect(() => {
    if (mode === "hard" && rowCriteria.length && !validPlayers && !prefetching) {
      prefetchHardCells(rowCriteria, colCriteria);
    }
  }, [mode, rowCriteria, colCriteria, validPlayers, prefetching, prefetchHardCells]);

  useEffect(() => {
    if (isMultiplayer) {
      setSelectedPlayer(null);
      setAvailableCells([]);
      setNoFormationError(false);
      setTimeLeft(turnDuration);
    }
  }, [isMultiplayer, turnDuration]);

  useEffect(() => {
    if (!isMultiplayer || !multiplayerStarted || !useTurnTimer || multiplayerResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isMultiplayer, multiplayerStarted, useTurnTimer, multiplayerResult, turnDuration]);

  useEffect(() => {
    if (!isMultiplayer || !multiplayerStarted || !useTurnTimer || multiplayerResult) return;
    if (timeLeft > 0) return;

    // Time up: hand over turn and clear pending selection.
    setCurrentTurn((turn) => (turn === "X" ? "O" : "X"));
    setSelectedPlayer(null);
    setAvailableCells([]);
    setTimeLeft(turnDuration);
  }, [
    isMultiplayer,
    multiplayerStarted,
    useTurnTimer,
    multiplayerResult,
    timeLeft,
    turnDuration,
  ]);

  const availablePlayers = players.filter(
    (p) => !cells.some((c) => c.player?.id === p.id)
  );

  const handlePlayerSelect = (player) => {
    if (isMultiplayer && !multiplayerStarted) return;
    if (isMultiplayer && multiplayerResult) return;

    if (mode === "easy") {
      // Client-side validation
      const validCellIndices = [];
      for (let i = 0; i < 9; i++) {
        if (cells[i].status !== "empty") continue;
        const row = rowCriteria[Math.floor(i / 3)];
        const col = colCriteria[i % 3];
        if (isValidForCell(player, row, col)) validCellIndices.push(i);
      }
      if (validCellIndices.length === 0) {
        setNoFormationError(true);
        setTimeout(() => setNoFormationError(false), 3000);
        return;
      }
      setNoFormationError(false);
      if (validCellIndices.length === 1) {
        const cellIndex = validCellIndices[0];
        const valid = validateCell(cellIndex, player);
        if (valid && isMultiplayer) {
          const mark = currentTurn;
          const nextMarks = [...multiplayerMarks];
          nextMarks[cellIndex] = mark;
          setMultiplayerMarks(nextMarks);

          const winner = WINNING_LINES.find(([a, b, c]) => {
            const currentMark = nextMarks[a];
            return currentMark && currentMark === nextMarks[b] && currentMark === nextMarks[c];
          });

          if (winner) {
            const winnerName = mark === "X" ? xPlayerName : oPlayerName;
            setMultiplayerResult(`${mark} (${winnerName}) WINS`);
          } else if (nextMarks.every((m) => m)) {
            setMultiplayerResult("DRAW");
          } else {
            setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
            if (useTurnTimer) setTimeLeft(turnDuration);
          }
        }
        setSelectedPlayer(null);
        setAvailableCells([]);
        return;
      }
      setSelectedPlayer(player);
      setAvailableCells(validCellIndices);

    } else {
      // Hard mode: check prefetched validPlayers map
      if (!validPlayers) return; // still loading
      const validCellIndices = [];
      for (let i = 0; i < 9; i++) {
        if (cells[i].status !== "empty") continue;
        const cellSet = validPlayers.get(i);
        if (cellSet?.has(player.name.toLowerCase())) validCellIndices.push(i);
      }
      if (validCellIndices.length === 0) {
        setNoFormationError(true);
        setTimeout(() => setNoFormationError(false), 3000);
        return;
      }
      setNoFormationError(false);
      if (validCellIndices.length === 1) {
        const cellIndex = validCellIndices[0];
        const valid = validateCell(cellIndex, player);
        if (valid && isMultiplayer) {
          const mark = currentTurn;
          const nextMarks = [...multiplayerMarks];
          nextMarks[cellIndex] = mark;
          setMultiplayerMarks(nextMarks);

          const winner = WINNING_LINES.find(([a, b, c]) => {
            const currentMark = nextMarks[a];
            return currentMark && currentMark === nextMarks[b] && currentMark === nextMarks[c];
          });

          if (winner) {
            const winnerName = mark === "X" ? xPlayerName : oPlayerName;
            setMultiplayerResult(`${mark} (${winnerName}) WINS`);
          } else if (nextMarks.every((m) => m)) {
            setMultiplayerResult("DRAW");
          } else {
            setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
            if (useTurnTimer) setTimeLeft(turnDuration);
          }
        }
        setSelectedPlayer(null);
        setAvailableCells([]);
        return;
      }
      setSelectedPlayer(player);
      setAvailableCells(validCellIndices);
    }
  };

  const handleCellClick = (cellIndex) => {
    if (isMultiplayer && !multiplayerStarted) return;
    if (!selectedPlayer || !availableCells.includes(cellIndex)) return;
    const valid = validateCell(cellIndex, selectedPlayer);

    if (valid && isMultiplayer) {
      const mark = currentTurn;
      const nextMarks = [...multiplayerMarks];
      nextMarks[cellIndex] = mark;
      setMultiplayerMarks(nextMarks);

      const winner = WINNING_LINES.find(([a, b, c]) => {
        const currentMark = nextMarks[a];
        return currentMark && currentMark === nextMarks[b] && currentMark === nextMarks[c];
      });

      if (winner) {
        const winnerName = mark === "X" ? xPlayerName : oPlayerName;
        setMultiplayerResult(`${mark} (${winnerName}) WINS`);
      } else if (nextMarks.every((m) => m)) {
        setMultiplayerResult("DRAW");
      } else {
        setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
        if (useTurnTimer) setTimeLeft(turnDuration);
      }
    }

    setSelectedPlayer(null);
    setAvailableCells([]);
  };

  const handleGiveUp = async () => {
    const firstEmpty = cells.findIndex((c) => c.status === "empty");
    if (firstEmpty === -1) return;
    setGivingUp(true);

    // Build set of names already used (correct cells + already shown hints)
    const usedNames = new Set([
      ...cells
        .filter((c) => c.status === "correct" && c.player)
        .map((c) => c.player.name.toLowerCase()),
      ...cells
        .filter((c) => c.status === "givenup" && c.hints?.length)
        .map((c) => (typeof c.hints[0] === "string"
          ? c.hints[0].toLowerCase()
          : (c.hints[0]?.name ?? "").toLowerCase())),
    ]);

    try {
      if (mode === "hard") {
        // Hard mode: pick 1 unused player from prefetched validPlayers map
        const cellSet = validPlayers?.get(firstEmpty);
        const unusedHint = cellSet
          ? [...cellSet].find((name) => !usedNames.has(name))
          : null;
        giveUpCell(firstEmpty, unusedHint ? [unusedHint] : []);
      } else {
        // Easy mode: call hints API, pick 1 unused
        const row = rowCriteria[Math.floor(firstEmpty / 3)];
        const col = colCriteria[firstEmpty % 3];
        const result = await getHints(row, col);
        const allHints = result.hints || [];
        const unusedHint = allHints.find(
          (h) => !usedNames.has((h.name || h).toLowerCase())
        );
        giveUpCell(firstEmpty, unusedHint ? [unusedHint] : []);
      }
    } catch {
      giveUpCell(firstEmpty, []);
    } finally {
      setGivingUp(false);
    }
  };

  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setSelectedPlayer(null);
    setAvailableCells([]);
    setNoFormationError(false);
    newGame(newMode); // pass newMode explicitly to avoid stale closure
  };

  const resetMultiplayerGame = () => {
    setMultiplayerMarks(createEmptyMarks());
    setCurrentTurn("X");
    setMultiplayerResult(null);
    setTimeLeft(turnDuration);
    setSelectedPlayer(null);
    setAvailableCells([]);
    setMultiplayerStarted(false);
    newGame(mode);
  };

  const handleStartMultiplayerGame = () => {
    setMultiplayerMarks(createEmptyMarks());
    setCurrentTurn("X");
    setMultiplayerResult(null);
    setSelectedPlayer(null);
    setAvailableCells([]);
    setNoFormationError(false);
    setTimeLeft(turnDuration);
    setMultiplayerStarted(true);
    newGame(mode);
  };

  const handleResetGame = () => {
    if (isMultiplayer) {
      resetMultiplayerGame();
      return;
    }
    newGame(mode);
  };

  const isSearchDisabled = (isMultiplayer ? (!multiplayerStarted || Boolean(multiplayerResult)) : isComplete)
    || (mode === "hard" && (prefetching || !validPlayers));

  const handleSetClassicMode = () => {
    setIsMultiplayer(false);
  };

  const handleSetMultiplayerMode = () => {
    setIsMultiplayer(true);
    resetMultiplayerGame();
  };

  const handleToggleTurnTimer = () => {
    setUseTurnTimer((prev) => !prev);
    setTimeLeft(turnDuration);
  };

  const handleCustomTimeChange = (raw) => {
    setCustomTime(raw);
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1) {
      const safe = Math.floor(parsed);
      setTurnDuration(safe);
      setTimeLeft(safe);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: colors.bg, color: colors.textSecondary }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-center px-4 md:px-8 py-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <a href="/" className="text-xs md:text-sm font-mono tracking-widest" style={{ color: colors.textSecondary }}>
          CRICKETXI
        </a>
      </div>

      <div className="flex items-center justify-center border-b" style={{ borderColor: colors.border }}>
        {DIFFICULTIES.map((d, i) => (
          <button
            key={d.value}
            onClick={() => handleModeSwitch(d.value)}
            className="px-8 py-2 text-xs font-mono tracking-widest border-r transition-all"
            style={{
              borderColor: colors.border,
              borderLeft: i === 0 ? "none" : undefined,
              color:       mode === d.value ? colors.accent    : colors.textDisabled,
              background:  mode === d.value ? colors.accentBg  : "transparent",
              cursor: "pointer",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 px-2 md:px-4 py-4 md:py-6">

        {loading && (
          <p className="text-xs font-mono tracking-widest animate-pulse" style={{ color: colors.textMuted }}>
            LOADING PLAYERS...
          </p>
        )}

        {error && (
          <p className="text-xs font-mono tracking-widest" style={{ color: "#ff4444" }}>
            ERROR: {error}
          </p>
        )}

        {/* Hard mode loading state */}
        {mode === "hard" && prefetching && (
          <p className="text-xs font-mono tracking-widest animate-pulse" style={{ color: colors.textMuted }}>
            LOADING GRID DATA...
          </p>
        )}

        <div className="mx-auto w-full max-w-300 lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,16rem)] items-start gap-4 md:gap-6 lg:gap-6">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4 md:gap-6 lg:col-start-2 order-1 lg:order-2">
            {isComplete && !isMultiplayer && (
              <div
                className="w-full px-4 py-3 text-center font-mono text-xs tracking-widest"
                style={{ border: `1px solid ${colors.accentBorder}`, background: colors.accentBg, color: colors.accent }}
              >
                🏏 GRID COMPLETE! WELL PLAYED.
              </div>
            )}

            {!loading && !error && (
              <div className="w-[80%] mx-auto">
                <GridBoard
                  rowCriteria={rowCriteria}
                  colCriteria={colCriteria}
                  cells={cells}
                  availableCells={availableCells}
                  isMultiplayer={isMultiplayer}
                  multiplayerMarks={multiplayerMarks}
                  multiplayerPlayers={{ X: xPlayerName, O: oPlayerName }}
                  onCellClick={handleCellClick}
                />
              </div>
            )}

            {!loading && !error && ((isMultiplayer && multiplayerStarted && !multiplayerResult) || (!isMultiplayer && !isComplete)) && (
              <div className="w-full px-2 md:px-0">
                {noFormationError && (
                  <div
                    className="mb-2 px-3 py-2 text-[10px] md:text-xs font-mono tracking-wide text-center"
                    style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.4)", color: "#ff3c3c" }}
                  >
                    ⚠ NO VALID FORMATION FOR THIS PLAYER
                  </div>
                )}
                <PlayerSearch
                  players={availablePlayers}
                  onSelect={handlePlayerSelect}
                  placeholder={isMultiplayer && !multiplayerStarted ? "PRESS START MULTIPLAYER" : (isSearchDisabled ? "GAME OVER" : "TYPE PLAYER NAME...")}
                  disabled={isSearchDisabled}
                />
                {selectedPlayer && (
                  <p className="mt-2 text-[10px] md:text-xs font-mono tracking-wide text-center" style={{ color: colors.accent }}>
                    {isMultiplayer
                      ? `TURN ${currentTurn} (${currentTurn === "X" ? xPlayerName : oPlayerName}) • SELECT A CELL FOR ${selectedPlayer.name.toUpperCase()}`
                      : `SELECT A CELL FOR ${selectedPlayer.name.toUpperCase()}`}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleResetGame}
              className="px-4 md:px-6 py-2 text-[10px] md:text-xs font-mono tracking-widest transition-all duration-150"
              style={{ border: `1px solid ${colors.border}`, color: colors.textMuted, background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentBorder; e.currentTarget.style.color = colors.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
            >
              NEW GAME →
            </button>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-2">
              {!isMultiplayer && (
                <button
                  onClick={handleGiveUp}
                  disabled={givingUp || isComplete || !cells.some((c) => c.status === "empty")}
                  className="px-3 md:px-4 py-2 text-[10px] md:text-xs font-mono tracking-widest transition-all duration-150"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.textMuted,
                    background: "transparent",
                    opacity: (givingUp || isComplete || !cells.some((c) => c.status === "empty")) ? 0.5 : 1,
                    cursor:  (givingUp || isComplete || !cells.some((c) => c.status === "empty")) ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!givingUp && !isComplete && cells.some((c) => c.status === "empty")) {
                      e.currentTarget.style.borderColor = "rgba(255,165,0,0.5)";
                      e.currentTarget.style.color = "rgba(255,165,0,0.8)";
                    }
                  }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
                >
                  {givingUp ? "LOADING..." : "GIVE UP"}
                </button>
              )}

              <button
                onClick={() => setShowFeedback(true)}
                className="px-3 md:px-4 py-2 text-[10px] md:text-xs font-mono tracking-widest transition-all duration-150 whitespace-nowrap"
                style={{ border: `1px solid ${colors.border}`, color: colors.textMuted, background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.accentBorder; e.currentTarget.style.color = colors.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
              >
                📝 REPORT MISSING PLAYER
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm lg:max-w-72 mx-auto lg:mx-0 lg:col-start-1 lg:sticky lg:top-6 order-2 lg:order-1">
            <PlayOptionsPanel
              isMultiplayer={isMultiplayer}
              setClassicMode={handleSetClassicMode}
              setMultiplayerMode={handleSetMultiplayerMode}
              useTurnTimer={useTurnTimer}
              toggleTurnTimer={handleToggleTurnTimer}
              customTime={customTime}
              onCustomTimeChange={handleCustomTimeChange}
              currentTurn={currentTurn}
              xPlayerName={xPlayerName}
              oPlayerName={oPlayerName}
              multiplayerStarted={multiplayerStarted}
              timeLeft={timeLeft}
              multiplayerResult={multiplayerResult}
              onPrimaryAction={isMultiplayer ? handleStartMultiplayerGame : handleResetGame}
            />
          </div>

          <div className="w-full max-w-sm lg:max-w-64 mx-auto lg:mx-0 lg:col-start-3 lg:sticky lg:top-6 order-3">
            <FormulaPanel />
          </div>
        </div>
      </div>

      {showFeedback && <FeedbackForm onClose={() => setShowFeedback(false)} />}
    </div>
  );
}