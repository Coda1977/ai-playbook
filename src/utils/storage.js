import { LS_KEY } from "../config/constants";

export function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.phase) return parsed;
    }
  } catch {}
  return null;
}

export function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {}
}

export function clearState() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}
