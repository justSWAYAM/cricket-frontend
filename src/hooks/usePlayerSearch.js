import { useMemo } from "react";
import Fuse from "fuse.js";

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.35,      // 0 = exact, 1 = match anything — 0.35 handles typos well
  minMatchCharLength: 2,
  shouldSort: true,
};

/**
 * Reusable player search hook using Fuse.js
 *
 * @param {Array}    players  - full player list from playerService
 * @param {string}   query    - search string typed by user
 * @param {Function} filter   - optional fn(player) => bool to narrow results per context
 * @param {number}   limit    - max results to return (default 8)
 *
 * @returns {Array} matched players
 */
export function usePlayerSearch(players = [], query = "", filter = null, limit = 8) {
  // Build Fuse index — only rebuilds when players array changes
  const fuse = useMemo(() => new Fuse(players, FUSE_OPTIONS), [players]);

  const results = useMemo(() => {
    if (!query || query.trim().length < 2) return [];

    const matched = fuse
      .search(query.trim())
      .map((r) => r.item);

    // Apply optional context filter (e.g. grid: only show players valid for a cell)
    const filtered = filter ? matched.filter(filter) : matched;

    return filtered.slice(0, limit);
  }, [fuse, query, filter, limit]);

  return results;
}