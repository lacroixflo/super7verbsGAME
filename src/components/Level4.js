import React, { useState, useEffect } from "react";
import { verbs } from "../data/verbs";
import { useSpeech } from "../hooks/useSpeech";
import { Check, X, RotateCcw, Star, Trophy, AlertCircle } from "./Icons";
import Fireworks from "./Fireworks";

const pronouns = [
  { text: "je", translation: "I", emoji: "👤" },
  { text: "il", translation: "he", emoji: "👨" },
  { text: "elle", translation: "she", emoji: "👩" },
  { text: "ils", translation: "they (masc)", emoji: "👨‍👨‍👦" },
  { text: "elles", translation: "they (fem)", emoji: "👩‍👩‍👧" },
];

const Level4 = ({ onExit }) => {
  const { speak } = useSpeech();

  const [sentenceTemplates, setSentenceTemplates] = useState({});
  const [conjugations, setConjugations] = useState({});
  const [incorrectSentence, setIncorrectSentence] = useState("");
  const [correctSentence, setCorrectSentence] = useState("");
  const [errorType, setErrorType] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [correctionAnswer, setCorrectionAnswer] = useState("");

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

  const generateWrongSentence = () => {
    const verbsList = Object.keys(verbs);
    const randomVerb = verbsList[Math.floor(Math.random() * verbsList.length)];
    const correctPronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    
    const errorTypes = ["wrong_verb_form", "missing_elision"];
    const chosenError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    setErrorType(chosenError);
    
    const correctForm = applyElision(
      correctPronoun.text,
      conjugations[verbs[randomVerb].infinitive][correctPronoun.text].form
    );
    
    setCorrectSentence(correctForm);
    
    let wrongSentence = "";
    
    switch (chosenError) {
      case "wrong_verb_form":
        let wrongPronounForVerb;
        
        if (correctPronoun.text === "ils" || correctPronoun.text === "elles") {
          wrongPronounForVerb = pronouns.filter(p => p.text === "il" || p.text === "elle")[
            Math.floor(Math.random() * 2)
          ];
        } else if (correctPronoun.text === "il" || correctPronoun.text === "elle") {
          wrongPronounForVerb = pronouns.filter(p => p.text === "ils" || p.text === "elles")[
            Math.floor(Math.random() * 2)
          ];
        } else {
          wrongPronounForVerb = pronouns.filter(p => p.text !== correctPronoun.text)[
            Math.floor(Math.random() * 4)
          ];
        }
        
        wrongSentence = correctPronoun.text + " " + 
          conjugations[verbs[randomVerb].infinitive][wrongPronounForVerb.text].form;
        break;
        
      case "missing_elision":
        if (correctPronoun.text === "je" && /^[aeiouh]/i.test(conjugations[verbs[randomVerb].infinitive]["je"].form)) {
          wrongSentence = "je " + conjugations[verbs[randomVerb].infinitive]["je"].form;
        } else {
          let fallbackWrong;
          if (correctPronoun.text === "ils" || correctPronoun.text === "elles") {
            fallbackWrong = pronouns.filter(p => p.text === "il" || p.text === "elle")[0];
          } else if (correctPronoun.text === "il" || correctPronoun.text === "elle") {
            fallbackWrong = pronouns.filter(p => p.text === "ils" || p.text === "elles")[0];
          } else {
            fallbackWrong = pronouns.filter(p => p.text !== correctPronoun.text)[0];
          }
          wrongSentence = correctPronoun.text + " " + 
            conjugations[verbs[randomVerb].infinitive][fallbackWrong.text].form;
          setErrorType("wrong_verb_form");
        }
        break;
        
      default:
        wrongSentence = correctForm;
    }
    
    setIncorrectSentence(wrongSentence);
    setUserAnswer("");
    setCorrectionAnswer("");
    setFeedback("");
    setShowHint(false);
  };

  useEffect(() => {
    if (Object.keys(sentenceTemplates).length > 0 && Object.keys(conjugations).length > 0) {
      generateWrongSentence();
    }
  }, [sentenceTemplates, conjugations]);

  const checkAnswer = () => {
    setTotal((t) => t + 1);
    
    if (userAnswer.trim().toLowerCase() === correctSentence.toLowerCase()) {
      setScore((s) => s + 1);
      setFeedback("correct");
      speak(correctSentence);
      
      if (score + 1 >= 20) {
        setFeedback("win");
      } else {
        setTimeout(generateWrongSentence, 2000);
      }
    } else {
      setFeedback("incorrect");
      setCorrectionAnswer("");
    }
  };

  const getHint = () => {
    const hints = {
      "wrong_verb_form": "💡 The verb is not conjugated correctly for this pronoun",
      "missing_elision": "💡 Don't forget the elision! (j', t', l'...)"
    };
    return hints[errorType] || "💡 There's an error somewhere...";
  };

  if (feedback === "win") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-center p-6 relative">
        <Fireworks />
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg relative z-10">
          <Trophy size={80} className="text-yellow-500 mx-auto mb-4" />
          <div className="text-6xl mb-4">🔍✨</div>
          <h1 className="text-5xl font-bold text-red-600 mb-4">Expert Correcteur!</h1>
          <p className="text-2xl text-purple-600 mb-4 animate-pulse">🎆 Enjoy the fireworks! 🎆</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">Score: {score}/20</p>
          <p className="text-xl text-gray-600 mb-2">Précision: {Math.round((score/total)*100)}%</p>
          <p className="text-xl text-gray-700 mb-8">
            You are a true grammar superhero! 🦸
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setScore(0);
                setTotal(0);
                setFeedback("");
                generateWrongSentence();
              }}
              className="bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xl font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-yellow-600 transition"
            >
              Rejouer 🔄
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center text-red-700 font-bold text-xl">
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

        <div className="bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl p-6 text-white text-center mb-6">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-2xl font-bold mb-3">Find and fix the error!</h2>
          <div className="bg-white/20 rounded-xl p-4 mb-4">
            <p className="text-3xl font-bold text-yellow-100">{incorrectSentence}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg">
            <AlertCircle size={20} />
            <span>Change the conjugation of the verb</span>
          </div>
        </div>

        {!showHint && feedback === "" && (
          <button
            onClick={() => setShowHint(true)}
            className="w-full mb-4 bg-yellow-100 text-yellow-700 py-2 rounded-lg hover:bg-yellow-200 transition font-semibold"
          >
            💡 Need a clue?
          </button>
        )}

        {showHint && feedback === "" && (
          <div className="mb-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-semibold">{getHint()}</p>
          </div>
        )}

        {feedback === "" && (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="Write the correct sentence..."
              className="w-full text-2xl text-center border-4 border-red-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
              className="w-full bg-red-500 text-white text-2xl font-bold py-3 rounded-xl hover:bg-red-600 transition disabled:bg-gray-300"
            >
              Check Your Answer
            </button>
          </>
        )}

        {feedback === "correct" && (
          <div className="bg-green-100 border-4 border-green-500 rounded-xl p-6 text-center">
            <Check size={40} className="text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700 mb-2">Parfait! 🎉</p>
            <p className="text-lg text-gray-700">
              Correction: <span className="font-bold text-green-700">{correctSentence}</span>
            </p>
          </div>
        )}

        {feedback === "incorrect" && (
          <div className="bg-red-100 border-4 border-red-500 rounded-xl p-6 text-center">
            <X size={40} className="text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-700 mb-2">Not quite...</p>
            <p className="text-lg text-gray-700 mb-3">
              The correct sentence is:
            </p>
            <p className="text-xl font-bold text-red-700 mb-4">{correctSentence}</p>
            <p className="text-lg text-gray-700 mb-3">
              Type it correctly to continue:
            </p>
            <input
              type="text"
              value={correctionAnswer}
              onChange={(e) => setCorrectionAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && correctionAnswer.trim().toLowerCase() === correctSentence.toLowerCase()) {
                  setFeedback("");
                  setUserAnswer("");
                  setCorrectionAnswer("");
                  generateWrongSentence();
                }
              }}
              placeholder="Type the correct sentence..."
              className="w-full text-xl text-center border-4 border-red-300 rounded-xl p-3 mb-4 focus:outline-none focus:border-red-500"
              autoFocus
            />
            <button
              onClick={() => {
                if (correctionAnswer.trim().toLowerCase() === correctSentence.toLowerCase()) {
                  setFeedback("");
                  setUserAnswer("");
                  setCorrectionAnswer("");
                  generateWrongSentence();
                }
              }}
              disabled={correctionAnswer.trim().toLowerCase() !== correctSentence.toLowerCase()}
              className="w-full bg-green-500 text-white text-xl font-bold py-3 rounded-xl hover:bg-green-600 transition disabled:bg-gray-300"
            >
              Continue ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level4;