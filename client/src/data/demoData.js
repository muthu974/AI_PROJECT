/**
 * Demo / illustrative data used ONLY when the ML backend is unavailable.
 * All results are clearly labeled as demonstration data.
 *
 * IMPORTANT: These are NOT real medical predictions.
 * They exist solely to showcase the UI during academic presentations.
 */

/**
 * Returns illustrative demo predictions based on symptom overlap.
 * Scores are arbitrary demonstration values, NOT medical probabilities.
 */
export function getDemoPredictions(selectedSymptomIds) {
  const matched = demoPredictionRules
    .map((rule) => {
      const overlap = rule.triggerSymptoms.filter((s) =>
        selectedSymptomIds.includes(s)
      ).length;
      if (overlap === 0) return null;
      // Arbitrary demo score based on overlap ratio — NOT a real probability
      const demoScore = Math.min(
        0.95,
        Math.round((overlap / rule.triggerSymptoms.length) * 85 + Math.random() * 10) / 100
      );
      return {
        condition: rule.condition,
        score: demoScore,
        description: rule.description,
        precautions: rule.precautions,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (matched.length === 0) {
    matched.push({
      condition: 'No Strong Pattern Match',
      score: 0.15,
      description:
        'The selected symptoms did not strongly match any predefined demonstration patterns. In a real system, the ML model would analyze these symptoms comprehensively.',
      precautions: [
        'Consult a healthcare professional for proper evaluation',
        'Keep track of your symptoms and their duration',
        'Stay hydrated and get adequate rest',
      ],
    });
  }

  return {
    mode: 'demo',
    predictions: matched,
    guidance: [
      'These are illustrative demo results for academic presentation purposes only.',
      'A real diagnosis requires examination by a qualified healthcare professional.',
      'If you are experiencing concerning symptoms, please seek medical attention.',
      'Stay hydrated, maintain good hygiene, and get adequate rest.',
      'Keep a record of symptoms including onset, duration, and severity for your doctor.',
    ],
    timestamp: new Date().toISOString(),
  };
}

const demoPredictionRules = [
  {
    condition: 'Common Cold',
    triggerSymptoms: ['fever', 'cough', 'sore_throat', 'runny_nose', 'congestion', 'sneezing', 'fatigue'],
    description:
      'The common cold is a viral infection of the upper respiratory tract. It is usually harmless and resolves on its own within 7–10 days.',
    precautions: [
      'Rest and stay hydrated',
      'Over-the-counter remedies may help alleviate symptoms',
      'Wash hands frequently to prevent spreading',
      'See a doctor if symptoms persist beyond 10 days',
    ],
  },
  {
    condition: 'Influenza (Flu)',
    triggerSymptoms: ['fever', 'cough', 'fatigue', 'body_pain', 'headache', 'chills', 'weakness', 'sore_throat'],
    description:
      'Influenza is a contagious respiratory illness caused by influenza viruses. It can range from mild to severe.',
    precautions: [
      'Rest and drink plenty of fluids',
      'Antiviral medications may be prescribed if caught early',
      'Annual flu vaccination is recommended for prevention',
      'Seek medical attention if breathing difficulty develops',
    ],
  },
  {
    condition: 'Migraine',
    triggerSymptoms: ['headache', 'nausea', 'sensitivity_to_light', 'blurred_vision', 'dizziness', 'vomiting'],
    description:
      'Migraines are recurring headaches that can cause intense throbbing or pulsing, often on one side of the head.',
    precautions: [
      'Rest in a quiet, dark room',
      'Apply cold compresses to the forehead',
      'Identify and avoid personal triggers',
      'Consult a doctor for preventive medication options',
    ],
  },
  {
    condition: 'Gastroenteritis',
    triggerSymptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'fever', 'fatigue', 'loss_of_appetite'],
    description:
      'Gastroenteritis involves inflammation of the stomach and intestines, commonly caused by viral or bacterial infections.',
    precautions: [
      'Stay hydrated with oral rehydration solutions',
      'Follow the BRAT diet (bananas, rice, applesauce, toast)',
      'Avoid dairy and fatty foods until recovered',
      'Seek medical attention if symptoms are severe or persistent',
    ],
  },
  {
    condition: 'Allergic Reaction',
    triggerSymptoms: ['sneezing', 'runny_nose', 'itching', 'rash', 'congestion', 'wheezing', 'shortness_of_breath'],
    description:
      'Allergies occur when the immune system reacts to a foreign substance. Symptoms range from mild to severe.',
    precautions: [
      'Identify and avoid known allergens',
      'Antihistamines may help manage symptoms',
      'Seek immediate medical attention for severe reactions',
      'Consider allergy testing for persistent symptoms',
    ],
  },
  {
    condition: 'Tension-Type Headache',
    triggerSymptoms: ['headache', 'neck_stiffness', 'fatigue', 'difficulty_concentrating', 'muscle_ache'],
    description:
      'Tension headaches are the most common type of headache, often related to stress, poor posture, or muscle tension.',
    precautions: [
      'Practice stress management techniques',
      'Maintain good posture',
      'Regular physical exercise can help prevent episodes',
      'Over-the-counter pain relievers may provide temporary relief',
    ],
  },
  {
    condition: 'Bronchitis',
    triggerSymptoms: ['cough', 'chest_tightness', 'fatigue', 'shortness_of_breath', 'wheezing', 'fever', 'sore_throat'],
    description:
      'Bronchitis is an inflammation of the bronchial tubes. Acute bronchitis often follows a respiratory infection.',
    precautions: [
      'Rest and increase fluid intake',
      'Use a humidifier to ease breathing',
      'Avoid irritants like smoke and dust',
      'See a doctor if cough persists beyond 3 weeks',
    ],
  },
  {
    condition: 'Hypertension Symptoms',
    triggerSymptoms: ['headache', 'dizziness', 'blurred_vision', 'chest_pain', 'shortness_of_breath', 'palpitations'],
    description:
      'High blood pressure often has no symptoms, but severe cases may present with headaches, dizziness, or chest pain.',
    precautions: [
      'Monitor blood pressure regularly',
      'Reduce sodium intake and maintain a healthy diet',
      'Exercise regularly and manage stress',
      'Consult a healthcare provider for proper evaluation',
    ],
  },
];

/** Demo assessment history entries — clearly labeled as demo data */
export const demoHistoryEntries = [
  {
    id: 'demo-1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    symptoms: ['fever', 'cough', 'fatigue', 'sore_throat'],
    topPrediction: 'Common Cold',
    topScore: 0.82,
    mode: 'demo',
    predictions: [
      { condition: 'Common Cold', score: 0.82 },
      { condition: 'Influenza (Flu)', score: 0.65 },
    ],
  },
  {
    id: 'demo-2',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    symptoms: ['headache', 'nausea', 'sensitivity_to_light'],
    topPrediction: 'Migraine',
    topScore: 0.78,
    mode: 'demo',
    predictions: [
      { condition: 'Migraine', score: 0.78 },
      { condition: 'Tension-Type Headache', score: 0.55 },
    ],
  },
];
