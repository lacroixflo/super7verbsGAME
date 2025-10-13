import React, { useState, useEffect, useRef } from "react";
import { verbs } from "../data/verbs";
import { useSpeech } from "../hooks/useSpeech";
import { Check, X, RotateCcw, Star, Trophy } from "./Icons";
import Fireworks from "./Fireworks";

const pronouns = [
  { text: "je", translation: "I", emoji: "👤" },
  { text: "il", translation: "he", emoji: "👨" },
  { text: "elle", translation: "she", emoji: "👩" },
  { text: "ils", translation: "they (masc)", emoji: "👨‍👨‍👦" },
  { text: "elles", translation: "they (fem)", emoji: "👩‍👩‍👧" },
];

const Level3 = ({ onExit, onComplete }) => {
  const { speak } = useSpeech();

  const [sentenceTemplates, setSentenceTemplates] = useState({});
  const [conjugations, setConjugations] = useState({});
  const [currentVerb, setCurrentVerb] = useState("");
  const [currentPronoun, setCurrentPronoun] = useState("");
  const [currentPronounData, setCurrentPronounData] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [sentence, setSentence] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswering, setIsAnswering] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

useEffect(() => {
  import("../data/verbs").then((mod) => {
    if (mod.sentenceTemplates) setSentenceTemplates(mod.sentenceTemplates);
    if (mod.conjugations) setConjugations(mod.conjugations);
  });
}, []);

