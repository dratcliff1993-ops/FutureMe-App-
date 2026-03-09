'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  message?: string;
  mood?: 'encouraging' | 'thoughtful' | 'celebrating' | 'supportive';
  isVisible?: boolean;
}

export default function FutureSelfAvatar({
  message,
  mood = 'supportive',
  isVisible = true,
}: AvatarProps) {
  const moodStyles = {
    encouraging: {
      bgGradient: 'from-blue-400 to-cyan-500',
      borderColor: 'border-blue-300',
    },
    thoughtful: {
      bgGradient: 'from-purple-400 to-indigo-500',
      borderColor: 'border-purple-300',
    },
    celebrating: {
      bgGradient: 'from-green-400 to-emerald-500',
      borderColor: 'border-green-300',
    },
    supportive: {
      bgGradient: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-300',
    },
  };

  const style = moodStyles[mood];

  if (!isVisible || !message) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="absolute -top-20 right-0 z-40"
    >
      {/* Speech Bubble */}
      <div className={`bg-white/95 backdrop-blur-sm ${style.borderColor} border-2 rounded-2xl p-4 max-w-xs shadow-xl`}>
        <p className="text-gray-800 font-medium text-sm leading-relaxed">{message}</p>
        <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-0 border-t-8 border-l-transparent border-t-white/95"></div>
      </div>

      {/* Avatar Circle */}
      <div className={`mt-4 w-16 h-16 rounded-full bg-gradient-to-br ${style.bgGradient} ${style.borderColor} border-2 flex items-center justify-center mx-auto shadow-lg`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="text-2xl"
        >
          ✨
        </motion.div>
      </div>
    </motion.div>
  );
}
