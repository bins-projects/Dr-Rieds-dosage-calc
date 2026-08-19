(() => {
  const pool = window.PEDIATRIC_IV_DOSE_REFERENCE;
  if (!Array.isArray(pool)) return;
  for (const item of pool) {
    if (item.drug === 'penicillin G potassium' && item.mode === 'safe-range') {
      item.mode = 'reference-only';
    }
  }
})();
