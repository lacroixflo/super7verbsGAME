import React, { useState, useEffect } from "react";
import { verbs } from "../data/verbs";
import { useSpeech } from "../hooks/useSpeech";
import { Check, X, RotateCcw, Star, Volume2, Trophy } from "./Icons";

const pronouns = [
  { text: "je", translation: "I", emoji: "👤" },
  { text: "il", translation: "he", emoji: "👨" },
  { text: "elle", translation: "she", emoji: "👩" },
  { text: "ils", translation: "they (masc)", emoji: "👨‍👨‍👦" },
  { text: "elles", translation: "they (fem)", emoji: "👩‍👩‍👧" },
];

// Helper: pick random item
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const Level1 = ({ onComplete, onExit }) => {
  const { speak } = useSpeech();

  const [sentenceTemplates, setSentenceTemplates] = useState({});
  const [sentence, setSentence] = useState(null);
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Load sentence templates dynamically from verbs.js
  useEffect(() => {
    import("../data/verbs").then((mod) => {
      if (mod.sentenceTemplates) setSentenceTemplates(mod.sentenceTemplates);
    });
  }, []);

  // Create a new question
  const generateQuestion = () => {
    const verbsList = Object.keys(verbs);
    const vKey = rand(verbsList);
    const p = rand(pronouns);
    const isFromFrench = Math.random() > 0.5;

    const sentenceData = sentenceTemplates[verbs[vKey].infinitive]?.[p.text];
    if (!sentenceData) return;

    const question = isFromFrench ? sentenceData.fr : sentenceData.en;
    const correctAnswer = isFromFrench ? sentenceData.en : sentenceData.fr;

    // Collect all possible answers for distractors
const allAnswers = Object.values(sentenceTemplates)
  .flatMap((v) => Object.values(v))
  .map((s) => (isFromFrench ? s.en : s.fr));

// Remove duplicates and the correct answer
const uniqueAnswers = [...new Set(allAnswers)].filter(a => a !== correctAnswer);

// Pick 2 random wrong answers
const shuffled = uniqueAnswers.sort(() => 0.5 - Math.random());
const wrongAnswers = shuffled.slice(0, 2);

// Combine and shuffle
const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

    setSentence({ ...sentenceData, question, isFromFrench });
    setMultipleChoiceOptions(options);
    setCorrectIndex(options.indexOf(correctAnswer));
    setSelected(null);
    setFeedback("");
  };

  // Start first question
  useEffect(() => {
    if (Object.keys(sentenceTemplates).length > 0) generateQuestion();
  }, [sentenceTemplates]);

  const checkAnswer = (index) => {
    setSelected(index);
    if (index === correctIndex) {
      setScore((s) => s + 1);
      setFeedback("correct");
      speak(sentence.fr);
      if (score + 1 >= 20) setTimeout(onComplete, 1500);
      else setTimeout(generateQuestion, 2000);
    } else {
      setMistakes((m) => m + 1);
      setFeedback("incorrect");
      speak(sentence.fr);
      if (mistakes + 1 >= 5) {
        setTimeout(() => {
          setScore(0);
          setMistakes(0);
          setFeedback("reset");
          setTimeout(generateQuestion, 3000);
        }, 2000);
      } else setTimeout(generateQuestion, 3000);
    }
  };

  if (score >= 20)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-lg">
          <Trophy className="text-yellow-500 mx-auto mb-4" size={80} />
          <h1 className="text-4xl font-bold text-green-600 mb-4">Level 1 Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">You unlocked Level 2 🎉</p>
          <button
            onClick={onComplete}
            className="bg-purple-500 text-white px-8 py-3 rounded-xl hover:bg-purple-600 font-bold text-lg"
          >
            Continue to Level 2
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-green-700 flex gap-2 items-center">
            <Star className="text-yellow-500 fill-yellow-500" /> Score: {score}/20
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition text-sm"
          >
            <RotateCcw size={16} /> Menu
          </button>
        </div>

        {sentence && (
          <>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white text-center mb-6">
              <div className="text-5xl mb-2">
                {sentence.isFromFrench ? "🇫🇷 ➡️ 🇬🇧" : "🇬🇧 ➡️ 🇫🇷"}
              </div>
              <p className="text-3xl font-bold mb-2">{sentence.question}</p>
              <div className="text-4xl">{verbs[sentence.fr.split(" ")[1]]?.emoji || "✨"}</div>
            </div>

            {multipleChoiceOptions.map((opt, i) => {
              let style = "w-full p-4 text-left rounded-xl border-2 mb-3 text-xl ";
              if (selected === null)
                style += "bg-gray-100 hover:bg-purple-100 hover:border-purple-300";
              else if (i === correctIndex)
                style += "bg-green-100 border-green-500 border-4 text-green-700";
              else if (i === selected)
                style += "bg-red-100 border-red-500 border-4 text-red-700";
              else style += "bg-gray-100 opacity-60";

              return (
                <button
                  key={i}
                  onClick={() => selected === null && checkAnswer(i)}
                  className={style}
                  disabled={selected !== null}
                >
                  <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {selected !== null && i === correctIndex && (
                      <Check className="text-green-500" />
                    )}
                    {selected !== null && i === selected && i !== correctIndex && (
                      <X className="text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </>
        )}

        {feedback && (
          <div className="mt-4 text-center text-xl font-bold">
            {feedback === "correct" && (
              <p className="text-green-600 flex justify-center gap-2 items-center">
                <Volume2 size={20} /> Excellent!
              </p>
            )}
            {feedback === "incorrect" && (
              <p className="text-red-600 flex justify-center gap-2 items-center">
                <Volume2 size={20} /> Not quite...
              </p>
            )}
            {feedback === "reset" && (
              <div className="bg-red-100 border-4 border-red-500 rounded-xl p-3 mt-4">
                <p className="text-red-700 text-2xl font-bold">😢 5 mistakes!</p>
                <p className="text-red-600">Score reset to 0... Keep trying!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Level1;
