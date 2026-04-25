// Classification helper functions for converting intake values into Swing DNA categories

export function classifyTrackType(height, wingspan) {
  const diff = wingspan - height
  if (diff >= 2) {
    return {
      type: 'High Track',
      description: 'Hands work up and in front, not deep and around.',
      rule: 'Hands go up, not around.',
      checkpoint: 'At lead arm parallel, hands should remain in front of the chest.',
    }
  } else if (diff <= -2) {
    return {
      type: 'Low Track',
      description: 'Flatter/deeper pattern may fit naturally.',
      rule: 'Allow depth without getting stuck.',
      checkpoint: 'Maintain connection while allowing hand depth.',
    }
  } else {
    return {
      type: 'Mid Track',
      description: 'Balanced hand path with moderate depth.',
      rule: 'Keep width while matching shoulder turn.',
      checkpoint: 'Hands stay in a balanced plane through transition.',
    }
  }
}

export function classifyPivotType(loadPreference) {
  const pivots = {
    'Lead side (front foot)': {
      type: 'Lead-side pivot',
      description: 'Stay centered and avoid overloading trail side.',
      rule: 'Pressure stays controlled; start down into lead side.',
      checkpoint: 'Lead side pressure shifts early without losing trail-side connection.',
    },
    'Trail side (back foot)': {
      type: 'Trail-side pivot',
      description: 'Load into trail side before shifting forward.',
      rule: 'Complete the load, then shift and rotate.',
      checkpoint: 'Trail side remains stable through the load phase.',
    },
    'Balanced': {
      type: 'Neutral pivot',
      description: 'Balanced pressure pattern.',
      rule: 'Maintain centered pressure and sequence naturally.',
      checkpoint: 'Pressure distributes evenly between feet throughout swing.',
    },
  }
  return pivots[loadPreference] || pivots['Balanced']
}

export function classifyRotationCapacity(hipRotation) {
  const rotations = {
    'More than 45°': {
      type: 'High rotation',
      description: 'Can rotate aggressively through impact.',
      rule: 'Keep turning; do not stall.',
      checkpoint: 'Continue rotating through finish without early deceleration.',
    },
    'About 45°': {
      type: 'Functional rotation',
      description: 'Enough rotation to support a standard pivot.',
      rule: 'Rotate with control.',
      checkpoint: 'Rotation matches pivot type and tracks naturally.',
    },
    'Less than 45°': {
      type: 'Limited rotation',
      description: 'Needs more stability and less forced turn.',
      rule: 'Prioritize balance and compact motion.',
      checkpoint: 'Focus on posture and rotational efficiency, not range.',
    },
  }
  return rotations[hipRotation] || rotations['About 45°']
}

export function classifyForearmPattern(trailHandRotation) {
  const patterns = {
    'Sideways': {
      type: 'Neutral / side-under forearm pattern',
      description: 'Stable face pattern; avoid excessive rolling.',
      rule: 'Trail elbow works down and in front.',
      checkpoint: 'Forearm remains neutral through transition and into downswing.',
    },
    'Palm Up': {
      type: 'Roll-biased forearm pattern',
      description: 'Face may open/close faster.',
      rule: 'Monitor clubface and avoid over-rotation.',
      checkpoint: 'Face rotation is coordinated with body rotation.',
    },
    'Palm Down': {
      type: 'Hold-off forearm pattern',
      description: 'Face may stay more stable/closed.',
      rule: 'Release without blocking rotation.',
      checkpoint: 'Hands release without restricting body rotation.',
    },
  }
  return patterns[trailHandRotation] || patterns['Sideways']
}

export function classifyTrailArmPattern(knuckleToElbow, collarboneToElbow) {
  // TODO: Refine this with validated ratio thresholds
  // For now, return a placeholder classification
  return {
    type: 'Side-under trail arm pattern',
    description: 'Trail arm measurements show current positioning.',
    rule: 'Work with coach to optimize trail arm sequence.',
    checkpoint: 'Trail elbow position supports downswing plane.',
    knuckleToElbowMeasurement: knuckleToElbow,
    collarboneToElbowMeasurement: collarboneToElbow,
    note: 'Trail arm pattern classification can be refined with validated ratio analysis.',
  }
}

export function generateOneLineFeel(trackType, pivotType, rotationType) {
  // Generate a concise feel based on classifications
  const trackFeels = {
    'High Track': 'hands up/in front',
    'Mid Track': 'hands balanced',
    'Low Track': 'hands deep/connected',
  }

  const pivotFeels = {
    'Lead-side pivot': 'stay centered → pressure left',
    'Trail-side pivot': 'load trail → shift forward',
    'Neutral pivot': 'balanced → rotate through',
  }

  const rotationFeels = {
    'High rotation': '→ keep turning',
    'Functional rotation': '→ control the turn',
    'Limited rotation': '→ stay compact',
  }

  const trackFeel = trackFeels[trackType] || 'hands in position'
  const pivotFeel = pivotFeels[pivotType] || 'move naturally'
  const rotationFeel = rotationFeels[rotationType] || ''

  return `${pivotFeel} → ${trackFeel} ${rotationFeel}`.trim()
}