useEffect(() => {
  if (gameWon) {
    const timer = setTimeout(() => setShowButtons(true), 5000);
    return () => clearTimeout(timer);
  }
}, [gameWon]);

  const applyElision = (pronoun, form) => {
    if (["je", "me", "te", "le", "la"].includes(pronoun) && /^[aeiouh]/i.test(form))
      return pronoun.slice(0, -1) + "'" + form;
    return pronoun + " " + form;
  };

  const generateQuestion = () => {
    const verbsList = Object.keys(verbs);
    const randomVerb = verbsList[Math.floor(Math.random() * verbsList.length)];
    const randomPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const questionTypes = ["conjugation", "translate-to-french", "translate-to-english"];
    const qType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    setCurrentVerb(verbs[randomVerb].infinitive);
    setCurrentPronoun(randomPronoun.text);
    setCurrentPronounData(randomPronoun);
    setQuestionType(qType);
    setSentence(sentenceTemplates[verbs[randomVerb].infinitive][randomPronoun.text]);
    setUserAnswer("");
    setFeedback("");
    setIsAnswering(true);
    setTimeLeft(10);
    setQuestionStartTime(Date.now());

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (Object.keys(sentenceTemplates).length > 0) generateQuestion();
  }, [sentenceTemplates]);

  useEffect(() => {
    if (isAnswering && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isAnswering && timeLeft === 0) {
      handleTimeout();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isAnswering]);

  const handleTimeout = () => {
    setIsAnswering(false);
    setFeedback("timeout");
    setStreak(0);
    setTotal((t) => t + 1);
    
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setTotalTime((t) => t + timeTaken);

    setTimeout(() => {
      generateQuestion();
    }, 1000);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim() || !isAnswering) return;

    setIsAnswering(false);
    clearTimeout(timerRef.current);

    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setTotalTime((t) => t + timeTaken);

 let correct;
if (questionType === "conjugation") {
  correct = applyElision(currentPronoun, conjugations[currentVerb][currentPronoun].form);
} else if (questionType === "translate-to-french") {
  correct = sentence.fr;
} else {
  correct = sentence.en;
}

    setTotal((t) => t + 1);

    if (userAnswer.trim().toLowerCase() === correct.toLowerCase()) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setFeedback("correct");

      if (newScore >= 20) {
        setGameWon(true);
  if (onComplete) setTimeout(() => onComplete(), 5000); // 5 secondes pour voir les feux d'artifice
        return;
      }

      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      setFeedback("incorrect");
      setStreak(0);

      setTimeout(() => {
        generateQuestion();
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isAnswering) {
      checkAnswer();
    }
  };

  const getTimerColor = () => {
    if (timeLeft <= 3) return "text-red-600 bg-red-100";
    if (timeLeft <= 5) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getTimerBorderColor = () => {
    if (timeLeft <= 3) return "border-red-500";
    if (timeLeft <= 5) return "border-yellow-500";
    return "border-green-500";
  };

 if (gameWon) {
  const avgTime = total > 0 ? (totalTime / total).toFixed(1) : 0;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-red-50 text-center p-6 relative">
      <Fireworks />
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg relative z-10">
          <Trophy size={80} className="text-yellow-500 mx-auto mb-4" />
          <div className="text-6xl mb-4 animate-bounce">🔥</div>
          <h1 className="text-5xl font-bold text-orange-600 mb-4">Speed Champion!</h1>
<p className="text-2xl text-purple-600 mb-4 animate-pulse">🎆 Enjoy the fireworks! 🎆</p>

          <div className="space-y-3 mb-6">
            <p className="text-3xl font-bold text-gray-800">Score: {score}/20</p>
            <p className="text-2xl font-bold text-purple-600">Best Streak: {bestStreak} 🔥</p>
            <p className="text-xl text-gray-600">Average time: {avgTime}s per question</p>
          </div>
          <p className="text-xl text-gray-700 mb-8">
            You mastered the speed round! ⚡
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setScore(0);
                setTotal(0);
                setStreak(0);
                setBestStreak(0);
                setTotalTime(0);
                setGameWon(false);
                generateQuestion();
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition"
            >
              Play Again ⚡
            </button>
            <button
              onClick={onExit}
              className="bg-gray-500 text-white text-xl font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition"
            >
              Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center text-orange-700 font-bold text-xl">
              <Star className="text-yellow-500 fill-yellow-500" /> {score}/20
            </div>
            <div className="flex gap-2 items-center text-purple-700 font-bold text-lg">
              🔥 Streak: {streak}
            </div>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            <RotateCcw size={16} /> Menu
          </button>
        </div>

        {bestStreak > 0 && (
          <div className="text-center mb-4">
            <span className="text-sm text-purple-600 font-semibold">
              Best Streak: {bestStreak} 🏆
            </span>
          </div>
        )}

        <div className={`mb-6 text-center p-4 rounded-2xl border-4 ${getTimerBorderColor()} ${getTimerColor()} transition-all`}>
          <div className="text-5xl font-bold">{timeLeft}s</div>
          <div className="text-sm font-semibold mt-1">Time Remaining</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center mb-6">
  {questionType === "conjugation" && (
  <>
    <p className="text-3xl font-bold mb-3">⚡ CONJUGATE ⚡</p>
    <p className="text-5xl font-bold mb-3">{currentVerb}</p>
    <p className="text-2xl opacity-90 mb-2">
      with {currentPronoun} ({currentPronounData?.translation})
    </p>
    <p className="text-base bg-white/20 inline-block py-1 px-3 rounded-lg mt-2">
      Write pronoun + verb
    </p>
  </>
)}
          {questionType === "translate-to-french" && (
  <>
    <div className="text-5xl mb-3">🇬🇧 ➡️ 🇫🇷</div>
    <p className="text-3xl font-bold mb-3">⚡ TRANSLATE TO FRENCH ⚡</p>
    <p className="text-4xl font-bold">{sentence.en}</p>
              {sentence.gender && (
                <p className="text-lg mt-3 bg-yellow-400/30 rounded-lg py-2 px-3 inline-block">
                  ({sentence.gender === 'masculine' ? '👨 masculine' : '👩 feminine'})
                </p>
              )}
            </>
          )}
          {questionType === "translate-to-english" && (
  <>
    <div className="text-5xl mb-3">🇫🇷 ➡️ 🇬🇧</div>
    <p className="text-3xl font-bold mb-3">⚡ TRANSLATE TO ENGLISH ⚡</p>
    <p className="text-4xl font-bold">{sentence.fr}</p>
  </>
)}
        </div>

        {feedback === "" && isAnswering && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type fast..."
              className="w-full text-2xl text-center border-4 border-orange-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full bg-orange-500 text-white text-2xl font-bold py-3 rounded-xl hover:bg-orange-600 transition disabled:bg-gray-300"
            >
              Submit ⚡
            </button>
          </>
        )}

        {feedback === "correct" && (
          <div className="bg-green-100 border-4 border-green-500 rounded-xl p-4 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Check size={40} className="text-green-500" />
              <span className="text-2xl font-bold text-green-700">Correct! 🔥</span>
            </div>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <X size={40} className="text-red-500" />
              <span className="text-2xl font-bold text-red-700">Not quite!</span>
            </div>
          </div>
        )}

        {feedback === "timeout" && (
          <div className="bg-yellow-100 border-4 border-yellow-500 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">⏰ Too slow!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level3;