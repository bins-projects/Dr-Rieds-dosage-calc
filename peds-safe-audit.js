(() => {
  const pool = window.PEDIATRIC_IV_DOSE_REFERENCE;
  if (!Array.isArray(pool)) return;

  // Keep Penicillin G in the reference library, but do not use it in the random
  // safe-range generator. Some current U.S. products specify that pediatric
  // doses under 1,000,000 units per dose should not be administered from that
  // formulation, which conflicts with smaller randomly generated child weights.
  // The other safe-range entries below have directly usable pediatric ranges
  // and concentrations for the current generator.
  for (const item of pool) {
    if (item.drug === 'penicillin G potassium' && item.mode === 'safe-range') {
      item.mode = 'reference-only';
    }
  }
})();
