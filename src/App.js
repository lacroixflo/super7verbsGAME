import React, { useState } from 'react';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import { verbs } from './data/verbs';
import { Check, ArrowRight } from './components/Icons';
import './App.css';

function App() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [level2Unlocked, setLevel2Unlocked] = useState(false);

  const startLevel1 = () => setCurrentLevel(1);
  const startLevel2 = () => setCurrentLevel(2);
  const reset = () => setCurrentLevel(null);
  const unlockLevel2 = () => {
    setLevel2Unlocked(true);
    setCurrentLevel(null);
  };

  if (currentLevel === 1) {
    return <Level1 onComplete={unlockLevel2} onExit={reset} />;
  }

  if (currentLevel === 2) {
    return <Level2 onExit={reset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <h1 className="text-6xl font-bold text-purple-600 mb-4">
            🇫🇷 Super 7 Verbs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Master the most important French verbs!
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={startLevel1}
              className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition text-left"
            >
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Level 1: Multiple Choice
              </h2>
              <p className="text-gray-600 mb-4">
                Choose the correct translation. Perfect for beginners!
              </p>
              <div className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition text-lg font-bold">
                Start Level 1
                <ArrowRight size={20} />
              </div>
            </button>

            <div className="relative">
              {!level2Unlocked && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-60 rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center text-white p-4">
                    <div className="text-5xl mb-2">🔒</div>
                    <p className="text-lg font-bold">Locked!</p>
                    <p className="text-sm">Complete Level 1 first</p>
                  </div>
                </div>
              )}
              <button
                onClick={startLevel2}
                disabled={!level2Unlocked}
                className={`bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition text-left w-full ${
                  !level2Unlocked ? 'opacity-50' : ''
                }`}
              >
                <div className="text-5xl mb-4">✏️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Level 2: Write & Translate
                </h2>
                <p className="text-gray-600 mb-4">
                  Type conjugations and translations. More challenging!
                </p>
                <div className={`flex items-center justify-center gap-2 ${
                  level2Unlocked ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'
                } text-white px-6 py-3 rounded-xl transition text-lg font-bold`}>
                  {level2Unlocked ? (
                    <>
                      Start Level 2
                      <ArrowRight size={20} />
                    </>
                  ) : (
                    'Locked'
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">📚 The Super 7 Verbs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(verbs).map(([key, info]) => (
                <div key={info.infinitive} className="bg-white rounded-lg p-3 flex flex-col items-center">
                  <span className="text-3xl mb-1">{info.emoji}</span>
                  <span className="font-bold text-purple-700 text-sm">{info.infinitive}</span>
                  <span className="text-xs text-gray-500">{info.translation}</span>
                </div>
              ))}
            </div>
            {level2Unlocked && (
              <div className="mt-4 text-center">
                <span className="text-green-600 font-semibold flex items-center justify-center gap-2">
                  <Check size={20} />
                  Level 2 Unlocked!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
