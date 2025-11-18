import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mentalHealthQuestions, calculateScore } from '../data/questions';
import { supabase } from '../lib/supabase';
import { ClipboardList, ChevronRight, ChevronLeft, CheckCircle, ArrowLeft, Brain } from 'lucide-react';

interface AssessmentProps {
  onComplete: (assessmentId: string) => void;
  onBack: () => void;
}

export default function Assessment({ onComplete, onBack }: AssessmentProps) {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const isAnswered = answers[mentalHealthQuestions[currentQuestion].id] !== undefined;
  const progress = (Object.keys(answers).length / mentalHealthQuestions.length) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < mentalHealthQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== mentalHealthQuestions.length) {
      return;
    }

    setLoading(true);

    try {
      const score = calculateScore(answers);

      const { data, error } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: user!.id,
            score,
            answers,
            recommendations: '',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onComplete(data.id);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setLoading(false);
    }
  };

  const question = mentalHealthQuestions[currentQuestion];

  return (
    <div className="min-h-screen relative overflow-hidden p-4" style={{ backgroundColor: '#f0f9ff' }}>
      {/* Floating Brain Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Brain className="absolute top-20 right-20 w-32 h-32 opacity-10 text-blue-600 floating-brain" />
        <Brain className="absolute bottom-32 left-16 w-28 h-28 opacity-10 text-purple-600 floating-brain-fast" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Mental Health Assessment</h1>
                  <p className="text-white/90 text-lg font-medium mt-1">Question {currentQuestion + 1} of {mentalHealthQuestions.length}</p>
                </div>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3 shadow-inner">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8 bg-white">
            <div className="space-y-3">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-md">
                {question.category}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                {question.question}
              </h2>
            </div>

            <div className="space-y-4">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all shadow-md ${
                    answers[question.id] === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-bold text-lg">{option.text}</span>
                    {answers[question.id] === option.value && (
                      <CheckCircle className="w-7 h-7 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {currentQuestion < mentalHealthQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next Question
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== mentalHealthQuestions.length || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Analyzing...' : 'Complete Assessment'}
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-lg">
          <p className="text-sm text-gray-800 font-semibold leading-relaxed">
            <strong className="text-blue-700">Note:</strong> This assessment is based on standardized screening tools used by mental health professionals.
            Your responses are confidential and will help provide personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
