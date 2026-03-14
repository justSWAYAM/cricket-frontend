import { useState, useCallback, useRef } from "react";
import { TEAMS, NATIONALITIES, HARD_TEAMS, HARD_METRICS } from "../config/criteria";
import { getApiBaseUrl, getAdminHeaders } from "../config";
// ─── Easy Mode Constants ──────────────────────────────────────────────────────

const AFGHANISTAN_INCOMPATIBLE_TEAMS = ["KTK", "DQ", "PWI", "GL", "RPSG"];
const BANGLADESH_INCOMPATIBLE_TEAMS  = ["KTK", "LSG", "GT"];

const EQUIVALENT_TEAMS = {
  DD: ["DD", "DC"],
  DC: ["DD", "DC"],
};

// ─── Easy Mode Helpers ────────────────────────────────────────────────────────

function satisfiesEasy(player, criterion) {
  if (criterion.type === "team") {
    const codes = EQUIVALENT_TEAMS[criterion.code] || [criterion.code];
    return codes.some((c) => player.teams.includes(c));
  }
  if (criterion.type === "nationality") {
    return player.nationality === criterion.code;
  }
  return false;
}

export function isValidForCell(player, rowCriterion, colCriterion) {
  return satisfiesEasy(player, rowCriterion) && satisfiesEasy(player, colCriterion);
}

function teamsConflict(a, b) {
  if (a === b) return true;
  if ((a === "DD" && b === "DC") || (a === "DC" && b === "DD")) return true;
  return false;
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}



function getAvailableTeams(selectedNats) {
  const hasAfg = selectedNats.some((n) => n.code === "AFG");
  const hasBan = selectedNats.some((n) => n.code === "BAN");
  return TEAMS.filter((t) => {
    if (hasAfg && AFGHANISTAN_INCOMPATIBLE_TEAMS.includes(t.code)) return false;
    if (hasBan && BANGLADESH_INCOMPATIBLE_TEAMS.includes(t.code)) return false;
    return true;
  });
}

function pickEasyCriteria() {
  for (let attempt = 0; attempt < 50; attempt++) {
    const natCount = Math.floor(Math.random() * 4);
    let nats = shuffle(NATIONALITIES).slice(0, natCount);

    const hasPak = nats.some((n) => n.code === "PAK");
    const hasAfg = nats.some((n) => n.code === "AFG");
    if (hasPak && hasAfg) {
      const drop = Math.random() < 0.5 ? "PAK" : "AFG";
      nats = nats.filter((n) => n.code !== drop);
    }

    const availTeams  = getAvailableTeams(nats);
    const teamsNeeded = 6 - nats.length;
    if (availTeams.length < teamsNeeded) continue;

    const teams = shuffle(availTeams).slice(0, teamsNeeded);
    let rowCriteria, colCriteria;

    if (nats.length === 0) {
      const all = shuffle(teams);
      rowCriteria = all.slice(0, 3);
      colCriteria = all.slice(3, 6);
    } else {
      const natOnRows   = Math.random() < 0.5;
      const teamsForNat = shuffle(teams).slice(0, 3 - nats.length);
      const teamsForOther = teams.slice(3 - nats.length);
      if (natOnRows) {
        rowCriteria = shuffle([...nats, ...teamsForNat]);
        colCriteria = shuffle(teamsForOther.slice(0, 3));
      } else {
        colCriteria = shuffle([...nats, ...teamsForNat]);
        rowCriteria = shuffle(teamsForOther.slice(0, 3));
      }
    }

    const rowTeams = rowCriteria.filter((c) => c.type === "team").map((c) => c.code);
    const colTeams = colCriteria.filter((c) => c.type === "team").map((c) => c.code);
    let conflict = false;
    for (const r of rowTeams) {
      for (const c of colTeams) {
        if (teamsConflict(r, c)) { conflict = true; break; }
      }
      if (conflict) break;
    }
    if (conflict) continue;

    if (rowCriteria.some((c) => c.type === "nationality") &&
        colCriteria.some((c) => c.type === "nationality")) continue;

    return { rowCriteria, colCriteria };
  }

  const t = shuffle(TEAMS).slice(0, 6);
  return { rowCriteria: t.slice(0, 3), colCriteria: t.slice(3, 6) };
}

