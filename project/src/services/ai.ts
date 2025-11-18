export async function generateRecommendations(
  score: number,
  answers: Record<string, number>
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return getFallbackRecommendations(score);
  }

  try {
    const prompt = buildPrompt(score, answers);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate recommendations');
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return generatedText || getFallbackRecommendations(score);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return getFallbackRecommendations(score);
  }
}

function buildPrompt(score: number, answers: Record<string, number>): string {
  const answerSummary = Object.entries(answers)
    .map(([q, v]) => `${q}: ${v}/4`)
    .join(', ');

  if (score >= 9) {
    return `A user has completed a mental health assessment with an excellent score of ${score}/10 (answers: ${answerSummary}). They are doing very well mentally. Generate a brief, encouraging message (3-4 sentences) acknowledging their positive mental health and encouraging them to maintain their healthy habits. Keep it warm and supportive.`;
  } else if (score >= 5) {
    return `A user has completed a mental health assessment with a moderate score of ${score}/10 (answers: ${answerSummary}). They need practical support and guidance. Generate 5-6 specific, actionable recommendations to improve their mental health. Focus on evidence-based strategies like sleep hygiene, exercise, mindfulness, social connection, and stress management. Make each recommendation clear and achievable. Format as a numbered list.`;
  } else {
    return `A user has completed a mental health assessment with a concerning score of ${score}/10 (answers: ${answerSummary}). They need immediate support. Generate a compassionate message (3-4 sentences) that:
1. Validates their feelings
2. Strongly encourages them to seek professional help from a college counselor
3. Emphasizes that professional support is important and nothing to be ashamed of
4. Provides reassurance that things can improve with proper support
Keep the tone warm, non-judgmental, and hopeful.`;
  }
}

function getFallbackRecommendations(score: number): string {
  if (score >= 9) {
    return "You're doing wonderfully! Your assessment indicates excellent mental health. Continue nurturing the positive habits and practices that are working well for you. Remember to maintain your self-care routines, stay connected with loved ones, and celebrate your emotional wellness journey.";
  } else if (score >= 5) {
    return `Based on your assessment, here are personalized recommendations to enhance your mental wellness:

1. Establish a consistent sleep schedule - Aim for 7-9 hours of quality sleep each night. Create a relaxing bedtime routine and avoid screens 1 hour before bed.

2. Incorporate regular physical activity - Exercise for at least 30 minutes, 5 days a week. Even a daily walk can significantly improve mood and energy levels.

3. Practice mindfulness or meditation - Start with just 5-10 minutes daily. Apps like Headspace or Calm can guide you through the process.

4. Strengthen social connections - Reach out to friends or family regularly. Consider joining clubs or groups that align with your interests.

5. Maintain a balanced diet - Focus on whole foods, stay hydrated, and limit caffeine and alcohol intake.

6. Set realistic goals and celebrate small wins - Break larger tasks into manageable steps and acknowledge your progress along the way.`;
  } else {
    return `Your assessment indicates that you may be experiencing significant challenges with your mental health, and it's important to take this seriously. Please know that what you're feeling is valid, and reaching out for support is a sign of strength, not weakness.

We strongly encourage you to schedule an appointment with your college counselor as soon as possible. Professional mental health support can make a tremendous difference, and counselors are trained to help students navigate exactly what you're going through.

Remember: you don't have to face this alone, and with proper support and guidance, things can and will improve. Your mental health matters, and taking this step toward seeking help is an important part of your healing journey.`;
  }
}

export interface EntertainmentItem {
  title: string;
  description: string;
  rating?: string;
  year?: string;
  artist?: string;
}

export interface EntertainmentSuggestions {
  movies: EntertainmentItem[];
  songs: EntertainmentItem[];
}

export type Language = 'Hindi' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Telugu' | 'English';

