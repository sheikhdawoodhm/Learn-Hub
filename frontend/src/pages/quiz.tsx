import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unlockNextLesson } from "../redux/slices/progressSlice";
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Award } from "lucide-react";
import API from "../api/axiosAPI";

const QuizPage = () => {
  const { courseId, moduleId, videoId } = useParams<{ courseId: string; moduleId: string; videoId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | "">("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const course = useSelector((state: any) =>
    state.courses?.courses?.find((c: any) => String(c.id) === String(courseId))
  );

  const currentModule = course?.modules?.find((m: any) => String(m.id) === String(moduleId));
  const currentVideo = currentModule?.videos?.find((v: any) => String(v.id) === String(videoId));
  const questions = currentVideo?.questions || [];

  if (!course || !currentVideo || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Quiz Content Block Missed</h3>
        <p className="text-slate-400 text-sm max-w-sm mt-1 mb-6">
          The validation engine failed to cross-reference questionnaire tracks matching target reference id:
          <code className="bg-slate-100 dark:bg-slate-800 text-xs px-1.5 py-0.5 rounded font-mono ml-1">{videoId}</code>
        </p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold flex items-center gap-1 cursor-pointer hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Lesson Canvas
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  const handleNext = async () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const currentScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(currentScore);

    setSelectedAnswer("");
    setIsSubmitted(false);

    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizFinished(true);
      const passed = currentScore === questions.length;

      if (passed) {
        const lectureKey = `${courseId}-${moduleId}-${videoId}`;


        dispatch(unlockNextLesson(lectureKey));


        try {
          await API.post("/progress/sync", {
            courseId,
            moduleId,
            videoId,
            lectureKey,
            completed: true
          });
        } catch (err) {
          console.error("Database progress sync failed:", err);
        }
      }
    }
  };

  if (quizFinished) {
    const isPerfectScore = score === questions.length;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40">
            <Award className={`w-8 h-8 ${isPerfectScore ? "text-yellow-500 animate-bounce" : "text-slate-400"}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quiz Results</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You scored <span className="font-bold text-slate-900 dark:text-slate-100">{score}</span> out of {questions.length}
            </p>
          </div>

          <div className={`p-4 rounded-xl text-xs font-medium border ${isPerfectScore
              ? "bg-emerald-50/50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400"
              : "bg-amber-50/50 border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900 dark:text-amber-400"
            }`}>
            {isPerfectScore
              ? "Perfect Score! This lecture is now officially marked completed and the next step is unlocked."
              : "You must answer 100% of the questions correctly to complete this lesson and clear the progress gate lock."
            }
          </div>

          <div className="flex gap-3">
            {!isPerfectScore && (
              <button
                onClick={() => {
                  setCurrentQuestionIdx(0);
                  setScore(0);
                  setQuizFinished(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            )}
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Back to Syllabus <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold tracking-tight leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {([
              { key: "optionA", value: currentQuestion.optionA, letter: "A" },
              { key: "optionB", value: currentQuestion.optionB, letter: "B" },
              { key: "optionC", value: currentQuestion.optionC, letter: "C" },
              { key: "optionD", value: currentQuestion.optionD, letter: "D" },
            ] as const).map((opt) => {
              const isSelected = selectedAnswer === opt.letter;
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedAnswer(opt.letter)}
                  className={`w-full text-left px-5 py-4 rounded-xl border font-medium text-sm transition-all flex items-center justify-between gap-4 cursor-pointer ${isSelected
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-500 dark:text-indigo-400 font-bold"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-6 h-6 text-xs font-bold rounded-md flex items-center justify-center border ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800"
                      }`}>
                      {opt.letter}
                    </span>
                    {opt.value}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 text-sm transition-all ${!selectedAnswer
                  ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
                }`}
            >
              {currentQuestionIdx + 1 === questions.length ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizPage;