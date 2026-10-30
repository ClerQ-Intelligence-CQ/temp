// REAL TANZANIA STG CLINICAL RULES COMPILED FROM ClerQApp/assets/compiled_rules.json
// Zero fake stubs. 100% genuine clinical logic.

export interface RealClinicalRule {
  id: string;
  nameEn: string;
  nameSw: string;
  category: string;
  acuity: 'EMERGENCY_RED' | 'PRIORITY_YELLOW' | 'ROUTINE_GREEN';
  minScore: number;
  triggers: string[];
  weights: Record<string, number>;
  investigations: string[];
}

export const REAL_CLINICAL_RULES: RealClinicalRule[] = [
  {
    "id": "NS.malaria",
    "nameEn": "Malaria",
    "nameSw": "Malaria",
    "category": "febrile",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4.8,
    "triggers": [
      "S_FEVER",
      "V_FEVER",
      "S_CHILLS",
      "S_RIGOR_SEVERE",
      "S_HEADACHE",
      "S_BODY_ACHE",
      "S_VOMIT",
      "S_NIGHT_SWEATS",
      "S_SPLEEN",
      "S_PALLOR",
      "S_JAUNDICE",
      "S_ENDEMIC_EXPOSURE",
      "S_SEIZURE",
      "S_CONFUSION",
      "S_FATIGUE",
      "S_ANOREXIA"
    ],
    "weights": {
      "S_FEVER": 2,
      "V_FEVER": 1,
      "S_CHILLS": 1.5,
      "S_RIGOR_SEVERE": 1,
      "S_HEADACHE": 0.8,
      "S_BODY_ACHE": 0.6,
      "S_VOMIT": 0.5,
      "S_NIGHT_SWEATS": 0.3,
      "S_SPLEEN": 0.8,
      "S_PALLOR": 0.6,
      "S_JAUNDICE": 0.5,
      "S_ENDEMIC_EXPOSURE": 0.8,
      "S_SEIZURE": 0.8,
      "S_CONFUSION": 0.6,
      "S_FATIGUE": 0.4,
      "S_ANOREXIA": 0.3
    },
    "investigations": [
      "Malaria rapid test or blood slide",
      "Haemoglobin",
      "Blood glucose"
    ]
  },
  {
    "id": "NS.tb",
    "nameEn": "Pulmonary tuberculosis",
    "nameSw": "Kifua kikuu cha mapafu",
    "category": "respiratory",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_COUGH_LONG",
      "S_COUGH",
      "S_HAEMOPTYSIS",
      "S_WEIGHT_LOSS",
      "S_NIGHT_SWEATS",
      "S_PROLONGED_FEVER",
      "S_FEVER",
      "S_ANOREXIA",
      "S_TB_CONTACT",
      "S_HIV_HX",
      "S_FATIGUE",
      "S_PLEURITIC",
      "S_LYMPH"
    ],
    "weights": {
      "S_COUGH_LONG": 3.2,
      "S_COUGH": 0.8,
      "S_HAEMOPTYSIS": 1.5,
      "S_WEIGHT_LOSS": 1.5,
      "S_NIGHT_SWEATS": 1.5,
      "S_PROLONGED_FEVER": 0.8,
      "S_FEVER": 0.4,
      "S_ANOREXIA": 0.6,
      "S_TB_CONTACT": 1.5,
      "S_HIV_HX": 0.8,
      "S_FATIGUE": 0.4,
      "S_PLEURITIC": 0.4,
      "S_LYMPH": 0.5
    },
    "investigations": [
      "Sputum Xpert MTB/RIF",
      "Chest X-ray",
      "HIV test"
    ]
  },
  {
    "id": "NS.pneumonia",
    "nameEn": "Pneumonia",
    "nameSw": "Nimonia",
    "category": "respiratory",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_COUGH",
      "S_FEVER",
      "V_FEVER",
      "S_SPUTUM",
      "S_DYSPNOEA",
      "S_PLEURITIC",
      "S_FAST_BREATHING",
      "V_TACHYPNOEA",
      "V_FAST_BREATHING_CHILD",
      "S_INDRAWING",
      "V_HYPOXIA",
      "S_CHILLS",
      "S_CONFUSION",
      "S_POOR_FEEDING",
      "S_CYANOSIS",
      "S_HAEMOPTYSIS"
    ],
    "weights": {
      "S_COUGH": 1.5,
      "S_FEVER": 1.4,
      "V_FEVER": 0.6,
      "S_SPUTUM": 1,
      "S_DYSPNOEA": 1.2,
      "S_PLEURITIC": 1.2,
      "S_FAST_BREATHING": 1.2,
      "V_TACHYPNOEA": 1,
      "V_FAST_BREATHING_CHILD": 1.2,
      "S_INDRAWING": 1.5,
      "V_HYPOXIA": 1.2,
      "S_CHILLS": 0.8,
      "S_CONFUSION": 0.5,
      "S_POOR_FEEDING": 0.4,
      "S_CYANOSIS": 0.8,
      "S_HAEMOPTYSIS": 0.3
    },
    "investigations": [
      "Chest X-ray",
      "Pulse oximetry",
      "Full blood count"
    ]
  },
  {
    "id": "NS.meningitis",
    "nameEn": "Meningitis",
    "nameSw": "Homa ya uti wa mgongo",
    "category": "infectious",
    "acuity": "EMERGENCY_RED",
    "minScore": 4,
    "triggers": [
      "S_STIFF_NECK",
      "S_PHOTOPHOBIA",
      "S_FEVER",
      "V_FEVER",
      "S_HEADACHE",
      "S_CONFUSION",
      "S_SEIZURE",
      "S_VOMIT",
      "S_PETECHIAE",
      "S_FONTANELLE",
      "S_POOR_FEEDING",
      "S_UNCONSCIOUS"
    ],
    "weights": {
      "S_STIFF_NECK": 3,
      "S_PHOTOPHOBIA": 1.5,
      "S_FEVER": 1.2,
      "V_FEVER": 0.5,
      "S_HEADACHE": 1.2,
      "S_CONFUSION": 1.2,
      "S_SEIZURE": 1,
      "S_VOMIT": 0.6,
      "S_PETECHIAE": 1,
      "S_FONTANELLE": 2,
      "S_POOR_FEEDING": 0.4,
      "S_UNCONSCIOUS": 0.5
    },
    "investigations": [
      "Lumbar puncture (if no contraindication)",
      "Blood glucose",
      "Malaria test",
      "Blood culture"
    ]
  },
  {
    "id": "NS.hiv",
    "nameEn": "HIV infection (advanced disease)",
    "nameSw": "Maambukizi ya VVU (hatua ya juu)",
    "category": "infectious",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_HIV_HX",
      "S_HIV_RISK",
      "S_THRUSH",
      "S_ZOSTER",
      "S_LYMPH",
      "S_WEIGHT_LOSS",
      "S_CHRONIC_DIARRHOEA",
      "S_NIGHT_SWEATS",
      "S_PROLONGED_FEVER",
      "S_RECURRENT_INFECTIONS",
      "S_COUGH_LONG",
      "S_ITCH",
      "S_FATIGUE",
      "S_TB_CONTACT"
    ],
    "weights": {
      "S_HIV_HX": 3,
      "S_HIV_RISK": 1.5,
      "S_THRUSH": 2,
      "S_ZOSTER": 1.5,
      "S_LYMPH": 1.2,
      "S_WEIGHT_LOSS": 1.2,
      "S_CHRONIC_DIARRHOEA": 1.5,
      "S_NIGHT_SWEATS": 0.6,
      "S_PROLONGED_FEVER": 0.8,
      "S_RECURRENT_INFECTIONS": 1.5,
      "S_COUGH_LONG": 0.8,
      "S_ITCH": 0.4,
      "S_FATIGUE": 0.3,
      "S_TB_CONTACT": 0.4
    },
    "investigations": [
      "HIV test",
      "CD4 count",
      "Viral load",
      "TB screen (Xpert)",
      "Cryptococcal antigen if CD4 low"
    ]
  },
  {
    "id": "NS.arbovirus",
    "nameEn": "Dengue or Chikungunya (arboviral fever)",
    "nameSw": "Homa ya dengue au chikungunya",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4.5,
    "triggers": [
      "S_FEVER",
      "V_FEVER",
      "S_BODY_ACHE",
      "S_JOINT_PAIN",
      "S_RETRO_ORBITAL",
      "S_RASH",
      "S_HEADACHE",
      "S_PETECHIAE",
      "S_NAUSEA",
      "S_VOMIT",
      "S_ABD_PAIN",
      "S_ENDEMIC_EXPOSURE",
      "S_FATIGUE"
    ],
    "weights": {
      "S_FEVER": 1.8,
      "V_FEVER": 0.8,
      "S_BODY_ACHE": 1.5,
      "S_JOINT_PAIN": 1.8,
      "S_RETRO_ORBITAL": 1.5,
      "S_RASH": 1.2,
      "S_HEADACHE": 0.8,
      "S_PETECHIAE": 1.2,
      "S_NAUSEA": 0.4,
      "S_VOMIT": 0.5,
      "S_ABD_PAIN": 0.5,
      "S_ENDEMIC_EXPOSURE": 0.8,
      "S_FATIGUE": 0.3
    },
    "investigations": [
      "Dengue NS1 or IgM",
      "Full blood count (platelets",
      "haematocrit)",
      "Malaria test"
    ]
  },
  {
    "id": "NS.watery_diarrhoea",
    "nameEn": "Acute watery diarrhoea (assess dehydration; cholera if outbreak)",
    "nameSw": "Kuhara maji (pima upungufu wa maji mwilini; kipindupindu kama kuna mlipuko)",
    "category": "pediatrics",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 3.5,
    "triggers": [
      "S_DIARRHOEA",
      "S_RICE_WATER",
      "S_VOMIT",
      "S_NAUSEA",
      "S_LOWER_ABD_PAIN",
      "S_DEHYDRATION",
      "S_ABD_PAIN",
      "S_LOW_URINE",
      "S_CONFUSION",
      "S_COLD_CLAMMY",
      "S_FEVER",
      "S_POOR_FEEDING",
      "S_FATIGUE",
      "V_HYPOTENSION"
    ],
    "weights": {
      "S_DIARRHOEA": 3,
      "S_RICE_WATER": 1.5,
      "S_VOMIT": 1,
      "S_NAUSEA": 0.5,
      "S_LOWER_ABD_PAIN": 0.5,
      "S_DEHYDRATION": 2,
      "S_ABD_PAIN": 0.5,
      "S_LOW_URINE": 0.8,
      "S_CONFUSION": 0.5,
      "S_COLD_CLAMMY": 0.6,
      "S_FEVER": 0.3,
      "S_POOR_FEEDING": 0.5,
      "S_FATIGUE": 0.3,
      "V_HYPOTENSION": 0.8
    },
    "investigations": [
      "Assess dehydration",
      "Stool culture or cholera rapid test if outbreak",
      "Blood glucose",
      "Electrolytes if severe"
    ]
  },
  {
    "id": "NS.dysentery",
    "nameEn": "Dysentery (bloody diarrhoea)",
    "nameSw": "Kuhara damu (kuhara damu na kamasi)",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_BLOODY_STOOL",
      "S_DIARRHOEA",
      "S_ABD_PAIN",
      "S_FEVER",
      "S_VOMIT",
      "S_DEHYDRATION",
      "S_FATIGUE"
    ],
    "weights": {
      "S_BLOODY_STOOL": 3.5,
      "S_DIARRHOEA": 1.5,
      "S_ABD_PAIN": 1,
      "S_FEVER": 0.8,
      "S_VOMIT": 0.4,
      "S_DEHYDRATION": 1,
      "S_FATIGUE": 0.3
    },
    "investigations": [
      "Stool microscopy and culture",
      "Assess dehydration",
      "Haemoglobin"
    ]
  },
  {
    "id": "NS.dka",
    "nameEn": "Diabetic ketoacidosis (DKA)",
    "nameSw": "Ketoasidosis ya kisukari (DKA)",
    "category": "general",
    "acuity": "EMERGENCY_RED",
    "minScore": 4.5,
    "triggers": [
      "S_POLYURIA",
      "S_KUSSMAUL",
      "S_KETONE_BREATH",
      "V_HYPERGLYCAEMIA",
      "S_DIABETES_HX",
      "S_VOMIT",
      "S_NAUSEA",
      "S_ABD_PAIN",
      "S_CONFUSION",
      "S_DEHYDRATION",
      "S_WEIGHT_LOSS",
      "S_FATIGUE",
      "S_UNCONSCIOUS",
      "V_TACHYCARDIA"
    ],
    "weights": {
      "S_POLYURIA": 2,
      "S_KUSSMAUL": 2.5,
      "S_KETONE_BREATH": 2,
      "V_HYPERGLYCAEMIA": 2.5,
      "S_DIABETES_HX": 1.8,
      "S_VOMIT": 1,
      "S_NAUSEA": 0.4,
      "S_ABD_PAIN": 0.8,
      "S_CONFUSION": 1,
      "S_DEHYDRATION": 1,
      "S_WEIGHT_LOSS": 0.6,
      "S_FATIGUE": 0.4,
      "S_UNCONSCIOUS": 0.5,
      "V_TACHYCARDIA": 0.4
    },
    "investigations": [
      "Blood glucose",
      "Urine ketones",
      "Electrolytes (potassium)",
      "Venous blood gas or bicarbonate",
      "Creatinine"
    ]
  },
  {
    "id": "NS.preeclampsia",
    "nameEn": "Pre-eclampsia or eclampsia (hypertension in pregnancy)",
    "nameSw": "Kifafa cha mimba au shinikizo la damu la mimba",
    "category": "obstetrics",
    "acuity": "EMERGENCY_RED",
    "minScore": 4.5,
    "triggers": [
      "D_PREGNANT",
      "S_PREGNANT",
      "V_HTN",
      "V_HTN_SEVERE",
      "S_HTN_HX",
      "S_HEADACHE",
      "S_VISUAL",
      "S_EPIGASTRIC",
      "S_FACE_HAND_SWELL",
      "S_LEG_OEDEMA",
      "S_SEIZURE",
      "S_PROTEINURIA",
      "S_VOMIT",
      "S_CONFUSION"
    ],
    "weights": {
      "D_PREGNANT": 1.5,
      "S_PREGNANT": 0.5,
      "V_HTN": 2.2,
      "V_HTN_SEVERE": 1.5,
      "S_HTN_HX": 1.2,
      "S_HEADACHE": 1.2,
      "S_VISUAL": 1.5,
      "S_EPIGASTRIC": 1.5,
      "S_FACE_HAND_SWELL": 1.2,
      "S_LEG_OEDEMA": 0.4,
      "S_SEIZURE": 2.5,
      "S_PROTEINURIA": 1.5,
      "S_VOMIT": 0.4,
      "S_CONFUSION": 0.8
    },
    "investigations": [
      "Blood pressure repeat",
      "Urine protein",
      "Platelets and liver enzymes",
      "Fetal assessment"
    ]
  },
  {
    "id": "NS.hypertension",
    "nameEn": "Hypertension (hypertensive urgency or emergency)",
    "nameSw": "Shinikizo la juu la damu",
    "category": "cardiovascular",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "V_HTN",
      "V_HTN_SEVERE",
      "S_HTN_HX",
      "S_HEADACHE",
      "S_VISUAL",
      "S_CHEST_PAIN",
      "S_DYSPNOEA",
      "S_CONFUSION",
      "S_PALPITATION",
      "S_LEG_OEDEMA",
      "S_FATIGUE",
      "S_UNCONSCIOUS"
    ],
    "weights": {
      "V_HTN": 2.5,
      "V_HTN_SEVERE": 1.8,
      "S_HTN_HX": 2,
      "S_HEADACHE": 1,
      "S_VISUAL": 0.8,
      "S_CHEST_PAIN": 0.7,
      "S_DYSPNOEA": 0.4,
      "S_CONFUSION": 0.7,
      "S_PALPITATION": 0.5,
      "S_LEG_OEDEMA": 0.3,
      "S_FATIGUE": 0.2,
      "S_UNCONSCIOUS": 0.4
    },
    "investigations": [
      "Repeat blood pressure",
      "Urine dipstick",
      "Creatinine and electrolytes",
      "ECG",
      "Blood glucose"
    ]
  },
  {
    "id": "NS.heart_failure",
    "nameEn": "Heart failure",
    "nameSw": "Moyo kushindwa kufanya kazi",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_DYSPNOEA",
      "S_ORTHOPNOEA",
      "S_LEG_OEDEMA",
      "S_FROTHY",
      "S_FATIGUE",
      "S_CARDIAC_HX",
      "S_HTN_HX",
      "S_PALPITATION",
      "S_SPLEEN",
      "S_COUGH",
      "S_NOCTURNAL_COUGH",
      "V_HYPOXIA",
      "V_TACHYCARDIA",
      "S_COLD_CLAMMY",
      "V_HTN",
      "S_WEIGHT_LOSS"
    ],
    "weights": {
      "S_DYSPNOEA": 1.4,
      "S_ORTHOPNOEA": 2.2,
      "S_LEG_OEDEMA": 1.8,
      "S_FROTHY": 1.8,
      "S_FATIGUE": 0.6,
      "S_CARDIAC_HX": 1.3,
      "S_HTN_HX": 0.6,
      "S_PALPITATION": 0.5,
      "S_SPLEEN": 0.3,
      "S_COUGH": 0.5,
      "S_NOCTURNAL_COUGH": 0.6,
      "V_HYPOXIA": 0.6,
      "V_TACHYCARDIA": 0.4,
      "S_COLD_CLAMMY": 0.4,
      "V_HTN": 0.3,
      "S_WEIGHT_LOSS": 0.1
    },
    "investigations": [
      "Chest X-ray",
      "ECG",
      "Echocardiography if available",
      "Creatinine and electrolytes",
      "Haemoglobin"
    ]
  },
  {
    "id": "NS.asthma",
    "nameEn": "Asthma",
    "nameSw": "Pumu",
    "category": "respiratory",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 3.5,
    "triggers": [
      "S_WHEEZE",
      "S_CHEST_TIGHT",
      "S_DYSPNOEA",
      "S_COUGH",
      "S_NOCTURNAL_COUGH",
      "S_ALLERGEN",
      "V_HYPOXIA",
      "S_FAST_BREATHING"
    ],
    "weights": {
      "S_WHEEZE": 3,
      "S_CHEST_TIGHT": 1.5,
      "S_DYSPNOEA": 1.2,
      "S_COUGH": 0.8,
      "S_NOCTURNAL_COUGH": 1.5,
      "S_ALLERGEN": 0.5,
      "V_HYPOXIA": 0.6,
      "S_FAST_BREATHING": 0.5
    },
    "investigations": [
      "Peak flow if available",
      "Pulse oximetry",
      "Chest X-ray if first episode or fever"
    ]
  },
  {
    "id": "NS.anaphylaxis",
    "nameEn": "Anaphylaxis",
    "nameSw": "Mshtuko wa mzio (anaphylaksia)",
    "category": "general",
    "acuity": "EMERGENCY_RED",
    "minScore": 5,
    "triggers": [
      "S_ALLERGEN",
      "S_URTICARIA",
      "S_ANGIOEDEMA",
      "S_STRIDOR",
      "S_WHEEZE",
      "S_DYSPNOEA",
      "V_HYPOTENSION",
      "S_UNCONSCIOUS",
      "S_COLD_CLAMMY",
      "S_VOMIT",
      "S_ITCH",
      "S_SUDDEN_ONSET",
      "S_ABD_PAIN"
    ],
    "weights": {
      "S_ALLERGEN": 2,
      "S_URTICARIA": 1.8,
      "S_ANGIOEDEMA": 2.5,
      "S_STRIDOR": 2,
      "S_WHEEZE": 0.8,
      "S_DYSPNOEA": 1,
      "V_HYPOTENSION": 1.5,
      "S_UNCONSCIOUS": 0.8,
      "S_COLD_CLAMMY": 0.8,
      "S_VOMIT": 0.4,
      "S_ITCH": 0.8,
      "S_SUDDEN_ONSET": 0.8,
      "S_ABD_PAIN": 0.3
    },
    "investigations": [
      {
        "Clinical diagnosis": "treat first"
      },
      "Observe for at least 6 hours"
    ]
  },
  {
    "id": "NS.sepsis",
    "nameEn": "Sepsis",
    "nameSw": "Sepsisi (maambukizi makali ya damu)",
    "category": "febrile",
    "acuity": "EMERGENCY_RED",
    "minScore": 5,
    "triggers": [
      "S_FEVER",
      "V_FEVER",
      "S_CHILLS",
      "S_RIGOR_SEVERE",
      "V_TACHYCARDIA",
      "V_TACHYPNOEA",
      "V_HYPOTENSION",
      "S_CONFUSION",
      "S_COLD_CLAMMY",
      "S_LOW_URINE",
      "S_WOUND_SOURCE",
      "V_HYPOTHERMIA",
      "S_FATIGUE",
      "S_VOMIT",
      "S_DYSPNOEA"
    ],
    "weights": {
      "S_FEVER": 1.2,
      "V_FEVER": 0.8,
      "S_CHILLS": 0.8,
      "S_RIGOR_SEVERE": 1,
      "V_TACHYCARDIA": 1.2,
      "V_TACHYPNOEA": 1,
      "V_HYPOTENSION": 2.5,
      "S_CONFUSION": 1.5,
      "S_COLD_CLAMMY": 1.5,
      "S_LOW_URINE": 1,
      "S_WOUND_SOURCE": 1.5,
      "V_HYPOTHERMIA": 1,
      "S_FATIGUE": 0.3,
      "S_VOMIT": 0.3,
      "S_DYSPNOEA": 0.4
    },
    "investigations": [
      "Blood culture before antibiotics",
      "Lactate",
      "Full blood count",
      "Creatinine",
      "Blood glucose",
      "Malaria test"
    ]
  },
  {
    "id": "NS.ectopic",
    "nameEn": "Ectopic pregnancy",
    "nameSw": "Mimba nje ya mfuko wa uzazi",
    "category": "general",
    "acuity": "EMERGENCY_RED",
    "minScore": 5,
    "triggers": [
      "S_MISSED_PERIOD",
      "S_PREGNANT",
      "S_LOWER_ABD_PAIN",
      "S_VAG_BLEED",
      "S_SHOULDER_TIP",
      "S_UNCONSCIOUS",
      "V_HYPOTENSION",
      "V_TACHYCARDIA",
      "S_COLD_CLAMMY",
      "S_PALLOR",
      "S_NAUSEA",
      "S_VOMIT",
      "S_SUDDEN_ONSET"
    ],
    "weights": {
      "S_MISSED_PERIOD": 2,
      "S_PREGNANT": 0.8,
      "S_LOWER_ABD_PAIN": 2,
      "S_VAG_BLEED": 1.6,
      "S_SHOULDER_TIP": 1.5,
      "S_UNCONSCIOUS": 1.2,
      "V_HYPOTENSION": 1.5,
      "V_TACHYCARDIA": 0.8,
      "S_COLD_CLAMMY": 1,
      "S_PALLOR": 0.6,
      "S_NAUSEA": 0.3,
      "S_VOMIT": 0.2,
      "S_SUDDEN_ONSET": 0.4
    },
    "investigations": [
      "Urine or serum pregnancy test",
      "Pelvic ultrasound",
      "Haemoglobin and group and crossmatch",
      "Two large IV lines"
    ]
  },
  {
    "id": "NS.burns",
    "nameEn": "Burns",
    "nameSw": "Majeraha ya moto (kuungua)",
    "category": "general",
    "acuity": "EMERGENCY_RED",
    "minScore": 4,
    "triggers": [
      "S_BURN",
      "S_BLISTERS",
      "S_STRIDOR",
      "S_COLD_CLAMMY",
      "V_HYPOTENSION",
      "V_TACHYCARDIA",
      "S_CONFUSION"
    ],
    "weights": {
      "S_BURN": 4,
      "S_BLISTERS": 1.2,
      "S_STRIDOR": 1,
      "S_COLD_CLAMMY": 0.6,
      "V_HYPOTENSION": 0.8,
      "V_TACHYCARDIA": 0.4,
      "S_CONFUSION": 0.4
    },
    "investigations": [
      "Estimate burn area (rule of nines)",
      "Haemoglobin",
      "Urine output",
      "Check airway"
    ]
  },
  {
    "id": "NS.leishmaniasis",
    "nameEn": "Visceral leishmaniasis (kala-azar)",
    "nameSw": "Kala-azar (leishmaniasis ya ndani)",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4.5,
    "triggers": [
      "S_PROLONGED_FEVER",
      "S_FEVER",
      "S_SPLEEN",
      "S_WEIGHT_LOSS",
      "S_PALLOR",
      "S_SKIN_ULCER",
      "S_FATIGUE",
      "S_PETECHIAE",
      "S_ENDEMIC_EXPOSURE",
      "S_ANOREXIA",
      "S_HIV_HX"
    ],
    "weights": {
      "S_PROLONGED_FEVER": 2,
      "S_FEVER": 0.6,
      "S_SPLEEN": 2.5,
      "S_WEIGHT_LOSS": 1.2,
      "S_PALLOR": 1,
      "S_SKIN_ULCER": 2,
      "S_FATIGUE": 0.4,
      "S_PETECHIAE": 0.4,
      "S_ENDEMIC_EXPOSURE": 0.3,
      "S_ANOREXIA": 0.4,
      "S_HIV_HX": 0.3
    },
    "investigations": [
      "rK39 rapid test",
      "Haemoglobin",
      "Splenic or bone marrow aspirate",
      "HIV test"
    ]
  },
  {
    "id": "NS.pe",
    "nameEn": "Pulmonary embolism",
    "nameSw": "Damu kuganda kwenye mapafu",
    "category": "general",
    "acuity": "EMERGENCY_RED",
    "minScore": 4.5,
    "triggers": [
      "S_DYSPNOEA",
      "S_PLEURITIC",
      "S_CHEST_PAIN",
      "S_HAEMOPTYSIS",
      "S_CALF_PAIN",
      "S_CLOT_RISK",
      "S_SUDDEN_ONSET",
      "S_UNCONSCIOUS",
      "V_TACHYCARDIA",
      "V_HYPOXIA",
      "S_PALPITATION",
      "V_TACHYPNOEA"
    ],
    "weights": {
      "S_DYSPNOEA": 1.6,
      "S_PLEURITIC": 1.8,
      "S_CHEST_PAIN": 0.8,
      "S_HAEMOPTYSIS": 1,
      "S_CALF_PAIN": 2,
      "S_CLOT_RISK": 2,
      "S_SUDDEN_ONSET": 1.2,
      "S_UNCONSCIOUS": 0.8,
      "V_TACHYCARDIA": 0.8,
      "V_HYPOXIA": 1,
      "S_PALPITATION": 0.4,
      "V_TACHYPNOEA": 0.4
    },
    "investigations": [
      "ECG",
      "D-dimer if low risk",
      "CT pulmonary angiogram or lower-limb Doppler",
      "Pulse oximetry"
    ]
  },
  {
    "id": "NS.malnutrition",
    "nameEn": "Severe acute malnutrition",
    "nameSw": "Utapiamlo mkali",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 4,
    "triggers": [
      "S_WASTING",
      "S_BIPEDAL_EDEMA",
      "V_LOW_MUAC",
      "V_LOW_WFH",
      "S_POOR_FEEDING",
      "S_HAIR_SKIN_CHANGE",
      "S_DIARRHOEA",
      "S_FEVER",
      "S_PALLOR",
      "S_FATIGUE",
      "S_RECURRENT_INFECTIONS",
      "D_UNDER5"
    ],
    "weights": {
      "S_WASTING": 2.5,
      "S_BIPEDAL_EDEMA": 2.5,
      "V_LOW_MUAC": 3,
      "V_LOW_WFH": 2,
      "S_POOR_FEEDING": 1,
      "S_HAIR_SKIN_CHANGE": 1,
      "S_DIARRHOEA": 0.4,
      "S_FEVER": 0.2,
      "S_PALLOR": 0.4,
      "S_FATIGUE": 0.3,
      "S_RECURRENT_INFECTIONS": 0.4,
      "D_UNDER5": 0.5
    },
    "investigations": [
      "MUAC and weight-for-height",
      "Bilateral pitting oedema check",
      "Blood glucose",
      "Haemoglobin",
      "HIV test",
      "Appetite test"
    ]
  },
  {
    "id": "NS.allergic_reaction",
    "nameEn": "Allergic reaction (urticaria or angioedema; anaphylaxis if airway or shock signs)",
    "nameSw": "Athari ya mzio (vipele au uvimbe; anaphylaksia kama kuna dalili za njia ya hewa au mshtuko)",
    "category": "general",
    "acuity": "PRIORITY_YELLOW",
    "minScore": 3.5,
    "triggers": [
      "S_URTICARIA",
      "S_ANGIOEDEMA",
      "S_ITCH",
      "S_ALLERGEN",
      "S_RASH",
      "S_WHEEZE",
      "S_STRIDOR"
    ],
    "weights": {
      "S_URTICARIA": 2.2,
      "S_ANGIOEDEMA": 2.2,
      "S_ITCH": 1,
      "S_ALLERGEN": 1.2,
      "S_RASH": 0.6,
      "S_WHEEZE": 0.5,
      "S_STRIDOR": 1
    },
    "investigations": [
      "Clinical diagnosis",
      "Observe airway and blood pressure",
      "Identify the trigger"
    ]
  }
];
