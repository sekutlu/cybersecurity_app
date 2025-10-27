'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function AdminQuizzesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    lessonId: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
        },
      ],
    });
  };
  
  const addQuestionToExisting = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addQuestion',
          question: {
            question: 'New question',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: 'Option 1',
            explanation: 'Explanation for the answer',
          }
        }),
      });
      
      if (response.ok) {
        fetchQuizzes();
        alert('Question added successfully! You can edit it by clicking the edit button.');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const startEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      lessonId: quiz.lessonId,
      questions: quiz.questions || [],
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/quizzes/${editingQuiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateQuiz',
          ...formData
        }),
      });

      if (response.ok) {
        setShowEditForm(false);
        setEditingQuiz(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          difficulty: 'beginner',
          lessonId: '',
          questions: [
            {
              question: '',
              options: ['', '', '', ''],
              correctAnswer: '',
              explanation: '',
            },
          ],
        });
        fetchQuizzes();
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          difficulty: 'beginner',
          lessonId: '',
          questions: [
            {
              question: '',
              options: ['', '', '', ''],
              correctAnswer: '',
              explanation: '',
            },
          ],
        });
        fetchQuizzes();
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const [quizzesRes, lessonsRes] = await Promise.all([
        fetch('/api/quizzes'),
        fetch('/api/lessons')
      ]);
      
      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json();
        setQuizzes(quizzesData);
      }
      
      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-slate-400 hover:text-green-400 hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Quizzes</h1>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Quiz
          </Button>
        </div>

        {(showForm || showEditForm) && (
          <Card className="mb-8 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{showEditForm ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={showEditForm ? handleEditSubmit : handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white">Associated Lesson</Label>
                    <select
                      value={formData.lessonId}
                      onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select a lesson</option>
                      {lessons.map((lesson: any) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Questions</h3>
                    <Button type="button" onClick={addQuestion} variant="outline" className="border-slate-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {formData.questions.map((question: any, qIndex: number) => (
                    <Card key={qIndex} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-white text-lg">Question {qIndex + 1}</CardTitle>
                          {formData.questions.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-white">Question</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {question.options.map((option: string, oIndex: number) => (
                            <div key={oIndex}>
                              <Label className="text-white">Option {oIndex + 1}</Label>
                              <Input
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="bg-slate-600 border-slate-500 text-white"
                                required
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <Label className="text-white">Correct Answer</Label>
                          <Input
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            placeholder="Enter the exact correct answer"
                            required
                          />
                        </div>

                        <div>
                          <Label className="text-white">Explanation</Label>
                          <Textarea
                            value={question.explanation}
                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                            className="bg-slate-600 border-slate-500 text-white"
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
                    {showEditForm ? 'Update Quiz' : 'Create Quiz'}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                      setShowEditForm(false);
                      setEditingQuiz(null);
                      setFormData({
                        title: '',
                        description: '',
                        category: '',
                        difficulty: 'beginner',
                        lessonId: '',
                        questions: [
                          {
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: '',
                            explanation: '',
                          },
                        ],
                      });
                    }} 
                    variant="outline" 
                    className="border-slate-600 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz: any) => (
            <Card key={quiz._id} className="bg-slate-800 border-slate-700 hover:border-green-400/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-white text-lg">{quiz.title}</CardTitle>
                <p className="text-slate-400 text-sm">{quiz.category} • {quiz.difficulty}</p>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">{quiz.description}</p>
                <div className="flex items-center text-green-400 text-sm mb-4">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {quiz.questions?.length || 0} questions
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => addQuestionToExisting(quiz._id)}
                    className="bg-blue-400 hover:bg-blue-500 text-slate-900 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Question
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => startEditQuiz(quiz)}
                    variant="outline" 
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}