const CACHE_KEY = "cricketxi_players";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
import { getApiBaseUrl, getAdminHeaders } from "../config";
// BUG 1 FIX: was using port 5001, backend is on 5000

export async function getPlayers() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log("✅ Players loaded from cache");
        return data;
      }
    }
  } catch (e) {
    console.warn("Cache read failed:", e);
  }

  const apiUrl = `${getApiBaseUrl()}/api/players`;
  console.log("🌐 Fetching players from API:", apiUrl);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("Failed to fetch players");
  const data = await res.json();

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    console.log(`✅ ${data.length} players cached`);
  } catch (e) {
    console.warn("Cache write failed:", e);
  }

  return data;
}

export function clearPlayerCache() {
  localStorage.removeItem(CACHE_KEY);
}

export async function getHints(rowCriterion, colCriterion) {
  const apiUrl = `${getApiBaseUrl()}/api/hints`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rowCriterion, colCriterion }),
  });
  if (!res.ok) throw new Error("Failed to fetch hints");
  return await res.json();
}