// ─── Hard Mode Helpers ────────────────────────────────────────────────────────

function pairKey(aType, aCode, bType, bCode) {
  const left = `${aType}:${aCode}`;
  const right = `${bType}:${bCode}`;
  return left < right ? `${left}|${right}` : `${right}|${left}`;
}

function weightedPickMetrics(metricsPool, count) {
  if (!metricsPool.length) return [];

  const weights = metricsPool.map((m) => Math.sqrt(m.playerCount));
  const total   = weights.reduce((s, w) => s + w, 0);
  const picked  = [];

  let safety = 0;
  while (picked.length < count && safety < 300) {
    safety += 1;
    let rand = Math.random() * total;
    for (let i = 0; i < metricsPool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        const m = metricsPool[i];
        if (!picked.find((p) => p.code === m.code)) picked.push(m);
        break;
      }
    }
  }
  return picked;
}

function pickHardCriteria(hardRules) {
  const disabledTeamCodes = hardRules?.disabledCriteria
    .filter((c) => c.criterionType === "team")
    .map((c) => c.criterionCode) || [];

  const disabledMetricCodes = hardRules?.disabledCriteria
    .filter((c) => c.criterionType === "metric")
    .map((c) => c.criterionCode) || [];

  const blockedPairSet = new Set(
    (hardRules?.blockedPairs || []).map((p) =>
      pairKey(p.criterionAType, p.criterionACode, p.criterionBType, p.criterionBCode)
    )
  );

  const teamsPool = HARD_TEAMS.filter((t) => t && !disabledTeamCodes.includes(t.code));
  const metricsPool = HARD_METRICS.filter((m) => !disabledMetricCodes.includes(m.code));

  if (teamsPool.length < 3 || metricsPool.length < 3) {
    return { rowCriteria: teamsPool.slice(0, 3), colCriteria: metricsPool.slice(0, 3) };
  }

  function hasBlockedPair(rowCriteria, colCriteria) {
    for (const row of rowCriteria) {
      for (const col of colCriteria) {
        const key = pairKey(row.type, row.code, col.type, col.code);
        if (blockedPairSet.has(key)) return true;
      }
    }
    return false;
  }

  for (let attempt = 0; attempt < 120; attempt++) {
  const gridType = Math.random() < 0.5 ? "teams_x_metrics" : "metrics_x_metrics";

    if (gridType === "teams_x_metrics") {
      const teams = shuffle(teamsPool).slice(0, 3);
      const metrics = weightedPickMetrics(metricsPool, 3);
      const selected = Math.random() < 0.5
      ? { rowCriteria: teams,    colCriteria: metrics }
      : { rowCriteria: metrics,  colCriteria: teams   };

      if (!hasBlockedPair(selected.rowCriteria, selected.colCriteria)) {
        return selected;
      }
    } else {
      const metrics = weightedPickMetrics(metricsPool, 6);
      if (metrics.length < 6) continue;
      const selected = { rowCriteria: metrics.slice(0, 3), colCriteria: metrics.slice(3, 6) };
      if (!hasBlockedPair(selected.rowCriteria, selected.colCriteria)) {
        return selected;
      }
    }
  }

  const fallbackTeams = shuffle(teamsPool).slice(0, 3);
  const fallbackMetrics = weightedPickMetrics(metricsPool, 3);
  return { rowCriteria: fallbackTeams, colCriteria: fallbackMetrics };
}

// ─── Shared Helpers ───────────────────────────────────────────────────────────

