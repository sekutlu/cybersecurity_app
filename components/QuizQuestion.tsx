'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
  questionNumber: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  userAnswer?: string;
  isAnswered: boolean;
}

export default function QuizQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  onNext,
  onPrevious,
  questionNumber,
  totalQuestions,
  canGoNext,
  canGoPrevious,
  userAnswer,
  isAnswered,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(userAnswer || null);
  const [showFeedback, setShowFeedback] = useState(isAnswered);
  const [hasSubmitted, setHasSubmitted] = useState(isAnswered);

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (hasSubmitted) {
      const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      onAnswer(answer, isCorrect);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || hasSubmitted) return;
    setShowFeedback(true);
    setHasSubmitted(true);
    const isCorrect = selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    onAnswer(selectedAnswer, isCorrect);
  };

  const isCorrect = selectedAnswer?.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="text-sm text-slate-400 mb-2">
            Question {questionNumber} of {totalQuestions}
          </div>
          <CardTitle className="text-xl text-white">{question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                onClick={() => handleSelectAnswer(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all text-white ${
                  selectedAnswer === option
                    ? showFeedback
                      ? option.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
                        ? 'border-green-400 bg-green-400/10'
                        : 'border-red-400 bg-red-400/10'
                      : 'border-green-400 bg-green-400/10'
                    : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                } ${showFeedback && option.trim().toLowerCase() === correctAnswer.trim().toLowerCase() ? 'border-green-400 bg-green-400/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showFeedback && option.trim().toLowerCase() === correctAnswer.trim().toLowerCase() && (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  )}
                  {showFeedback && selectedAnswer === option && option.trim().toLowerCase() !== correctAnswer.trim().toLowerCase() && (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-400/10 border border-green-400/20' : 'bg-red-400/10 border border-red-400/20'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">{explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {!hasSubmitted && selectedAnswer && (
              <div className="p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
                <p className="text-blue-400 text-sm font-medium">
                  💡 Selected: {selectedAnswer}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Click "Submit Answer" to confirm your choice
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              {canGoPrevious && (
                <Button
                  onClick={onPrevious}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
              
              {!hasSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-green-400 hover:bg-green-500 text-slate-900 font-semibold disabled:opacity-50"
                >
                  Submit Answer
                </Button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <Button
                    onClick={() => {
                      setHasSubmitted(false);
                      setShowFeedback(false);
                    }}
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Change Answer
                  </Button>
                  <Button
                    onClick={onNext}
                    className="flex-1 bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
                  >
                    {canGoNext ? 'Next Question' : 'Continue'}
                    {canGoNext && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
