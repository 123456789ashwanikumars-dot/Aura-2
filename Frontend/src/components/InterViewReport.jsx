import { useEffect, useState,useRef  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Star,
  ChevronLeft,
  Brain,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axiosClient from "../utils/AxiosClient";

export default function InterviewerReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportData } = location.state || {};

  // mergedData now contains everything (question + answer + eval + score)
  const mergedData = reportData?.mergedData || [];
  const feedback = reportData?.feedback;
  const overallScore = reportData?.overallScore;


  const [openIndex, setOpenIndex] = useState(null);





  // To Store in DB
const calledOnce = useRef(false);

useEffect(() => {
  if (calledOnce.current) return;  // prevent second call
  calledOnce.current = true;

  const storeReport = async () => {
    await axiosClient.post("/interview/interviewResultStore", reportData);
  };

  storeReport();
}, [reportData]);

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
        <p className="text-gray-400 text-lg mb-4">No report data available.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-cyan-500 text-black rounded-xl font-semibold hover:bg-cyan-400 transition"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const totalQuestions = mergedData.length;
  const correctAnswers = mergedData.filter((q) => q.score > 0).length;
  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const toggleView = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white py-12 px-6">
      <div className="max-w-5xl mx-auto bg-gray-900/70 border border-cyan-600/40 rounded-3xl shadow-lg p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/10 blur-3xl opacity-40"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-cyan-400 flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-300" />
            Interview Report
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl font-medium transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
        </div>

        {/* Overall Result Card */}
        <div className="relative z-10 bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl font-bold text-cyan-400">
                Overall Evaluation
              </h2>
              <p className="text-gray-300 leading-relaxed">{feedback}</p>

              <div className="flex items-center gap-3 mt-3">
                <span className="font-semibold text-gray-400">
                  Overall Score:
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < overallScore
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">({overallScore}/5)</span>
              </div>
            </div>

            {/* Circular Score */}
            <div className="mt-6 md:mt-0 relative">
              <div className="relative w-32 h-32 rounded-full bg-gray-900 border-4 border-cyan-500 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">
                    {percentage}%
                  </p>
                  <p className="text-gray-400 text-sm">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Question-by-Question Analysis
          </h2>

          <div className="space-y-5">
            {mergedData.map((q, index) => (
              <div
                key={index}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    Question {q.questionNumber}
                  </h3>
                  {q.score > 0 ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>

                <p className="text-gray-400 mb-3 leading-relaxed">
                  <strong>Evaluation:</strong> {q.evaluation}
                </p>

                {/* Score */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-400">Score:</span>
                  <span
                    className={`text-lg font-semibold ${
                      q.score > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {q.score}/5
                  </span>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleView(index)}
                  className="flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition"
                >
                  {openIndex === index ? (
                    <>
                      <ChevronUp className="w-5 h-5" /> Hide Question & Answers
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" /> Show Question &
                      Answers
                    </>
                  )}
                </button>

                {/* Collapsible Section */}
                {openIndex === index && (
                  <div className="mt-4 bg-gray-900/60 border border-gray-700 rounded-xl p-4 space-y-3">
                    <p className="text-gray-300">
                      <strong className="text-cyan-300">Asked Question:</strong>{" "}
                      {q.Question}
                    </p>

                    <p className="text-gray-300">
                      <strong className="text-green-400">
                        Correct Answer:
                      </strong>{" "}
                      {q.Answer}
                    </p>

                    <p className="text-gray-300">
                      <strong className="text-yellow-400">Your Answer:</strong>{" "}
                      {q.userAnswer || "No answer provided"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <div className="relative z-10 mt-12 flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
          >
            <Trophy className="w-5 h-5" /> Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
