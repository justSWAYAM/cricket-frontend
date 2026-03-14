import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePlayerSearch } from "../hooks/usePlayerSearch";

export default function PlayerSearch({
  players = [],
  onSelect,
  placeholder = "Search player...",
  disabled = false,
}) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const results = usePlayerSearch(players, query);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  function handleSelect(player) {
    onSelect(player);
    setQuery("");
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) {
      // Open dropdown on arrow down if closed
      if (e.key === "ArrowDown" && !open) {
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setHighlightedIndex(-1);
        break;
      
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => { 
          setQuery(e.target.value); 
          setOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-xs font-mono tracking-wide outline-none"
        style={{
          background: colors.bgSecondary,
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          caretColor: colors.accent,
          opacity: disabled ? 0.4 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
        autoComplete="off"
        spellCheck={false}
      />

      {/* Dropdown — name only */}
      {open && results.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 z-50 max-h-48 overflow-y-auto"
          style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderTop: "none",
          }}
        >
          {results.map((player, index) => (
            <div
              key={player.id}
              onMouseDown={() => handleSelect(player)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className="px-3 py-2 cursor-pointer text-xs font-mono tracking-wide transition-colors duration-100"
              style={{
                color: colors.textSecondary,
                borderBottom: `1px solid ${colors.border}`,
                background: highlightedIndex === index ? colors.accentBg : "transparent",
              }}
            >
              {player.name}
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {open && query.length >= 2 && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 z-50 px-3 py-2"
          style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            borderTop: "none",
          }}
        >
          <span className="text-xs font-mono tracking-wide" style={{ color: colors.textMuted }}>
            NO PLAYERS FOUND
          </span>
        </div>
      )}
    </div>
  );
}