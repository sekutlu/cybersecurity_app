'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertTriangle, Users, Shield, Globe, Smartphone, LucideIcon, Clock, User, CheckCircle, PlayCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  lock: Lock,
  'alert-triangle': AlertTriangle,
  users: Users,
  shield: Shield,
  globe: Globe,
  smartphone: Smartphone,
};

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  index: number;
  duration?: number;
  tutor?: string;
  progress?: 'not-started' | 'started' | 'completed';
}

export default function LessonCard({ id, title, description, icon, index, duration, tutor, progress = 'not-started' }: LessonCardProps) {
  const Icon = iconMap[icon] || Shield;
  
  const getProgressIcon = () => {
    switch (progress) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'started': return <PlayCircle className="h-5 w-5 text-yellow-400" />;
      default: return <Circle className="h-5 w-5 text-slate-500" />;
    }
  };
  
  const getProgressText = () => {
    switch (progress) {
      case 'completed': return 'Completed';
      case 'started': return 'Continue Learning';
      default: return 'Enroll in Lesson';
    }
  };
  
  const getProgressColor = () => {
    switch (progress) {
      case 'completed': return 'bg-green-400 hover:bg-green-500';
      case 'started': return 'bg-yellow-400 hover:bg-yellow-500';
      default: return 'bg-green-400 hover:bg-green-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-xl transition-all duration-300 h-full bg-slate-800 border-slate-700 hover:border-green-400/50 ${progress === 'completed' ? 'ring-1 ring-green-400/30' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-400/10 rounded-lg border border-green-400/20">
                <Icon className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-xl text-white">{title}</CardTitle>
            </div>
            {getProgressIcon()}
          </div>
          <CardDescription className="text-base text-slate-400 mb-3">{description}</CardDescription>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {tutor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{tutor}</span>
              </div>
            )}
            {duration && duration > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{duration} min</span>
              </div>
            )}
          </div>
          
          {progress === 'completed' && (
            <Badge className="mt-2 bg-green-400/10 text-green-400 border-green-400/20">
              ✓ Completed
            </Badge>
          )}
          {progress === 'started' && (
            <Badge className="mt-2 bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
              ⏸ In Progress
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {progress === 'not-started' ? (
            <Button 
              onClick={() => {
                // Enroll in lesson
                const userId = localStorage.getItem('userId');
                const progressData = JSON.parse(localStorage.getItem('lessonProgress') || '[]');
                progressData.push({
                  userId,
                  lessonId: id,
                  status: 'enrolled',
                  enrolledAt: new Date().toISOString()
                });
                localStorage.setItem('lessonProgress', JSON.stringify(progressData));
                window.location.href = `/lessons/${id}`;
              }}
              className="w-full bg-green-400 hover:bg-green-500 text-slate-900 font-semibold"
            >
              {getProgressText()}
            </Button>
          ) : (
            <Link href={`/lessons/${id}`}>
              <Button className={`w-full ${getProgressColor()} text-slate-900 font-semibold`}>
                {getProgressText()}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
