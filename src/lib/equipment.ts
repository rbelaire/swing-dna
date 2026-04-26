/**
 * Fetches the equipment catalog from Firestore.
 *
 * - Falls back to the local seed data when Firebase is not configured
 *   (dev without env vars, or before Firestore has been populated).
 * - Caches the result in localStorage for 1 hour to avoid redundant reads.
 * - Grouping by category is done here so callers receive a ready-to-use
 *   catalog object.
 */

import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./client";
import { balls, drivers, irons, shafts } from "../data/seed";
import type { EquipmentOption } from "../data/seed";

export interface EquipmentCatalog {
  balls: EquipmentOption[];
  drivers: EquipmentOption[];
  irons: EquipmentOption[];
  shafts: EquipmentOption[];
}

const CACHE_KEY = "gsgl_equipment_cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const SEED_CATALOG: EquipmentCatalog = { balls, drivers, irons, shafts };

function groupByCategory(options: EquipmentOption[]): EquipmentCatalog {
  return {
    balls: options.filter((o) => o.category === "ball"),
    drivers: options.filter((o) => o.category === "driver"),
    irons: options.filter((o) => o.category === "irons"),
    shafts: options.filter((o) => o.category === "shaft"),
  };
}

function readCache(): EquipmentOption[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw) as {
      data: EquipmentOption[];
      timestamp: number;
    };
    return Date.now() - timestamp < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: EquipmentOption[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage quota exceeded — ignore
  }
}

export function clearEquipmentCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

export async function fetchEquipmentCatalog(): Promise<EquipmentCatalog> {
  if (!isFirebaseConfigured || !db) return SEED_CATALOG;

  const cached = readCache();
  if (cached) return groupByCategory(cached);

  try {
    const snapshot = await getDocs(collection(db, "equipment"));
    if (snapshot.empty) return SEED_CATALOG;

    const data = snapshot.docs.map((d) => d.data() as EquipmentOption);
    writeCache(data);
    return groupByCategory(data);
  } catch {
    // Network error or permission issue — fall back to seed
    return SEED_CATALOG;
  }
}
