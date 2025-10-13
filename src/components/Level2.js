import React, { useState, useEffect } from "react";
import { verbs } from "../data/verbs";
import { useSpeech } from "../hooks/useSpeech";
import { Check, X, RotateCcw, Star, Volume2 } from "./Icons";
import { Feedback } from "./Feedback";

const pronouns = [
  { text: "je", translation: "I", emoji: "👤" },
  { text: "il", translation: "he", emoji: "👨" },
  { text: "elle", translation: "she", emoji: "👩" },
  { text: "ils", translation: "they (masc)", emoji: "👨‍👨‍👦" },
  { text: "elles", translation: "they (fem)", emoji: "👩‍👩‍👧" },
];

const Level2 = ({ onExit, onComplete }) => {
  const { speak } = useSpeech();

  const [sentenceTemplates, setSentenceTemplates] = useState({});
  const [conjugations, setConjugations] = useState({});
  const [currentVerb, setCurrentVerb] = useState("");
  const [currentPronoun, setCurrentPronoun] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [sentence, setSentence] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [correction, setCorrection] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  useEffect(() => {
    import("../data/verbs").then((mod) => {
      if (mod.sentenceTemplates) setSentenceTemplates(mod.sentenceTemplates);
      if (mod.conjugations) setConjugations(mod.conjugations);
    });
  }, []);

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
    setQuestionType(qType);
    setSentence(sentenceTemplates[verbs[randomVerb].infinitive][randomPronoun.text]);
    setUserAnswer("");
    setFeedback("");
    setShowAnswer(false);
    setCorrection("");
    setHasPlayedAudio(false);
  };

  useEffect(() => {
    if (Object.keys(sentenceTemplates).length > 0) generateQuestion();
  }, [sentenceTemplates]);

  const checkAnswer = () => {
    let correct;
    if (questionType === "conjugation") {
      correct = applyElision(currentPronoun, conjugations[currentVerb][currentPronoun].form);
    } else if (questionType === "translate-to-french") correct = sentence.fr;
    else correct = sentence.en;

    setTotal((t) => t + 1);
    if (userAnswer.trim().toLowerCase() === correct.toLowerCase()) {
      setScore((s) => s + 1);
      setFeedback("correct");
      speak(sentence.fr).then(() => setHasPlayedAudio(true));
if (score + 1 >= 20) {
  setFeedback("win");
  setTimeout(() => onComplete?.(), 2000);
}
      else setTimeout(generateQuestion, 2000);
    } else {
      setFeedback("incorrect");
      setShowAnswer(true);
    }
  };

  const checkCorrection = () => {
    let correct;
    if (questionType === "conjugation")
      correct = applyElision(currentPronoun, conjugations[currentVerb][currentPronoun].form);
    else if (questionType === "translate-to-french") correct = sentence.fr;
    else correct = sentence.en;

    if (correction.trim().toLowerCase() === correct.toLowerCase()) {
      setFeedback("corrected");
      speak(sentence.fr).then(() => setHasPlayedAudio(true));
      setTimeout(generateQuestion, 2000);
    } else setCorrection("");
  };

  if (feedback === "win")
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50 text-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-5xl font-bold text-purple-600 mb-4">Bravo!</h1>
        <p className="text-2xl text-gray-700 mb-8">
          You mastered all 20 questions! 🏆
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              setScore(0);
              setTotal(0);
              setFeedback("");
              generateQuestion();
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition"
          >
            Play Again 🔄
          </button>
          <button
            onClick={onComplete}
            className="bg-orange-500 text-white text-xl font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition"
          >
            Continue to Level 3 ⚡
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center text-purple-700 font-bold text-xl">
            <Star className="text-yellow-500 fill-yellow-500" /> Score: {score}/20
            <span className="text-gray-600 text-base">({total} total)</span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            <RotateCcw size={16} /> Menu
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white text-center mb-6">
          {questionType === "conjugation" && (
            <>
              <p className="text-lg mb-2">Conjugate the verb:</p>
              <p className="text-4xl font-bold">{currentVerb}</p>
              <p className="text-lg opacity-90 mb-2">
                with {currentPronoun} ({pronouns.find((p) => p.text === currentPronoun)?.translation})
              </p>
              <p className="text-sm bg-white/20 inline-block py-1 px-3 rounded-lg mt-2">
                Write pronoun + verb
              </p>
            </>
          )}
          {questionType === "translate-to-french" && (
            <>
              <div className="text-5xl mb-3">🇬🇧 ➡️ 🇫🇷</div>
              <p className="text-xl mb-2">Translate to French:</p>
              <p className="text-3xl font-bold">{sentence.en}</p>
            </>
          )}
          {questionType === "translate-to-english" && (
  <>
    <div className="text-5xl mb-3">🇫🇷 ➡️ 🇬🇧</div>
    <p className="text-xl mb-2">Translate to English:</p>
    <p className="text-3xl font-bold">{sentence.fr}</p>
    {sentence.gender && (
      <p className="text-lg mt-3 bg-yellow-400/30 rounded-lg py-2 px-3 inline-block">
        ({sentence.gender === 'masculine' ? '👨 masculine' : '👩 feminine'})
      </p>
    )}
  </>
)}
        </div>

        {!showAnswer && feedback === "" && (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="Type your answer..."
              className="w-full text-2xl text-center border-4 border-purple-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full bg-green-500 text-white text-2xl font-bold py-3 rounded-xl hover:bg-green-600 transition disabled:bg-gray-300"
            >
              Check Answer
            </button>
          </>
        )}

        {feedback === "correct" && <Feedback type="correct" />}
        {feedback === "incorrect" && (
          <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4 text-center">
            <X className="text-red-500 mx-auto mb-2" size={40} />
            <p className="text-xl font-bold text-red-700 mb-2">Not quite...</p>
            <p className="text-lg text-gray-700 mb-3">
              Correct answer:{" "}
              <span className="text-purple-700 font-bold">
                {questionType === "conjugation"
                  ? applyElision(currentPronoun, conjugations[currentVerb][currentPronoun].form)
                  : questionType === "translate-to-french"
                  ? sentence.fr
                  : sentence.en}
              </span>
            </p>
            {!hasPlayedAudio && (
              <button
                onClick={() => speak(sentence.fr).then(() => setHasPlayedAudio(true))}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2 mx-auto"
              >
                <Volume2 size={20} /> Listen
              </button>
            )}
            <div className="mt-4">
              <input
                type="text"
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkCorrection()}
                placeholder="Try again..."
                className="w-full text-xl text-center p-2 border-2 border-purple-300 rounded-lg mb-3"
              />
              <button
                onClick={checkCorrection}
                disabled={!correction.trim()}
                className="w-full bg-purple-500 text-white text-xl py-2 rounded-lg hover:bg-purple-600 transition disabled:bg-gray-300"
              >
                Submit Correction
              </button>
            </div>
          </div>
        )}
        {feedback === "corrected" && <Feedback type="correct" />}
      </div>
    </div>
  );
};

export default Level2;
