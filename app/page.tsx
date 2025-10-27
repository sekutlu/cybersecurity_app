'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, BookOpen, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn cybersecurity fundamentals through engaging, easy-to-understand lessons.',
    },
    {
      icon: Award,
      title: 'Test Your Knowledge',
      description: 'Take quizzes to assess your understanding and earn badges for achievements.',
    },
    {
      icon: Users,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and insights.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Shield className="h-24 w-24 text-green-400" />
              </motion.div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6">
              Cybersecurity Awareness Quiz App
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Master the essentials of cybersecurity through interactive lessons and quizzes.
              Protect yourself and your organization from digital threats by building strong security awareness.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="bg-green-400 hover:bg-green-500 text-slate-900 text-lg px-8 py-6 font-semibold">
                  Start Learning
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-green-400 text-green-400 hover:bg-green-400/10">
                  Join Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Why Choose CyberSecure?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700 hover:border-green-400/50"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                      <feature.icon className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-slate-800 text-white py-16 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Cyber Awareness?</h2>
            <p className="text-xl mb-8 text-slate-300">
              Join thousands learning to protect themselves online
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-green-400 hover:bg-green-500 text-slate-900 font-semibold text-lg px-8 py-6">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}