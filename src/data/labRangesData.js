export const LABS = {
  na:{label:'Sodium',unit:'mmol/L',ranges:[
    {max:120,status:'critical',text:'Severe hyponatraemia — risk of cerebral oedema and seizures.',action:'URGENT: Notify doctor immediately. Neurological obs. Cautious correction — avoid rapid rise.'},
    {max:130,status:'low',text:'Moderate hyponatraemia — symptomatic: nausea, headache, confusion.',action:'Report to team. Check fluid balance and causative medications. Monitor closely.'},
    {max:135,status:'low',text:'Mild hyponatraemia.',action:'Inform medical team. Monitor sodium trend and fluid status.'},
    {max:145,status:'normal',text:'Sodium within normal range.',action:'Routine monitoring.'},
    {max:155,status:'high',text:'Mild hypernatraemia — usually dehydration.',action:'Encourage oral fluids if safe. Review fluid balance. Notify team if symptomatic.'},
    {max:999,status:'critical',text:'Severe hypernatraemia — risk of neurological injury.',action:'URGENT: IV fluid replacement with caution — rapid correction risks cerebral oedema. Notify doctor.'}
  ]},
  k:{label:'Potassium',unit:'mmol/L',ranges:[
    {max:2.5,status:'critical',text:'Severe hypokalaemia — risk of fatal arrhythmia.',action:'URGENT: ECG stat. IV potassium replacement — no bolus. Notify doctor immediately.'},
    {max:3.5,status:'low',text:'Hypokalaemia — arrhythmia and muscle weakness risk.',action:'Oral or IV potassium replacement. Review diuretics and digoxin. Check Mg2+.'},
    {max:5.0,status:'normal',text:'Potassium within normal range.',action:'Routine monitoring.'},
    {max:6.0,status:'high',text:'Hyperkalaemia — arrhythmia risk.',action:'ECG stat. Dietary restriction. Review contributing drugs. Notify team.'},
    {max:999,status:'critical',text:'Severe hyperkalaemia — cardiac arrest risk.',action:'EMERGENCY: ECG immediately. Calcium gluconate IV, insulin-dextrose, salbutamol neb. Crash team standby.'}
  ]},
  hb:{label:'Haemoglobin',unit:'g/dL',ranges:[
    {max:7,status:'critical',text:'Severe anaemia — likely symptomatic with tachycardia and dyspnoea.',action:'URGENT: Notify doctor. Likely transfusion. Group & screen. Monitor HR, BP, SpO2.'},
    {max:10,status:'low',text:'Moderate anaemia.',action:'Report to team. Investigate cause. Check symptoms.'},
    {max:12,status:'low',text:'Mild anaemia.',action:'Monitor trend. Consider dietary/iron supplements; investigate cause.'},
    {max:17,status:'normal',text:'Haemoglobin within normal range.',action:'Routine monitoring.'},
    {max:999,status:'high',text:'Polycythaemia — raised Hb.',action:'Report to team. Thrombosis risk. May need haematology review.'}
  ]},
  creat:{label:'Creatinine',unit:'μmol/L',ranges:[
    {max:110,status:'normal',text:'Creatinine normal.',action:'Routine monitoring.'},
    {max:180,status:'high',text:'Mildly elevated — early CKD or AKI stage 1.',action:'Compare to baseline. Review nephrotoxic drugs. Hydration.'},
    {max:350,status:'high',text:'Moderately elevated — AKI stage 2 or significant CKD.',action:'Notify team. Strict fluid balance. Avoid nephrotoxins. Monitor urine output.'},
    {max:999,status:'critical',text:'Severely elevated — AKI stage 3 / possible RRT need.',action:'URGENT: Renal team. Hourly urine output. Catheterise. Avoid all nephrotoxins.'}
  ]},
  gluc:{label:'Blood Glucose',unit:'mmol/L',ranges:[
    {max:2.5,status:'critical',text:'Severe hypoglycaemia — impaired consciousness risk.',action:'EMERGENCY: 15–20g fast-acting glucose STAT. If unconscious: IV 20% dextrose 50mL or IM glucagon. Recheck 15 min.'},
    {max:4.0,status:'low',text:'Hypoglycaemia — shaky, sweaty, confused.',action:'15g fast-acting carbohydrate. Recheck 15 min. Review insulin/sulphonylurea dose.'},
    {max:7.8,status:'normal',text:'Blood glucose normal.',action:'Routine monitoring.'},
    {max:11.0,status:'high',text:'Elevated blood glucose.',action:'Review diabetes management. Increase monitoring. Check for DKA symptoms.'},
    {max:20,status:'high',text:'Significantly elevated blood glucose.',action:'Notify prescriber. Check ketones, blood gas. Likely insulin adjustment needed.'},
    {max:999,status:'critical',text:'Dangerously high — DKA or HHS likely.',action:'URGENT: Notify doctor. Check ketones, ABG. Fluid resuscitation and insulin per protocol.'}
  ]},
  wbc:{label:'White Blood Cells',unit:'×10⁹/L',ranges:[
    {max:2.0,status:'critical',text:'Severe leucopenia — high infection risk.',action:'URGENT: Barrier nursing. Notify haematology. No raw food or live vaccines.'},
    {max:4.0,status:'low',text:'Leucopenia — increased infection risk.',action:'Report to team. Investigate cause. Monitor for infection.'},
    {max:11.0,status:'normal',text:'WBC normal.',action:'Routine monitoring.'},
    {max:20.0,status:'high',text:'Leucocytosis — often infection or stress.',action:'Assess for infection, fever, pain. Clinical correlation.'},
    {max:999,status:'critical',text:'Markedly elevated — consider leukaemia or severe infection.',action:'URGENT: Notify doctor. Haematology review.'}
  ]},
  inr:{label:'INR',unit:'',ranges:[
    {max:0.8,status:'low',text:'Sub-therapeutic anticoagulation.',action:'If on warfarin: review compliance and diet. Notify team for dose review.'},
    {max:1.2,status:'normal',text:'Normal INR.',action:'Routine.'},
    {max:3.0,status:'normal',text:'Therapeutic range for most indications.',action:'Continue warfarin as prescribed.'},
    {max:4.0,status:'high',text:'Supratherapeutic — elevated bleeding risk.',action:'Hold next dose. Notify prescriber. Minimise invasive procedures.'},
    {max:8.0,status:'critical',text:'Dangerously elevated — major bleeding risk.',action:'URGENT: Hold warfarin. Vitamin K per protocol. Notify doctor. If bleeding: 4-factor PCC.'},
    {max:999,status:'critical',text:'Critical INR.',action:'EMERGENCY: Vitamin K IV + PCC if bleeding. Haematology urgently.'}
  ]},
  egfr:{label:'eGFR',unit:'mL/min/1.73m²',ranges:[
    {max:15,status:'critical',text:'CKD stage 5 — kidney failure.',action:'URGENT: Renal team. Fluid restriction. Drug adjustments. Dialysis planning.'},
    {max:30,status:'high',text:'CKD stage 4 — severely reduced.',action:'Adjust renally-cleared medications. Avoid nephrotoxins. Dietitian referral.'},
    {max:45,status:'low',text:'CKD stage 3b.',action:'Notify team. Medication review. Nephrology referral.'},
    {max:60,status:'low',text:'CKD stage 3a.',action:'Monitor trend. Review medications (metformin, antibiotics). Good hydration.'},
    {max:999,status:'normal',text:'eGFR normal.',action:'Routine monitoring.'}
  ]},
  ca:{label:'Calcium',unit:'mmol/L',ranges:[
    {max:1.8,status:'critical',text:'Severe hypocalcaemia — tetany, laryngospasm, cardiac arrest risk.',action:'URGENT: IV calcium gluconate. Cardiac monitoring. Notify doctor.'},
    {max:2.2,status:'low',text:'Mild hypocalcaemia — paraesthesia, Chvostek\'s sign.',action:'Oral calcium supplement or IV if symptomatic. Check Mg2+ and Vit D. Report to team.'},
    {max:2.6,status:'normal',text:'Calcium normal.',action:'Routine monitoring.'},
    {max:3.0,status:'high',text:'Mild hypercalcaemia — constipation, nausea, polyuria.',action:'IV hydration. Notify team. Investigate cause (PTH, malignancy).'},
    {max:999,status:'critical',text:'Severe hypercalcaemia — confusion, cardiac arrhythmia, coma.',action:'URGENT: IV saline, bisphosphonates, furosemide. Notify doctor immediately.'}
  ]},
  crp:{label:'CRP',unit:'mg/L',ranges:[
    {max:10,status:'normal',text:'CRP normal — no significant inflammation.',action:'Routine monitoring.'},
    {max:50,status:'high',text:'Mildly elevated CRP — mild infection or inflammatory response.',action:'Correlate clinically. Monitor for infection signs. Repeat in 24–48h.'},
    {max:100,status:'high',text:'Moderately elevated CRP — active infection or inflammation.',action:'Report to team. Blood cultures if clinically indicated. Review antibiotic therapy.'},
    {max:200,status:'critical',text:'Markedly elevated CRP — severe infection, sepsis, or systemic disease.',action:'URGENT: Consider sepsis protocol. Blood cultures. Notify doctor. Review antibiotic appropriateness.'},
    {max:999,status:'critical',text:'Very high CRP — serious infection, sepsis, or severe inflammatory state.',action:'EMERGENCY: Sepsis 6 bundle. Immediate medical review.'}
  ]},
  trop:{label:'Troponin (hs)',unit:'ng/L',ranges:[
    {max:14,status:'normal',text:'Troponin normal — no significant myocardial injury.',action:'Routine; repeat in 3h if ACS suspected (ESC 0/1h or 0/3h protocol).'},
    {max:50,status:'high',text:'Slightly elevated troponin — possible minor myocardial injury.',action:'Notify medical team. Serial troponins per ACS protocol. 12-lead ECG. Consider urgent cardiology review.'},
    {max:500,status:'critical',text:'Significantly elevated troponin — significant myocardial injury.',action:'URGENT: 12-lead ECG, cardiology review, ACS protocol. Aspirin, antiplatelet therapy as instructed.'},
    {max:999,status:'critical',text:'Markedly elevated troponin — major myocardial injury, possible STEMI.',action:'EMERGENCY: Primary PCI activation (STEMI) or ACS pathway. Aspirin 300 mg, IV access, continuous monitoring. Cardiology immediately.'}
  ]},
  tsh:{label:'TSH',unit:'mIU/L',ranges:[
    {max:0.1,status:'critical',text:'Markedly suppressed TSH — significant hyperthyroidism.',action:'URGENT: Refer to endocrinology. Risk of thyroid storm; avoid amiodarone and iodinated contrast. Monitor cardiac function.'},
    {max:0.4,status:'low',text:'Low TSH — subclinical or overt hyperthyroidism.',action:'Notify team. Check free T4/T3. Endocrinology review. Monitor HR and cardiac function.'},
    {max:4.0,status:'normal',text:'TSH normal — euthyroid.',action:'Routine monitoring.'},
    {max:10,status:'high',text:'Elevated TSH — subclinical hypothyroidism.',action:'Report to team. Check free T4. Thyroid supplementation may be initiated.'},
    {max:999,status:'critical',text:'Markedly elevated TSH — severe hypothyroidism, possible myxoedema coma.',action:'URGENT: Endocrinology review. If myxoedema coma suspected (hypothermia, coma): IV levothyroxine, hydrocortisone, ICU.'}
  ]},
};