function buildEmptyCells() {
  return Array(9).fill(null).map(() => ({ status: "empty", player: null, hints: [] }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGrid(mode = "easy") {
  // BUG 4+5 FIX: use a ref to always have latest mode in callbacks
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const [hardRules,    setHardRules]    = useState({ disabledCriteria: [], blockedPairs: [] });
  const [criteria,     setCriteria]     = useState(() =>
    mode === "hard" ? pickHardCriteria({ disabledCriteria: [], blockedPairs: [] }) : pickEasyCriteria()
  );
  const [cells,        setCells]        = useState(buildEmptyCells);
  const [validPlayers, setValidPlayers] = useState(null);
  const [prefetching,  setPrefetching]  = useState(false);

  // ── Prefetch ──────────────────────────────────────────────────
  const prefetchHardCells = useCallback(async (rowCriteria, colCriteria) => {
    setPrefetching(true);
    try {
      const rows = rowCriteria.map((c) => c.code).join(",");
      const cols = colCriteria.map((c) => c.code).join(",");
      const hostname = window.location.hostname;
      const res  = await fetch(
        `${getApiBaseUrl()}/api/hard-cells?rows=${rows}&cols=${cols}`
      );
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const map  = new Map();
      for (const [idx, names] of Object.entries(data)) {
        const arr = Array.isArray(names) ? names : [];
        map.set(Number(idx), new Set(arr.map((n) => String(n).toLowerCase())));
      }
      setValidPlayers(map);
    } catch (err) {
      console.error("Hard mode prefetch failed:", err);
      setValidPlayers(new Map());
    } finally {
      setPrefetching(false);
    }
  }, []);

  const loadHardRules = useCallback(async () => {
    const res = await fetch(`${getApiBaseUrl()}/api/hard-grid/rules`);
    if (!res.ok) {
      throw new Error(`Failed to load hard-grid rules: ${res.status}`);
    }
    const data = await res.json();
    const rules = {
      disabledCriteria: Array.isArray(data.disabledCriteria) ? data.disabledCriteria : [],
      blockedPairs: Array.isArray(data.blockedPairs) ? data.blockedPairs : [],
    };
    setHardRules(rules);
    return rules;
  }, []);

  // ── validateCell ──────────────────────────────────────────────
  const validateCell = useCallback((cellIndex, player) => {
    let valid = false;

    if (modeRef.current === "easy") {
      const row = criteria.rowCriteria[Math.floor(cellIndex / 3)];
      const col = criteria.colCriteria[cellIndex % 3];
      valid = isValidForCell(player, row, col);
    } else {
      const cellSet = validPlayers?.get(cellIndex);
      valid = cellSet ? cellSet.has(player.name.toLowerCase()) : false;
    }

    setCells((prev) => {
      const next = [...prev];
      next[cellIndex] = {
        status: valid ? "correct" : "wrong",
        player: valid ? player : null,
        hints:  [],
      };
      return next;
    });

    if (!valid) {
      setTimeout(() => {
        setCells((prev) => {
          const next = [...prev];
          if (next[cellIndex].status === "wrong") {
            next[cellIndex] = { status: "empty", player: null, hints: [] };
          }
          return next;
        });
      }, 800);
    }

    return valid;
  }, [criteria, validPlayers]); // modeRef is a ref, no need in deps

  // ── newGame ───────────────────────────────────────────────────
  // BUG 4+5 FIX: read mode from modeRef so it always has latest value
  const newGame = useCallback(async (overrideMode) => {
    const currentMode = overrideMode ?? modeRef.current;
    let newCriteria;
    if (currentMode === "hard") {
      const rules = await loadHardRules().catch(() => hardRules);
      newCriteria = pickHardCriteria(rules);
    } else {
      newCriteria = pickEasyCriteria();
    }
    setCriteria(newCriteria);
    setCells(buildEmptyCells());
    setValidPlayers(null);
    if (currentMode === "hard") {
      prefetchHardCells(newCriteria.rowCriteria, newCriteria.colCriteria);
    }
  }, [prefetchHardCells, loadHardRules, hardRules]);

  // ── giveUpCell ────────────────────────────────────────────────
  const giveUpCell = useCallback((cellIndex, hints) => {
    setCells((prev) => {
      const next = [...prev];
      next[cellIndex] = { status: "givenup", player: null, hints: hints || [] };
      return next;
    });
  }, []);

  const isComplete = cells.every((c) => c.status === "correct");
  const score      = cells.filter((c) => c.status === "correct").length;

  return {
    rowCriteria:      criteria.rowCriteria,
    colCriteria:      criteria.colCriteria,
    cells,
    validateCell,
    newGame,
    isComplete,
    score,
    giveUpCell,
    prefetchHardCells,
    prefetching,
    validPlayers,
    hardRules,
    loadHardRules,
  };
}