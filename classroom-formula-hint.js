(() => {
  const typeEl = document.querySelector('#type');
  const showBtn = document.querySelector('#show-formula');
  const panel = document.querySelector('#formula-panel');
  if (!typeEl || !showBtn || !panel) return;

  const formulas = {
    'basic-dose': 'Desired dose ÷ Dose on hand × Quantity = Amount to give',
    'weight-dose': 'Dose per kg × Weight (kg) = Dose to give',
    'peds-safe-range': 'mg/kg/day × kg ÷ doses/day = safe mg/dose range',
    'mlhr-hours': 'Total mL ÷ hours = mL/hr',
    'mlhr-minutes': 'Total mL ÷ (minutes ÷ 60) = mL/hr',
    'infusion-time': 'Total mL ÷ mL/hr = infusion time in hours',
    'completion-time': 'Start time + infusion duration = completion time',
    'gtt-volume-time': '(mL × drop factor) ÷ total minutes = gtt/min',
    'gtt-from-mlhr': '(mL/hr × drop factor) ÷ 60 = gtt/min',
    'mlhr-from-gtt': '(gtt/min × 60) ÷ drop factor = mL/hr',
    'reconstitution': 'Ordered dose ÷ final concentration = mL to draw up',
    'units-hour': 'units/hr × bag mL ÷ total bag units = mL/hr',
    'mcg-minute': 'mcg/min × 60 × bag mL ÷ total bag mcg = mL/hr',
    'mcg-kg-minute': 'mcg/kg/min × kg × 60 × bag mL ÷ total bag mcg = mL/hr',
    'amount-hour': 'ordered mg/hr or g/hr × bag mL ÷ total bag amount = mL/hr',
    'meq-ml': 'Ordered mEq ÷ concentration (mEq/mL) = mL',
    'daily-divided': 'mg/kg/day × kg ÷ doses/day = mg per dose'
  };

  function hideFormula() {
    panel.hidden = true;
    panel.textContent = '';
    showBtn.textContent = 'Show Formula';
  }

  showBtn.addEventListener('click', () => {
    if (!panel.hidden) {
      hideFormula();
      return;
    }
    panel.textContent = formulas[typeEl.value] || 'Use the formula that matches the quantities and units shown in the problem.';
    panel.hidden = false;
    showBtn.textContent = 'Hide Formula';
  });

  typeEl.addEventListener('change', hideFormula);
  document.querySelector('#new-question')?.addEventListener('click', hideFormula);
  document.querySelector('#apply-vars')?.addEventListener('click', hideFormula);
})();
