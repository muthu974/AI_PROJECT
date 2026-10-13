/**
 * Symptom categories and their items for the symptom checker.
 * Each symptom has a unique id, label, and category.
 */

export const symptomCategories = [
  {
    name: 'General',
    icon: 'Thermometer',
    symptoms: [
      { id: 'fever', label: 'Fever' },
      { id: 'fatigue', label: 'Fatigue' },
      { id: 'weakness', label: 'Weakness' },
      { id: 'chills', label: 'Chills' },
      { id: 'sweating', label: 'Excessive Sweating' },
      { id: 'weight_loss', label: 'Unexplained Weight Loss' },
      { id: 'weight_gain', label: 'Unexplained Weight Gain' },
      { id: 'malaise', label: 'General Malaise' },
    ],
  },
  {
    name: 'Respiratory',
    icon: 'Wind',
    symptoms: [
      { id: 'cough', label: 'Cough' },
      { id: 'sore_throat', label: 'Sore Throat' },
      { id: 'shortness_of_breath', label: 'Shortness of Breath' },
      { id: 'runny_nose', label: 'Runny Nose' },
      { id: 'congestion', label: 'Nasal Congestion' },
      { id: 'sneezing', label: 'Sneezing' },
      { id: 'wheezing', label: 'Wheezing' },
      { id: 'chest_tightness', label: 'Chest Tightness' },
    ],
  },
  {
    name: 'Neurological',
    icon: 'Brain',
    symptoms: [
      { id: 'headache', label: 'Headache' },
      { id: 'dizziness', label: 'Dizziness' },
      { id: 'confusion', label: 'Confusion' },
      { id: 'numbness', label: 'Numbness or Tingling' },
      { id: 'blurred_vision', label: 'Blurred Vision' },
      { id: 'sensitivity_to_light', label: 'Sensitivity to Light' },
      { id: 'difficulty_concentrating', label: 'Difficulty Concentrating' },
    ],
  },
  {
    name: 'Digestive',
    icon: 'Apple',
    symptoms: [
      { id: 'nausea', label: 'Nausea' },
      { id: 'vomiting', label: 'Vomiting' },
      { id: 'abdominal_pain', label: 'Abdominal Pain' },
      { id: 'diarrhea', label: 'Diarrhea' },
      { id: 'constipation', label: 'Constipation' },
      { id: 'bloating', label: 'Bloating' },
      { id: 'loss_of_appetite', label: 'Loss of Appetite' },
      { id: 'heartburn', label: 'Heartburn' },
    ],
  },
  {
    name: 'Musculoskeletal',
    icon: 'Bone',
    symptoms: [
      { id: 'body_pain', label: 'Body Pain' },
      { id: 'joint_pain', label: 'Joint Pain' },
      { id: 'muscle_ache', label: 'Muscle Ache' },
      { id: 'back_pain', label: 'Back Pain' },
      { id: 'neck_stiffness', label: 'Neck Stiffness' },
      { id: 'swelling_joints', label: 'Swelling in Joints' },
    ],
  },
  {
    name: 'Skin',
    icon: 'Fingerprint',
    symptoms: [
      { id: 'rash', label: 'Skin Rash' },
      { id: 'itching', label: 'Itching' },
      { id: 'dry_skin', label: 'Dry Skin' },
      { id: 'skin_discoloration', label: 'Skin Discoloration' },
      { id: 'bruising', label: 'Easy Bruising' },
    ],
  },
  {
    name: 'Cardiovascular',
    icon: 'Heart',
    symptoms: [
      { id: 'chest_pain', label: 'Chest Pain' },
      { id: 'palpitations', label: 'Heart Palpitations' },
      { id: 'swelling_legs', label: 'Swelling in Legs' },
      { id: 'rapid_heartbeat', label: 'Rapid Heartbeat' },
    ],
  },
];

/** Flat list of all symptoms for search */
export const allSymptoms = symptomCategories.flatMap((cat) =>
  cat.symptoms.map((s) => ({ ...s, category: cat.name }))
);
