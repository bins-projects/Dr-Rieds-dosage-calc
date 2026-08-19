// Pediatric IV dosing reference pool for dosage-calculation question generation.
window.PEDIATRIC_IV_DOSE_REFERENCE = [
  {drug:'ceftriaxone',mode:'safe-range',route:'IV',age:'pediatric; avoid inappropriate neonatal scenarios',indication:'serious miscellaneous infection other than meningitis',dose:{kind:'daily-range',min:50,max:75,unit:'mg/kg/day',frequency:'q12h',dosesPerDay:2,maxDailyMg:2000}},
  {drug:'cefazolin',mode:'safe-range',route:'IV',age:'pediatric; not premature/neonatal',indication:'mild to moderately severe infection',dose:{kind:'daily-range',min:25,max:50,unit:'mg/kg/day',frequencyOptions:['q8h','q6h'],dosesPerDayOptions:[3,4],severeMax:100}},
  {drug:'clindamycin',mode:'safe-range',route:'IV',age:'1 month to 16 years',indication:'serious infection',dose:{kind:'daily-range',min:20,max:40,unit:'mg/kg/day',frequencyOptions:['q8h','q6h'],dosesPerDayOptions:[3,4]}},
  {drug:'ceftazidime',mode:'safe-range',route:'IV',age:'1 month to 12 years',indication:'susceptible infection',dose:{kind:'per-dose-range',min:30,max:50,unit:'mg/kg/dose',frequency:'q8h',maxDailyMg:6000}},
  {drug:'gentamicin',mode:'safe-range',route:'IV',age:'children',indication:'susceptible serious bacterial infection; normal renal function',dose:{kind:'daily-range',min:6,max:7.5,unit:'mg/kg/day',frequency:'q8h',dosesPerDay:3}},
  {drug:'tobramycin',mode:'safe-range',route:'IV',age:'greater than 1 week',indication:'susceptible serious bacterial infection; normal renal function',dose:{kind:'daily-range',min:6,max:7.5,unit:'mg/kg/day',frequencyOptions:['q8h','q6h'],dosesPerDayOptions:[3,4]}},
  {drug:'penicillin G potassium',mode:'safe-range',route:'IV',age:'pediatric',indication:'serious susceptible streptococcal or meningococcal infection',dose:{kind:'daily-range',min:150000,max:300000,unit:'units/kg/day',frequencyOptions:['q6h','q4h'],dosesPerDayOptions:[4,6]}}
];
