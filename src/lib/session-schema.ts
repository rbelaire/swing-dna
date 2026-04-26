import { z } from "zod";

export const profileSchema = z.object({
  handicap: z.coerce.number().min(0).max(54),
  heightIn: z.coerce.number().min(48).max(84),
  wristToFloorIn: z.coerce.number().min(20).max(45),
  ageRange: z.enum(["under30", "30to50", "over50"]),
  tempo: z.enum(["smooth", "medium", "aggressive"]),
  missTendency: z.enum(["left", "right", "both"]),
  trajectory: z.enum(["low", "mid", "high"]),
});

export const equipmentSchema = z.object({
  driverModel: z.string(),
  driverLoft: z.string(),
  driverShaft: z.string(),
  ironModel: z.string(),
  ironShaft: z.string(),
  ballModel: z.string(),
});

export const launchDataSchema = z.object({
  clubSpeed: z.coerce.number().optional(),
  ballSpeed: z.coerce.number().optional(),
  launchAngle: z.coerce.number().optional(),
  spinRate: z.coerce.number().optional(),
  carryDistance: z.coerce.number().optional(),
  attackAngle: z.coerce.number().optional(),
  consistencyIndex: z.coerce.number().optional(),
});

export const goalsSchema = z.object({
  moreDistance: z.boolean(),
  lessSpin: z.boolean(),
  higherLaunch: z.boolean(),
  tighterDispersion: z.boolean(),
  softerFeel: z.boolean(),
});

export const fitSessionSchema = z.object({
  profile: profileSchema,
  equipment: equipmentSchema,
  launchData: launchDataSchema,
  goals: goalsSchema,
});