export async function generateEntertainmentSuggestions(
  score: number,
  language: Language = 'English'
): Promise<EntertainmentSuggestions> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return getFallbackEntertainmentSuggestions(language);
  }

  try {
    const severityLevel = score < 4 ? 'significant emotional challenges' : 'moderate emotional support needs';
    const languageContext = language === 'English' 
      ? 'English language' 
      : `${language} language (Indian regional language)`;
    
    const prompt = `Generate entertainment suggestions (movies and songs) in ${languageContext} that are uplifting, motivational, and promote happiness for someone who needs emotional support (score: ${score}/10, indicating ${severityLevel}). 

Requirements:
- All movies and songs must be in ${languageContext}
- Provide at least 3 movies with high IMDB ratings (7.5+), based on actual viewer feedback and ratings
- Provide at least 3 songs that are uplifting and motivational
- Focus on content that inspires joy, hope, and positive emotions
- For movies: Include title (in original ${language} script or transliteration), year, IMDB rating, and a brief description of why it's uplifting
- For songs: Include title (in original ${language} script or transliteration), artist name, and a brief description of why it's motivational
- Only suggest actual, well-known movies and songs from ${language} cinema/music industry that have received positive reviews

Format the response as JSON with this structure:
{
  "movies": [
    {"title": "Movie Title", "year": "YYYY", "rating": "X.X/10", "description": "Why it's uplifting"}
  ],
  "songs": [
    {"title": "Song Title", "artist": "Artist Name", "description": "Why it's motivational"}
  ]
}

Only return valid JSON, no other text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate entertainment suggestions');
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      // Try to extract JSON from the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.movies && parsed.songs) {
          return {
            movies: parsed.movies.slice(0, 3),
            songs: parsed.songs.slice(0, 3),
          };
        }
      }
    }

    return getFallbackEntertainmentSuggestions(language);
  } catch (error) {
    console.error('Error generating entertainment suggestions:', error);
    return getFallbackEntertainmentSuggestions(language);
  }
}

function getFallbackEntertainmentSuggestions(language: Language = 'English'): EntertainmentSuggestions {
  // Fallback suggestions based on language
  const fallbackData: Record<Language, EntertainmentSuggestions> = {
    English: {
      movies: [
        {
          title: 'The Pursuit of Happyness',
          year: '2006',
          rating: '8.0/10',
          description: 'An inspiring true story about perseverance and never giving up on your dreams, even in the face of overwhelming adversity.',
        },
        {
          title: 'Inside Out',
          year: '2015',
          rating: '8.1/10',
          description: 'A beautiful animated film that helps understand emotions and shows that it\'s okay to feel sad sometimes, with an ultimately uplifting message about emotional well-being.',
        },
        {
          title: 'The Secret Life of Walter Mitty',
          year: '2013',
          rating: '7.3/10',
          description: 'An inspiring journey of self-discovery and adventure that encourages stepping out of your comfort zone and living life to the fullest.',
        },
      ],
      songs: [
        {
          title: 'Happy',
          artist: 'Pharrell Williams',
          description: 'An infectious, upbeat song that promotes joy and positivity, known for its ability to lift spirits.',
        },
        {
          title: 'Here Comes the Sun',
          artist: 'The Beatles',
          description: 'A classic song that brings hope and optimism, reminding listeners that better times are ahead.',
        },
        {
          title: 'Don\'t Stop Believin\'',
          artist: 'Journey',
          description: 'An empowering anthem about holding onto hope and never giving up, perfect for motivation and encouragement.',
        },
      ],
    },
    Hindi: {
      movies: [
        {
          title: '3 Idiots',
          year: '2009',
          rating: '8.4/10',
          description: 'A heartwarming comedy-drama about friendship, following your passion, and finding happiness in life. Highly inspiring and motivational.',
        },
        {
          title: 'Taare Zameen Par',
          year: '2007',
          rating: '8.4/10',
          description: 'A touching story about understanding differences and the power of encouragement. Uplifting and emotionally healing.',
        },
        {
          title: 'Queen',
          year: '2013',
          rating: '8.2/10',
          description: 'An empowering story of self-discovery and independence that inspires confidence and self-love.',
        },
      ],
      songs: [
        {
          title: 'Zindagi Na Milegi Dobara',
          artist: 'Shankar-Ehsaan-Loy',
          description: 'An uplifting song about living life to the fullest and making the most of every moment.',
        },
        {
          title: 'Maa',
          artist: 'A.R. Rahman',
          description: 'A soulful and emotionally comforting song that brings peace and warmth.',
        },
        {
          title: 'Hum Hain Rahi Pyar Ke',
          artist: 'Udit Narayan',
          description: 'A cheerful and motivational song that spreads positivity and joy.',
        },
      ],
    },
    Tamil: {
      movies: [
        {
          title: 'Anbe Sivam',
          year: '2003',
          rating: '8.5/10',
          description: 'A beautiful story about humanity, friendship, and finding joy in life despite challenges. Highly inspirational.',
        },
        {
          title: 'Super Deluxe',
          year: '2019',
          rating: '8.3/10',
          description: 'An intriguing film about acceptance, self-discovery, and finding strength within. Thought-provoking and uplifting.',
        },
        {
          title: 'Kaakka Kaakka',
          year: '2003',
          rating: '8.1/10',
          description: 'An engaging story of justice and righteousness that inspires courage and determination.',
        },
      ],
      songs: [
        {
          title: 'Nenjukulle',
          artist: 'A.R. Rahman',
          description: 'A soothing and uplifting melody that brings peace and positive energy.',
        },
        {
          title: 'Kannukkul Kannai',
          artist: 'Hiphop Tamizha',
          description: 'An energetic and motivational song that inspires confidence and positivity.',
        },
        {
          title: 'Adiye',
          artist: 'Darbuka Siva',
          description: 'A feel-good song that spreads happiness and joy with its upbeat rhythm.',
        },
      ],
    },
    Kannada: {
      movies: [
        {
          title: 'Lucia',
          year: '2013',
          rating: '8.2/10',
          description: 'An innovative film about dreams, aspirations, and the power of imagination. Inspiring and thought-provoking.',
        },
        {
          title: 'Rangitaranga',
          year: '2015',
          rating: '8.0/10',
          description: 'A captivating mystery that keeps you engaged while exploring themes of hope and resolution.',
        },
        {
          title: 'Kirik Party',
          year: '2016',
          rating: '8.1/10',
          description: 'A heartwarming college drama about friendship, dreams, and the joy of youth. Uplifting and nostalgic.',
        },
      ],
      songs: [
        {
          title: 'Nee Nanna Onde',
          artist: 'V. Harikrishna',
          description: 'A beautiful melody that brings emotional comfort and peace.',
        },
        {
          title: 'Jokali',
          artist: 'B. Ajaneesh Loknath',
          description: 'An energetic and motivational song that inspires positivity and joy.',
        },
        {
          title: 'Neene Neene',
          artist: 'Raghu Dixit',
          description: 'A soulful and uplifting song that brings happiness and emotional warmth.',
        },
      ],
    },
    Malayalam: {
      movies: [
        {
          title: 'Bangalore Days',
          year: '2014',
          rating: '8.4/10',
          description: 'A heartwarming story about friendship, love, and finding happiness in life. Uplifting and feel-good.',
        },
        {
          title: 'Premam',
          year: '2015',
          rating: '8.3/10',
          description: 'A beautiful coming-of-age story that celebrates life, love, and growth. Inspiring and joyful.',
        },
        {
          title: 'Ustad Hotel',
          year: '2012',
          rating: '8.2/10',
          description: 'An inspiring story about following your passion and finding purpose. Heartwarming and motivational.',
        },
      ],
      songs: [
        {
          title: 'Aaromale',
          artist: 'Deepak Dev',
          description: 'A mesmerizing melody that brings peace and emotional comfort.',
        },
        {
          title: 'Malare',
          artist: 'Vijay Yesudas',
          description: 'A beautiful romantic song that spreads joy and positive emotions.',
        },
        {
          title: 'Etho Mazhayil',
          artist: 'Rahul Raj',
          description: 'A soothing and uplifting song that brings happiness and calm.',
        },
      ],
    },
    Telugu: {
      movies: [
        {
          title: 'Baahubali: The Beginning',
          year: '2015',
          rating: '8.0/10',
          description: 'An epic tale of courage, determination, and never giving up. Highly inspiring and motivational.',
        },
        {
          title: 'Jersey',
          year: '2019',
          rating: '8.5/10',
          description: 'A heartwarming story about perseverance, family, and chasing dreams. Uplifting and emotional.',
        },
        {
          title: 'Maharshi',
          year: '2019',
          rating: '7.8/10',
          description: 'An inspiring story about giving back to society and finding purpose. Motivational and heartwarming.',
        },
      ],
      songs: [
        {
          title: 'Nuvvunte Naa Jathaga',
          artist: 'Devi Sri Prasad',
          description: 'An uplifting and energetic song that spreads positivity and joy.',
        },
        {
          title: 'Neeve Neeve',
          artist: 'Anirudh Ravichander',
          description: 'A beautiful melody that brings emotional comfort and happiness.',
        },
        {
          title: 'Yedurangula Vaana',
          artist: 'M.M. Keeravani',
          description: 'A soulful and inspiring song that brings peace and positive energy.',
        },
      ],
    },
  };

  return fallbackData[language] || fallbackData.English;
}
