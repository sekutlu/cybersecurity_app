'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizQuestion from '@/components/QuizQuestion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  lessonId: string;
  passScore: number;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export default function QuizPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchQuiz = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonId = urlParams.get('lesson');
        const quizId = urlParams.get('quiz');
        
        if (!lessonId) {
          // Check if user has completed any lessons
          const progress = localStorage.getItem('lessonProgress');
          if (!progress) {
            alert('Please complete a lesson first before taking a quiz.');
            router.push('/lessons');
            return;
          }
          
          const progressData = JSON.parse(progress);
          const completedLessons = progressData.filter((p: any) => p.status === 'completed');
          
          if (completedLessons.length === 0) {
            alert('Please complete a lesson first before taking a quiz.');
            router.push('/lessons');
            return;
          }
        }
        
        let response;
        if (quizId) {
          response = await fetch(`/api/quizzes/${quizId}`);
        } else {
          response = await fetch(`/api/quizzes${lessonId ? `?lesson=${lessonId}` : ''}`);
        }
        
        let selectedQuiz;
        if (quizId) {
          selectedQuiz = await response.json();
        } else {
          const data = await response.json();
          selectedQuiz = data.length > 0 ? data[0] : null;
        }
        
        if (selectedQuiz) {
          setQuiz(selectedQuiz);
          setQuestions(selectedQuiz.questions || []);
          setStartTime(new Date());
        } else {
          alert('No quiz available for this lesson.');
          router.push('/lessons');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isAuthenticated, authLoading]);

  const handleAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    const newUserAnswers = { ...userAnswers, [currentQuestionIndex]: selectedAnswer };
    const newAnsweredQuestions = new Set(answeredQuestions).add(currentQuestionIndex);
    
    setUserAnswers(newUserAnswers);
    setAnsweredQuestions(newAnsweredQuestions);
    
    // Calculate score based on all answers
    let newScore = 0;
    questions.forEach((question, index) => {
      if (newUserAnswers[index]?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      saveProgress();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveProgress = async () => {
    const finalScore = Math.round((score / questions.length) * 100);
    const passScore = quiz?.passScore || 80;
    const passed = finalScore >= passScore;
    const userId = localStorage.getItem('userId');
    
    // Save to localStorage for immediate access
    const existingProgress = localStorage.getItem('quizProgress');
    const progress = existingProgress ? JSON.parse(existingProgress) : [];
    progress.push({
      userId,
      date: new Date().toISOString(),
      score: finalScore,
      totalQuestions: questions.length,
      passed,
      lessonId: quiz?.lessonId,
      quizId: quiz?._id
    });
    localStorage.setItem('quizProgress', JSON.stringify(progress));

    // Save to MongoDB if user is logged in
    if (userId) {
      try {
        await fetch('/api/user/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            score: finalScore,
            totalQuestions: questions.length,
            passed,
            lessonId: quiz?.lessonId,
            quizId: quiz?._id
          }),
        });
      } catch (error) {
        console.error('Failed to save progress to database:', error);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsComplete(false);
    setUserAnswers({});
    setAnsweredQuestions(new Set());
    setStartTime(new Date());
    setShowReview(false);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const finishQuiz = () => {
    setIsComplete(true);
    saveProgress();
  };

  const getTimeTaken = () => {
    if (!startTime) return 'N/A';
    const endTime = new Date();
    const timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getMotivationalMessage = () => {
    const percentage = (score / questions.length) * 100;
    const passScore = quiz?.passScore || 80;
    
    if (percentage === 100) return 'Perfect score! You\'re a cybersecurity expert!';
    if (percentage >= passScore) return `Congratulations! You passed with ${percentage}%!`;
    return `You need ${passScore}% to pass. Review the lesson and try again!`;
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Quiz Available</h2>
          <p className="text-slate-400">Complete a lesson first to unlock its quiz.</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passScore = quiz?.passScore || 80;
    const passed = percentage >= passScore;

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="text-center bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-400/10 rounded-full border border-green-400/20">
                  <Trophy className="h-16 w-16 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-3xl text-white">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className={`text-6xl font-bold mb-2 ${
                  passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {percentage}%
                </div>
                <p className="text-xl text-slate-300">
                  You scored {score} out of {questions.length}
                </p>
                <p className={`text-lg font-semibold ${
                  passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {passed ? '✓ PASSED' : '✗ FAILED'} (Pass mark: {passScore}%)
                </p>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Time taken: {getTimeTaken()}</p>
                  <p>Questions answered: {answeredQuestions.size}/{questions.length}</p>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                passed 
                  ? 'bg-green-400/10 border-green-400/20' 
                  : 'bg-red-400/10 border-red-400/20'
              }`}>
                <p className={`text-lg font-medium ${
                  passed ? 'text-green-400' : 'text-red-400'
                }`}>
                  {getMotivationalMessage()}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setShowReview(!showReview)}
                  variant="outline"
                  size="lg"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {showReview ? 'Hide' : 'Review'} Answers
                </Button>
                
                {showReview && (
                  <div className="max-h-60 overflow-y-auto space-y-2 p-4 bg-slate-700 rounded-lg">
                    {questions.map((question, index) => {
                      const userAnswer = userAnswers[index];
                      const isCorrect = userAnswer?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
                      return (
                        <div key={index} className="text-sm border-b border-slate-600 pb-2">
                          <p className="text-slate-300 font-medium">Q{index + 1}: {question.question}</p>
                          <p className={`${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            Your answer: {userAnswer || 'Not answered'}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-400">Correct: {question.correctAnswer}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    size="lg"
                    className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Take Quiz Again
                  </Button>
                  <Button
                    onClick={() => router.push('/lessons')}
                    size="lg"
                    className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
                  >
                    Back to Lessons
                  </Button>
                  <Button
                    onClick={() => router.push('/user/dashboard')}
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    View Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{quiz.title}</h1>
          <div className="flex justify-between items-center">
            <p className="text-xl text-slate-400">{quiz.description}</p>
            <div className="text-sm text-slate-900 bg-green-400 px-3 py-1 rounded-full font-semibold">
              Score: {score}/{currentQuestionIndex}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-400">
                    {answeredQuestions.size} of {questions.length} answered
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                          currentQuestionIndex === index
                            ? 'bg-green-400 text-slate-900'
                            : answeredQuestions.has(index)
                            ? 'bg-green-400/20 text-green-400 border border-green-400/40'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={finishQuiz}
                    className="w-full bg-blue-400 hover:bg-blue-500 text-slate-900 font-semibold"
                    disabled={answeredQuestions.size === 0}
                  >
                    Finish Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            {questions[currentQuestionIndex] && (
              <QuizQuestion
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                correctAnswer={questions[currentQuestionIndex].correctAnswer}
                explanation={questions[currentQuestionIndex].explanation}
                onAnswer={handleAnswer}
                onNext={nextQuestion}
                onPrevious={previousQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                canGoNext={currentQuestionIndex < questions.length - 1}
                canGoPrevious={currentQuestionIndex > 0}
                userAnswer={userAnswers[currentQuestionIndex]}
                isAnswered={answeredQuestions.has(currentQuestionIndex)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
