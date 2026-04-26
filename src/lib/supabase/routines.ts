import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { Routine, Reflection } from "@/lib/training/types";

const ROUTINES_COLLECTION = "routines";

function routinesRef() {
  if (!db) throw new Error("Firestore not configured");
  return collection(db, ROUTINES_COLLECTION);
}

function routineDocRef(id: string) {
  if (!db) throw new Error("Firestore not configured");
  return doc(db, ROUTINES_COLLECTION, id);
}

const MAX_ROUTINES_PER_FETCH = 200;

export async function getUserRoutines(userId: string): Promise<Routine[]> {
  const q = query(
    routinesRef(),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(MAX_ROUTINES_PER_FETCH),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Routine, "id">) }));
}

export async function createRoutine(userId: string, routine: Omit<Routine, "id" | "userId" | "createdAt">): Promise<Routine> {
  const docRef = await addDoc(routinesRef(), {
    ...routine,
    userId,
    completions: routine.completions ?? {},
    reflections: routine.reflections ?? {},
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...(snap.data() as Omit<Routine, "id">) };
}

async function assertOwnership(userId: string, routineId: string): Promise<Routine> {
  const snap = await getDoc(routineDocRef(routineId));
  if (!snap.exists()) throw new Error("Routine not found");
  const data = snap.data() as Routine;
  if (data.userId !== userId) throw new Error("Forbidden: you do not own this routine");
  return data;
}

export async function updateRoutine(
  userId: string,
  routineId: string,
  fields: Partial<Pick<Routine, "title" | "meta" | "weeks" | "completions" | "reflections">>,
): Promise<void> {
  await assertOwnership(userId, routineId);
  await updateDoc(routineDocRef(routineId), fields);
}

export async function deleteRoutine(userId: string, routineId: string): Promise<void> {
  await assertOwnership(userId, routineId);
  await deleteDoc(routineDocRef(routineId));
}

export async function toggleSessionCompletion(
  userId: string,
  routineId: string,
  key: string,
): Promise<boolean> {
  const data = await assertOwnership(userId, routineId);
  const completions = { ...(data.completions ?? {}) };
  completions[key] = !completions[key];
  await updateDoc(routineDocRef(routineId), { completions });
  return completions[key];
}

export async function saveReflection(
  userId: string,
  routineId: string,
  key: string,
  reflection: Reflection,
): Promise<void> {
  const data = await assertOwnership(userId, routineId);
  const reflections = { ...(data.reflections ?? {}), [key]: reflection };
  await updateDoc(routineDocRef(routineId), { reflections });
}

export async function getUserTrainingStats(userId: string) {
  const routines = await getUserRoutines(userId);
  const routinesSaved = routines.length;

  let sessionsCompleted = 0;
  const weaknessCoverage: Record<string, number> = {};

  for (const r of routines) {
    const completions = r.completions ?? {};
    for (const [, done] of Object.entries(completions)) {
      if (done) sessionsCompleted++;
    }
    const weaknesses = r.profileSnapshot?.weaknesses ?? [];
    for (const w of weaknesses) {
      weaknessCoverage[w] = (weaknessCoverage[w] ?? 0) + 1;
    }
  }

  return {
    routinesSaved,
    sessionsCompleted,
    currentStreak: 0,   // streak calculation requires date-stamped completions — future enhancement
    longestStreak: 0,
    weaknessCoverage,
  };
}
