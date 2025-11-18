export interface Question {
  id: string;
  question: string;
  category: string;
  options: {
    text: string;
    value: number;
  }[];
}

export const mentalHealthQuestions: Question[] = [
  {
    id: 'q1',
    category: 'Mood',
    question: 'Over the past two weeks, how often have you felt down, depressed, or hopeless?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q2',
    category: 'Interest',
    question: 'Over the past two weeks, how often have you had little interest or pleasure in doing things?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q3',
    category: 'Sleep',
    question: 'How would you rate your sleep quality over the past two weeks?',
    options: [
      { text: 'Very good, sleeping well', value: 4 },
      { text: 'Good, minor issues', value: 3 },
      { text: 'Poor, frequent disturbances', value: 2 },
      { text: 'Very poor, major sleep problems', value: 1 },
    ],
  },
  {
    id: 'q4',
    category: 'Energy',
    question: 'How often have you felt tired or had little energy in the past two weeks?',
    options: [
      { text: 'Rarely or never', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q5',
    category: 'Appetite',
    question: 'Have you experienced changes in your appetite or eating habits recently?',
    options: [
      { text: 'No changes, appetite is normal', value: 4 },
      { text: 'Slight changes', value: 3 },
      { text: 'Moderate changes', value: 2 },
      { text: 'Significant changes', value: 1 },
    ],
  },
  {
    id: 'q6',
    category: 'Self-worth',
    question: 'How often have you felt bad about yourself or that you are a failure?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q7',
    category: 'Concentration',
    question: 'How often have you had trouble concentrating on things like reading or watching TV?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q8',
    category: 'Anxiety',
    question: 'How often have you felt nervous, anxious, or on edge?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q9',
    category: 'Worry',
    question: 'How often have you been unable to stop or control worrying?',
    options: [
      { text: 'Not at all', value: 4 },
      { text: 'Several days', value: 3 },
      { text: 'More than half the days', value: 2 },
      { text: 'Nearly every day', value: 1 },
    ],
  },
  {
    id: 'q10',
    category: 'Social',
    question: 'How would you describe your social connections and support system?',
    options: [
      { text: 'Very strong, feel well supported', value: 4 },
      { text: 'Good, have people I can rely on', value: 3 },
      { text: 'Limited, feel somewhat isolated', value: 2 },
      { text: 'Very limited or non-existent', value: 1 },
    ],
  },
];

export function calculateScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const average = sum / values.length;
  const normalizedScore = Math.round((average / 4) * 10);
  return Math.max(1, Math.min(10, normalizedScore));
}
