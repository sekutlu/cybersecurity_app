'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertTriangle, Users, Shield, Globe, Smartphone, ArrowLeft, LucideIcon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import YouTubePlayer from '@/components/YouTubePlayer';

const iconMap: Record<string, LucideIcon> = {
  lock: Lock,
  'alert-triangle': AlertTriangle,
  users: Users,
  shield: Shield,
  globe: Globe,
  smartphone: Smartphone,
};

interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  youtubeId?: string;
  videoUrl?: string;
  duration?: number;
  tutor?: string;
  category: string;
  difficulty: string;
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setLesson(data);
          
          // Check progress and enrollment
          const userId = localStorage.getItem('userId');
          const progress = localStorage.getItem('lessonProgress');
          if (progress) {
            const progressData = JSON.parse(progress);
            const lessonProgress = progressData.find((p: any) => p.lessonId === params.id && p.userId === userId);
            if (lessonProgress) {
              setIsEnrolled(['enrolled', 'started', 'completed'].includes(lessonProgress.status));
              setIsStarted(['started', 'completed'].includes(lessonProgress.status));
              setIsCompleted(lessonProgress.status === 'completed');
              setVideoCompleted(lessonProgress.videoCompleted || false);
              
              // Mark as started if enrolled but not started yet
              if (lessonProgress.status === 'enrolled') {
                markLessonAsStarted(params.id as string);
              }
            } else {
              // Not enrolled, redirect back
              setIsEnrolled(false);
            }
          }
          
          // Fetch quizzes for this lesson
          const quizzesResponse = await fetch(`/api/quizzes?lessonId=${params.id}`);
          if (quizzesResponse.ok) {
            const quizzesData = await quizzesResponse.json();
            setQuizzes(quizzesData);
          }
        } else {
          setLesson(null);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params.id, isAuthenticated, authLoading]);
  
  const markLessonAsStarted = (lessonId: string) => {
    const userId = localStorage.getItem('userId');
    const progress = localStorage.getItem('lessonProgress');
    let progressData = progress ? JSON.parse(progress) : [];
    
    const existingIndex = progressData.findIndex((p: any) => p.lessonId === lessonId && p.userId === userId);
    if (existingIndex >= 0) {
      progressData[existingIndex] = {
        ...progressData[existingIndex],
        status: 'started',
        startedAt: new Date().toISOString()
      };
    } else {
      progressData.push({
        userId,
        lessonId,
        status: 'started',
        startedAt: new Date().toISOString()
      });
    }
    localStorage.setItem('lessonProgress', JSON.stringify(progressData));
    setIsStarted(true);
  };
  
  const handleVideoComplete = () => {
    const userId = localStorage.getItem('userId');
    const progress = localStorage.getItem('lessonProgress');
    let progressData = progress ? JSON.parse(progress) : [];
    
    const existingIndex = progressData.findIndex((p: any) => p.lessonId === params.id && p.userId === userId);
    if (existingIndex >= 0) {
      progressData[existingIndex] = {
        ...progressData[existingIndex],
        status: 'completed',
        videoCompleted: true,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('lessonProgress', JSON.stringify(progressData));
      setVideoCompleted(true);
      setIsCompleted(true);
      markLessonAsCompleted(params.id as string);
    }
  };
  
  const markLessonAsCompleted = async (lessonId: string) => {
    const userId = localStorage.getItem('userId');
    const progress = localStorage.getItem('lessonProgress');
    let progressData = progress ? JSON.parse(progress) : [];
    
    const existingIndex = progressData.findIndex((p: any) => p.lessonId === lessonId && p.userId === userId);
    if (existingIndex >= 0) {
      progressData[existingIndex] = {
        ...progressData[existingIndex],
        status: 'completed',
        completedAt: new Date().toISOString()
      };
    } else {
      progressData.push({
        userId,
        lessonId,
        status: 'completed',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('lessonProgress', JSON.stringify(progressData));
    setIsCompleted(true);
    
    // Try to save to database
    if (userId) {
      try {
        await fetch('/api/user/lesson-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId, 
            lessonId, 
            status: 'completed',
            completedAt: new Date().toISOString()
          }),
        });
      } catch (error) {
        console.error('Failed to save progress to database:', error);
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!lesson) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lesson not found</h1>
          <Button onClick={() => router.push('/lessons')} className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">Back to Lessons</Button>
        </div>
      </div>
    );
  }
  
  // Check if user is enrolled
  if (!isEnrolled) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">Enrollment Required</h1>
          <p className="text-slate-400 mb-6">You need to enroll in this lesson before accessing the content.</p>
          <Button onClick={() => router.push('/lessons')} className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold">
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[lesson.icon] || Shield;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/lessons')}
            className="mb-6 text-slate-400 hover:text-green-400 hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>

          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/20">
                  <Icon className="h-10 w-10 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-white">{lesson.title}</CardTitle>
                  <p className="text-slate-400 mt-2">{lesson.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm">
                    {lesson.tutor && (
                      <span className="text-green-400">By {lesson.tutor}</span>
                    )}
                    {lesson.duration && lesson.duration > 0 && (
                      <span className="text-slate-400">⏱️ {lesson.duration} minutes</span>
                    )}
                    <span className="text-slate-400 capitalize">{lesson.difficulty}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.youtubeId && (
                <div className="mb-6">
                  <YouTubePlayer 
                    videoId={lesson.youtubeId} 
                    title={lesson.title}
                    onVideoComplete={handleVideoComplete}
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                  {lesson.content}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-700 space-y-4">
                {isCompleted ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-lg text-green-400 font-semibold">
                      ✓ Lesson Completed
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-lg text-yellow-400 font-semibold">
                        📹 Watch the video or mark as completed manually
                      </div>
                    </div>
                    <Button
                      onClick={() => markLessonAsCompleted(lesson._id)}
                      className="w-full bg-blue-400 hover:bg-blue-500 text-slate-900 font-semibold"
                      size="lg"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                )}
                
                {quizzes.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-3">Available Quizzes:</h3>
                    {quizzes.map((quiz: any) => (
                      <Button
                        key={quiz._id}
                        onClick={() => router.push(`/quiz?lesson=${lesson._id}&quiz=${quiz._id}`)}
                        className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold justify-between"
                        size="lg"
                      >
                        <span>{quiz.title}</span>
                        <span className="text-xs opacity-75">{quiz.questions?.length || 0} questions</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-400">No quizzes available for this lesson yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
