"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

interface Question {
  question: string;
  field: string;
  type: 'text' | 'number' | 'array';
}

interface APIResponse {
  success: boolean;
  question?: Question;
  error?: string;
}

const TOTAL_QUESTIONS = 10;

const CreateProfile = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async (questionIndex: number, previousAnswers: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/profile/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previousAnswers,
          questionIndex,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();

      if (!data.success || !data.question) {
        throw new Error(data.error || 'Failed to get question');
      }

      setCurrentQuestion(data.question);
      setCurrentQuestionIndex(questionIndex);
    } catch (error) {
      console.error('Error fetching question:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNext = async () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
      try {
        // 保存用户档案
        const response = await fetch('/api/profile/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            previousAnswers: newAnswers,
            questionIndex: -1, // 使用 -1 表示这是最终提交
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save profile');
        }

        router.push('/profile');
      } catch (error) {
        console.error('Error saving profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to save profile');
      }
      return;
    }

    await fetchQuestion(currentQuestionIndex + 1, newAnswers);
  };

  useEffect(() => {
    fetchQuestion(0, []);
  }, [fetchQuestion]);

  const renderError = () => {
    if (!error) return null;
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestion = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!currentQuestion) {
      return <div className="text-center text-gray-500">No question available</div>;
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h2>
        <div className="space-y-2">
          <input
            type={currentQuestion.type === 'number' ? 'number' : 'text'}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            placeholder="Enter your answer..."
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
              </span>
              <button
                onClick={handleNext}
                disabled={!currentAnswer.trim() || isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {currentQuestionIndex >= TOTAL_QUESTIONS - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Gift Profile</h1>
          {renderError()}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-600">{Math.round(((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
              ></div>
            </div>
          </div>
          {renderQuestion()}
        </div>
      </div>
    </main>
  );
};

export default dynamic(() => Promise.resolve(CreateProfile), {
  ssr: false
});