export const LAB_FIELDS = [
  {key:'na', label:'Sodium (Na)', placeholder:'mmol/L', ref:'Ref: 135–145 mmol/L', step:'0.1'},
  {key:'k',  label:'Potassium (K)', placeholder:'mmol/L', ref:'Ref: 3.5–5.0 mmol/L', step:'0.1'},
  {key:'hb', label:'Haemoglobin (Hb)', placeholder:'g/dL', ref:'Ref: M 13–17, F 12–15 g/dL', step:'0.1'},
  {key:'creat', label:'Creatinine', placeholder:'μmol/L', ref:'Ref: 60–110 μmol/L', step:'1'},
  {key:'gluc', label:'Glucose (Random)', placeholder:'mmol/L', ref:'Ref: 4.0–7.8 mmol/L', step:'0.1'},
  {key:'wbc', label:'WBC', placeholder:'×10⁹/L', ref:'Ref: 4.0–11.0 ×10⁹/L', step:'0.1'},
  {key:'inr', label:'INR', placeholder:'ratio', ref:'Ref: 0.8–1.2 (therapeutic 2–3)', step:'0.1'},
  {key:'egfr', label:'eGFR', placeholder:'mL/min/1.73m²', ref:'Ref: >60 mL/min/1.73m²', step:'1'},
  {key:'ca', label:'Calcium (Ca)', placeholder:'mmol/L', ref:'Ref: 2.2–2.6 mmol/L', step:'0.1'},
  {key:'crp', label:'CRP', placeholder:'mg/L', ref:'Ref: <10 mg/L', step:'0.1'},
  {key:'trop', label:'Troponin I/T (hs)', placeholder:'ng/L', ref:'Ref: <14 ng/L (varies by assay)', step:'1'},
  {key:'tsh', label:'TSH', placeholder:'mIU/L', ref:'Ref: 0.4–4.0 mIU/L', step:'0.01'},
];
