// Pediatric IV dosing reference pool for dosage-calculation question generation.
// Sources are current U.S. DailyMed/FDA labels checked 2026-08-19.
// IMPORTANT: `mode: "safe-range"` is reserved for labels that provide a genuine
// dose range suitable for low/safe/high comparison. `mode: "indication-specific"`
// entries must include the stated indication/age/frequency in any generated prompt.
window.PEDIATRIC_IV_DOSE_REFERENCE = [
  {
    drug: 'ceftriaxone', mode: 'safe-range', route: 'IV', age: 'pediatric; avoid inappropriate neonatal scenarios',
    indication: 'serious miscellaneous infection other than meningitis',
    dose: {kind:'daily-range', min:50, max:75, unit:'mg/kg/day', frequency:'q12h', dosesPerDay:2, maxDailyMg:2000},
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=467f49f7-1a35-49c1-88aa-acc2f27adc2b'
  },
  {
    drug: 'cefazolin', mode: 'safe-range', route: 'IV', age: 'pediatric; not premature/neonatal',
    indication: 'mild to moderately severe infection',
    dose: {kind:'daily-range', min:25, max:50, unit:'mg/kg/day', frequencyOptions:['q8h','q6h'], dosesPerDayOptions:[3,4], severeMax:100},
    source: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=e48fcd44-243f-4af0-ae45-47db4a8687b9&type=display'
  },
  {
    drug: 'clindamycin', mode: 'safe-range', route: 'IV', age: '1 month to 16 years',
    indication: 'serious infection',
    dose: {kind:'daily-range', min:20, max:40, unit:'mg/kg/day', frequencyOptions:['q8h','q6h'], dosesPerDayOptions:[3,4]},
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=406534a6-2234-4735-ba8f-7de4c87592e6'
  },
  {
    drug: 'ceftazidime', mode: 'safe-range', route: 'IV', age: '1 month to 12 years',
    indication: 'susceptible infection',
    dose: {kind:'per-dose-range', min:30, max:50, unit:'mg/kg/dose', frequency:'q8h', maxDailyMg:6000},
    source: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=112c5457-8d71-49f5-b531-9761d7d38c93&type=display'
  },
  {
    drug: 'gentamicin', mode: 'safe-range', route: 'IV', age: 'children',
    indication: 'susceptible serious bacterial infection; normal renal function',
    dose: {kind:'daily-range', min:6, max:7.5, unit:'mg/kg/day', frequency:'q8h', dosesPerDay:3},
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a73a5453-c091-43fd-aae2-d992152363b1'
  },
  {
    drug: 'tobramycin', mode: 'safe-range', route: 'IV', age: 'greater than 1 week',
    indication: 'susceptible serious bacterial infection; normal renal function',
    dose: {kind:'daily-range', min:6, max:7.5, unit:'mg/kg/day', frequencyOptions:['q8h','q6h'], dosesPerDayOptions:[3,4]},
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9a5cecd6-aa65-42d2-b15a-06b4fcebcc0f'
  },
  {
    drug: 'penicillin G potassium', mode: 'safe-range', route: 'IV', age: 'pediatric',
    indication: 'serious susceptible streptococcal or meningococcal infection',
    dose: {kind:'daily-range', min:150000, max:300000, unit:'units/kg/day', frequencyOptions:['q6h','q4h'], dosesPerDayOptions:[4,6]},
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=e0ced9d8-b9ea-466e-bf2c-10e9cc636f3f'
  },
  {
    drug: 'meropenem', mode: 'indication-specific', route: 'IV', age: '3 months and older',
    regimens: [
      {indication:'complicated skin/skin structure infection', dose:10, unit:'mg/kg/dose', frequency:'q8h'},
      {indication:'complicated intra-abdominal infection', dose:20, unit:'mg/kg/dose', frequency:'q8h'},
      {indication:'meningitis', dose:40, unit:'mg/kg/dose', frequency:'q8h', maxDoseMg:2000}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b0075b72-c3cc-f844-e053-2a95a90a417f'
  },
  {
    drug: 'amikacin', mode: 'indication-specific', route: 'IV', age: 'children and older infants; normal renal function',
    regimens: [
      {indication:'susceptible serious bacterial infection', dose:7.5, unit:'mg/kg/dose', frequency:'q12h'},
      {indication:'susceptible serious bacterial infection', dose:5, unit:'mg/kg/dose', frequency:'q8h'}
    ], maxDaily: {value:15, unit:'mg/kg/day'},
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c0f57839-1c9b-49e5-8c7a-708e2d16495d'
  },
  {
    drug: 'vancomycin', mode: 'indication-specific', route: 'IV', age: '1 month and older; normal renal function',
    regimens: [{indication:'labeled pediatric IV regimen', dose:10, unit:'mg/kg/dose', frequency:'q6h'}],
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=99e523d8-9bde-43cb-8434-497015e5dcbd'
  },
  {
    drug: 'ampicillin/sulbactam', mode: 'indication-specific', route: 'IV', age: '1 year and older; under 40 kg for pediatric weight-based regimen',
    regimens: [{indication:'labeled pediatric IV regimen', dose:300, unit:'mg/kg/day total drug', frequency:'q6h', dosesPerDay:4}],
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=dc374fa4-350b-425d-a7db-7099fdc64cf1'
  },
  {
    drug: 'oxacillin', mode: 'indication-specific', route: 'IV', age: 'infants and children under 40 kg',
    regimens: [
      {indication:'mild to moderate infection', dose:50, unit:'mg/kg/day', frequency:'q6h', dosesPerDay:4},
      {indication:'severe infection', dose:100, unit:'mg/kg/day', frequencyOptions:['q6h','q4h'], dosesPerDayOptions:[4,6]}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=8e99d6fe-42ab-44c1-8b51-e4ac7406dbe4&type=display'
  },
  {
    drug: 'acyclovir', mode: 'indication-specific', route: 'IV', age: 'pediatric',
    regimens: [
      {indication:'mucosal/cutaneous HSV in immunocompromised patient under 12 years', dose:10, unit:'mg/kg/dose', frequency:'q8h'},
      {indication:'HSV encephalitis age 3 months to 12 years', dose:20, unit:'mg/kg/dose', frequency:'q8h', maxDose:20}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=babdbce2-5cbd-4943-bc38-9ebdd696a77a&type=display'
  },
  {
    drug: 'piperacillin/tazobactam', mode: 'indication-specific', route: 'IV', age: '2 months and older, up to 40 kg',
    regimens: [
      {age:'2 to 9 months', indication:'appendicitis/peritonitis', dose:90, unit:'mg/kg/dose total drug', frequency:'q8h'},
      {age:'2 to 9 months', indication:'nosocomial pneumonia', dose:90, unit:'mg/kg/dose total drug', frequency:'q6h'},
      {age:'older than 9 months', indication:'appendicitis/peritonitis', dose:112.5, unit:'mg/kg/dose total drug', frequency:'q8h'},
      {age:'older than 9 months', indication:'nosocomial pneumonia', dose:112.5, unit:'mg/kg/dose total drug', frequency:'q6h'}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=83f4adcd-893c-4e9e-8f2b-e06299dcf34d'
  },
  {
    drug: 'cefepime', mode: 'indication-specific', route: 'IV', age: '2 months to 16 years',
    regimens: [
      {indication:'usual labeled pediatric regimen', dose:50, unit:'mg/kg/dose', frequency:'q12h'},
      {indication:'febrile neutropenia', dose:50, unit:'mg/kg/dose', frequency:'q8h'}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=be5f8ca6-7232-423a-a2d5-cccb7abe7921'
  },
  {
    drug: 'aztreonam', mode: 'indication-specific', route: 'IV', age: 'pediatric; normal renal function',
    regimens: [
      {indication:'mild to moderate infection', dose:30, unit:'mg/kg/dose', frequency:'q8h'},
      {indication:'moderate to severe infection', dose:30, unit:'mg/kg/dose', frequencyOptions:['q6h','q8h']}
    ], maxDaily: {value:120, unit:'mg/kg/day'},
    source: 'https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=d4500795-3b07-4a7d-b432-73cafbb3dbc6'
  },
  {
    drug: 'linezolid', mode: 'indication-specific', route: 'IV', age: 'birth through 11 years; neonatal interval caveat applies',
    regimens: [{indication:'labeled serious infection regimen', dose:10, unit:'mg/kg/dose', frequency:'q8h'}],
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c401f1a8-cc37-461b-bfef-f2e156629bf8'
  },
  {
    drug: 'fluconazole', mode: 'indication-specific', route: 'IV', age: 'pediatric; regimen depends strongly on age and indication',
    regimens: [
      {indication:'oropharyngeal candidiasis, day 1', dose:6, unit:'mg/kg', frequency:'once on day 1'},
      {indication:'oropharyngeal candidiasis, maintenance', dose:3, unit:'mg/kg/dose', frequency:'q24h'},
      {indication:'systemic Candida infection age 3 months and older, loading', dose:25, unit:'mg/kg', frequency:'once', maxDoseMg:800},
      {indication:'systemic Candida infection age 3 months and older, maintenance', dose:12, unit:'mg/kg/dose', frequency:'q24h', maxDoseMg:400}
    ],
    source: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cd24a261-9c15-42b4-8040-89d2dbda174e'
  },
  {
    drug: 'acetaminophen', mode: 'indication-specific', route: 'IV', age: 'children 2 to 12 years',
    regimens: [
      {indication:'pain or fever', dose:12.5, unit:'mg/kg/dose', frequency:'q4h'},
      {indication:'pain or fever', dose:15, unit:'mg/kg/dose', frequency:'q6h'}
    ], maxDaily: {value:75, unit:'mg/kg/day'}, maxSingle: {value:15, unit:'mg/kg'},
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a0cece43-256e-4adc-92f8-11a0f473bb83'
  },
  {
    drug: 'furosemide', mode: 'indication-specific', route: 'IV', age: 'pediatric',
    regimens: [{indication:'initial pediatric dose', dose:1, unit:'mg/kg/dose', frequency:'once; may increase by 1 mg/kg no sooner than q2h if needed'}],
    maxDose: {value:6, unit:'mg/kg'},
    source: 'https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=4227fab8-a64a-1c9e-e063-6294a90a0682'
  }
];
