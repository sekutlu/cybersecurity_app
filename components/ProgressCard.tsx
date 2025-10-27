'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressCardProps {
  title: string;
  value: string | number;
  icon: 'trophy' | 'target' | 'award';
  index: number;
}

const iconMap = {
  trophy: Trophy,
  target: Target,
  award: Award,
};

export default function ProgressCard({ title, value, icon, index }: ProgressCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
          <Icon className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
