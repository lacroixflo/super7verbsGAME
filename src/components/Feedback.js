import React from 'react';
import { Check, Volume2 } from './Icons';

export const Feedback = ({ type }) => {
  if (type === 'correct') {
    return (
      <div className="bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Check size={40} className="text-green-500" />
          <span className="text-3xl font-bold text-green-700">Excellent!</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Volume2 size={20} className="text-green-600" />
          <span className="text-base text-green-600">Playing correct answer...</span>
        </div>
      </div>
    );
  }
  return null;
};
