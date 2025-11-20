import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateRecommendations, generateEntertainmentSuggestions, EntertainmentSuggestions, Language } from '../services/ai';
import { Assessment } from '../lib/supabase';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Heart,
  MessageSquare,
  ArrowLeft,
  Loader2,
  Send,
  Smile,
  Film,
  Music,
} from 'lucide-react';

interface ResultsProps {
  assessmentId: string;
  onBack: () => void;
}

export default function Results({ assessmentId, onBack }: ResultsProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const [happinessSecret, setHappinessSecret] = useState('');
  const [submittingSecret, setSubmittingSecret] = useState(false);
  const [secretSubmitted, setSecretSubmitted] = useState(false);
  const [happyUserSecrets, setHappyUserSecrets] = useState<string[]>([]);
  const [loadingSecrets, setLoadingSecrets] = useState(false);
  const [entertainmentSuggestions, setEntertainmentSuggestions] = useState<EntertainmentSuggestions | null>(null);
  const [loadingEntertainment, setLoadingEntertainment] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  useEffect(() => {
    loadAssessment();
  }, [assessmentId]);

  const loadAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (error) throw error;

      setAssessment(data);

      if (!data.recommendations) {
        setGeneratingRecommendations(true);
        const recommendations = await generateRecommendations(data.score, data.answers);

        const { error: updateError } = await supabase
          .from('assessments')
          .update({ recommendations })
          .eq('id', assessmentId);

        if (!updateError) {
          setAssessment((prev) => (prev ? { ...prev, recommendations } : null));
        }

        setGeneratingRecommendations(false);
      }

      setLoading(false);

      if (data.score >= 5 && data.score <= 8) {
        loadHappyUserSecrets();
      }

      // Don't auto-load entertainment suggestions - wait for user to select a language
      // Entertainment suggestions will be loaded when user selects a language
    } catch (error) {
      console.error('Error loading assessment:', error);
      setLoading(false);
    }
  };

  const loadEntertainmentSuggestions = async (score: number, language: Language) => {
    setLoadingEntertainment(true);
    setEntertainmentSuggestions(null);
    try {
      const suggestions = await generateEntertainmentSuggestions(score, language);
      setEntertainmentSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading entertainment suggestions:', error);
    }
    setLoadingEntertainment(false);
  };

  const handleLanguageSelect = (language: Language) => {
    if (!assessment) return;
    setSelectedLanguage(language);
    loadEntertainmentSuggestions(assessment.score, language);
  };

  const loadHappyUserSecrets = async () => {
    setLoadingSecrets(true);
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('happiness_secret')
        .gte('score', 8)
        .not('happiness_secret', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        const secrets = data
          .map((item) => item.happiness_secret)
          .filter((secret): secret is string => secret !== null);
        setHappyUserSecrets(secrets);
      }
    } catch (error) {
      console.error('Error loading happiness secrets:', error);
    }
    setLoadingSecrets(false);
  };

  const handleSubmitSecret = async () => {
    if (!happinessSecret.trim() || !assessment) return;

    setSubmittingSecret(true);

    try {
      const { error } = await supabase
        .from('assessments')
        .update({ happiness_secret: happinessSecret })
        .eq('id', assessmentId);

      if (!error) {
        setSecretSubmitted(true);
        setAssessment((prev) => (prev ? { ...prev, happiness_secret: happinessSecret } : null));
      }
    } catch (error) {
      console.error('Error submitting happiness secret:', error);
    }

    setSubmittingSecret(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Assessment not found</p>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score < 4) return 'text-red-600';
    if (score <= 8) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreBackground = (score: number) => {
    if (score < 4) return 'from-red-500 via-red-600 to-red-700';
    if (score <= 8) return 'from-yellow-400 via-yellow-500 to-orange-500';
    return 'from-green-500 via-green-600 to-emerald-600';
  };

  const getScoreIcon = (score: number) => {
    if (score < 4) return <AlertTriangle className="w-12 h-12" />;
    if (score <= 8) return <TrendingUp className="w-12 h-12" />;
    return <Heart className="w-12 h-12" />;
  };

  const getScoreLabel = (score: number) => {
    if (score < 4) return 'Needs Attention';
    if (score <= 8) return 'Moderate Well-being';
    return 'Excellent Well-being';
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4" style={{ backgroundColor: '#f0f9ff' }}>
      {/* Floating Brain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-24 left-20 w-36 h-36 opacity-10 text-blue-600 floating-brain" />
        <Brain className="absolute bottom-24 right-20 w-32 h-32 opacity-10 text-purple-600 floating-brain-fast" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-8 space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
          <div className={`bg-gradient-to-r ${getScoreBackground(assessment.score)} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3">Your Mental Health Assessment</h1>
                <p className="text-white/90 text-lg font-medium">
                  Completed on {new Date(assessment.created_at).toLocaleDateString()}
                </p>
              </div>
              <Brain className="w-20 h-20 opacity-90 animate-pulse" />
            </div>
          </div>

          <div className="p-8 space-y-8 bg-white">
            <div className="text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBackground(assessment.score)} text-white shadow-2xl animate-pulse`}>
                  {getScoreIcon(assessment.score)}
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl opacity-30 -z-10"></div>
              </div>
              <div>
                <div className={`text-7xl font-bold ${getScoreColor(assessment.score)}`}>
                  {assessment.score}/10
                </div>
                <p className="text-2xl text-gray-800 mt-3 font-bold">{getScoreLabel(assessment.score)}</p>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                Personalized Recommendations
              </h2>

              {generatingRecommendations ? (
                <div className="flex items-center gap-4 text-gray-700 bg-blue-50 p-8 rounded-2xl shadow-lg border-2 border-blue-200">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-lg font-semibold">Generating personalized recommendations for you...</p>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="bg-gray-50 p-8 rounded-2xl text-gray-800 whitespace-pre-line leading-relaxed text-lg font-medium shadow-lg border-2 border-gray-100">
                    {assessment.recommendations}
                  </div>
                </div>
              )}

              {assessment.score >= 5 && assessment.score <= 8 && happyUserSecrets.length > 0 && (
                <div className="mt-8 bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-cyan-900 mb-4 flex items-center gap-3">
                    <div className="bg-cyan-600 p-2 rounded-lg">
                      <Smile className="w-6 h-6 text-white" />
                    </div>
                    Some Suggestions from Happy Users
                  </h3>
                  <div className="space-y-4">
                    {happyUserSecrets.map((secret, index) => (
                      <div key={index} className="bg-white p-5 rounded-xl border-2 border-cyan-200 shadow-md">
                        <p className="text-gray-800 italic text-base font-medium">"{secret}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Entertainment Suggestions Section */}
            {assessment.score <= 8 && (
              <div className="border-t-2 border-gray-200 pt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Film className="w-7 h-7 text-white" />
                  </div>
                  Entertainment Suggestions
                </h2>
                <p className="text-gray-700 mb-6 text-lg font-medium leading-relaxed">
                  Select your preferred language to get personalized movie and song recommendations that can help boost your mood and motivation. These suggestions are based on high ratings and positive viewer feedback.
                </p>

                {/* Language Selection Buttons */}
                <div className="mb-8">
                  <p className="text-base font-bold text-gray-800 mb-4">Choose your preferred language:</p>
                  <div className="flex flex-wrap gap-3">
                    {(['Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Telugu', 'English'] as Language[]).map((language) => (
                      <button
                        key={language}
                        onClick={() => handleLanguageSelect(language)}
                        disabled={loadingEntertainment}
                        className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md ${
                          selectedLanguage === language
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl scale-105'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingEntertainment ? (
                  <div className="flex items-center gap-4 text-gray-700 bg-purple-50 p-8 rounded-2xl shadow-lg border-2 border-purple-200">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-lg font-semibold">Loading entertainment suggestions in {selectedLanguage}...</p>
                  </div>
                ) : entertainmentSuggestions && selectedLanguage ? (
                  <div className="space-y-8">
                    <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl p-5 shadow-lg">
                      <p className="text-purple-900 font-bold text-center text-lg">
                        Showing recommendations in <span className="text-2xl">{selectedLanguage}</span>
                      </p>
                    </div>
                    {/* Movies Section */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="bg-purple-600 p-2 rounded-lg">
                          <Film className="w-6 h-6 text-white" />
                        </div>
                        Movies
                      </h3>
                      <div className="grid md:grid-cols-1 gap-5">
                        {entertainmentSuggestions.movies.map((movie, index) => (
                          <div
                            key={index}
                            className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 hover:shadow-xl transition-all shadow-lg hover:scale-[1.02]"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{movie.title}</h4>
                                {movie.year && (
                                  <p className="text-sm text-gray-700 font-medium">{movie.year}</p>
                                )}
                              </div>
                              {movie.rating && (
                                                                <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold shadow-md">
                                  {movie.rating}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-800 leading-relaxed font-medium">{movie.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Songs Section */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="bg-purple-600 p-2 rounded-lg">
                          <Music className="w-6 h-6 text-white" />
                        </div>
                        Songs
                      </h3>
                      <div className="grid md:grid-cols-1 gap-5">
                        {entertainmentSuggestions.songs.map((song, index) => (
                          <div
                            key={index}
                            className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 hover:shadow-xl transition-all shadow-lg hover:scale-[1.02]"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{song.title}</h4>
                                {song.artist && (
                                  <p className="text-sm text-gray-700 font-bold">{song.artist}</p>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-800 leading-relaxed font-medium">{song.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : selectedLanguage ? (
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-8 shadow-lg">
                    <p className="text-gray-700 text-center font-semibold text-lg">Entertainment suggestions are not available at this time. Please try again later.</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8 shadow-lg">
                    <p className="text-blue-900 text-center font-bold text-lg">Please select a language above to view entertainment suggestions.</p>
                  </div>
                )}
              </div>
            )}

            {assessment.score < 4 && (
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-7 h-7 text-red-600" />
                    Important: Please Seek Professional Support
                  </h3>
                  <p className="text-red-900 mb-6 text-lg leading-relaxed font-semibold">
                    Based on your assessment, we strongly recommend speaking with a mental health professional.
                    Your college counselor is available to provide confidential support.
                  </p>
                  <div className="bg-white/80 p-5 rounded-xl border-2 border-red-200 shadow-md">
                    <p className="font-bold text-gray-900 text-lg">College Counseling Services</p>
                    <p className="text-gray-700 text-base mt-2 font-medium">
                      Contact information will be provided by your institution
                    </p>
                  </div>
                </div>
              </div>
            )}

            {assessment.score >= 8 && (
              <div className="border-t-2 border-gray-200 pt-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  Share Your Happiness Secret
                </h2>

                {secretSubmitted || assessment.happiness_secret ? (
                  <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 shadow-xl">
                    <p className="text-green-900 font-bold text-xl mb-4">
                      Thank you for sharing your wisdom!
                    </p>
                    <div className="bg-white/90 p-6 rounded-xl border-2 border-green-200 shadow-lg mb-4">
                      <p className="text-gray-800 italic text-lg font-medium">
                        "{assessment.happiness_secret || happinessSecret}"
                      </p>
                    </div>
                    <p className="text-green-800 text-base mt-3 font-semibold">
                      Your positive insights can inspire others on their wellness journey.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 shadow-xl">
                    <p className="text-green-900 mb-6 text-lg font-semibold">
                      You're doing great! Share what contributes to your happy and healthy lifestyle to inspire others.
                    </p>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={happinessSecret}
                        onChange={(e) => setHappinessSecret(e.target.value)}
                        placeholder="What's your secret to happiness?"
                        className="flex-1 px-5 py-4 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-400 outline-none font-medium text-lg bg-white/90"
                        maxLength={200}
                      />
                      <button
                        onClick={handleSubmitSecret}
                        disabled={!happinessSecret.trim() || submittingSecret}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                      >
                        {submittingSecret ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sharing...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