export function generateMissTable(trackType, pivotType) {
  const baseMisses = [
    {
      miss: 'Block',
      cause: 'Hands too deep / body stalled',
      fix: 'Keep hands in front, rotate through',
    },
    {
      miss: 'Cut',
      cause: 'Stuck under plane / face open',
      fix: 'Club above plane, turn and extend',
    },
    {
      miss: 'Thin',
      cause: 'Hanging back',
      fix: 'Pressure lead side earlier',
    },
    {
      miss: 'Fat',
      cause: 'Over-shift or stalled pivot',
      fix: 'Stay centered, keep turning',
    },
    {
      miss: 'Pull',
      cause: 'Over-rotation or face closed early',
      fix: 'Stabilize face and sequence pivot',
    },
  ]

  // Adjust suggestions based on track type and pivot type
  if (trackType === 'High Track') {
    baseMisses[0].cause = 'Hands dropping too deep'
    baseMisses[0].fix = 'Keep hands elevated through transition'
  }

  if (pivotType === 'Lead-side pivot') {
    baseMisses[2].fix = 'Weight already forward—focus on rotation'
  }

  if (pivotType === 'Trail-side pivot') {
    baseMisses[3].fix = 'Complete the load before shifting'
  }

  return baseMisses
}

export function generatePracticePlan(trackType, pivotType, rotationType) {
  const plan = []

  // Structure drill based on track type
  if (trackType === 'High Track') {
    plan.push({
      name: 'Wall Drill',
      description: 'Stand facing a wall, hands up in front. Make half-swings with hands staying high and in front of chest.',
      duration: '3-4 minutes',
    })
  } else if (trackType === 'Low Track') {
    plan.push({
      name: 'Split-Hand Drill',
      description: 'Take wider stance, allow hands to drop slightly deeper. Focus on maintaining connection.',
      duration: '3-4 minutes',
    })
  } else {
    plan.push({
      name: 'Balanced Plane Drill',
      description: 'Half-swings maintaining a moderate hand plane that matches your shoulder turn.',
      duration: '3-4 minutes',
    })
  }

  // Pressure drill based on pivot type
  if (pivotType === 'Lead-side pivot') {
    plan.push({
      name: 'Step-Check Drill',
      description: 'Step toward target in transition, check weight shift. Creates lead-side engagement.',
      duration: '3-4 minutes',
    })
  } else if (pivotType === 'Trail-side pivot') {
    plan.push({
      name: 'Trail-Side Load Drill',
      description: 'Focus on feeling trail-side pressure at top, then shift forward. No early shift.',
      duration: '3-4 minutes',
    })
  } else {
    plan.push({
      name: 'Centered Pressure Drill',
      description: 'Maintain balanced weight throughout the swing. Weight flows naturally without forcing.',
      duration: '3-4 minutes',
    })
  }

  // Low-point drill for all
  plan.push({
    name: 'Line Drill',
    description: 'Place a line or chalk mark at target. Hit balls focusing on consistent low point just past the line.',
    duration: '3-4 minutes',
  })

  // Full-swing integration
  plan.push({
    name: 'Full Swing Integration',
    description: `Using your one-line feel: "${generateOneLineFeel(trackType, pivotType, rotationType)}"\nHit 3-5 full swings focusing on the sequence.`,
    duration: '3-5 minutes',
  })

  return plan
}

export function generateReport(intakeData) {
  const trackType = classifyTrackType(intakeData.height, intakeData.wingspan)
  const pivotType = classifyPivotType(intakeData.hipLoadPreference)
  const rotationType = classifyRotationCapacity(intakeData.hipRotationTowardTarget)
  const forearmPattern = classifyForearmPattern(intakeData.trailHandRotation)
  const trailArmPattern = classifyTrailArmPattern(
    intakeData.trailKnuckleToElbow,
    intakeData.trailCollarboneToElbow
  )

  const oneLineFeel = generateOneLineFeel(trackType.type, pivotType.type, rotationType.type)
  const missTable = generateMissTable(trackType.type, pivotType.type)
  const practicePlan = generatePracticePlan(trackType.type, pivotType.type, rotationType.type)

  return {
    classifications: {
      trackType,
      pivotType,
      rotationType,
      forearmPattern,
      trailArmPattern,
    },
    oneLineFeel,
    missTable,
    practicePlan,
    generatedAt: new Date().toISOString(),
  }
}
