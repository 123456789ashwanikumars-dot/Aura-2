import {
  Camera,
  Briefcase,
  Code,
  Clock,
  Volume2,
  CheckCircle,
  Mic,
  StopCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axiosClient from "../utils/AxiosClient";

export default function Interview() {
  const [startInterview, setStartInterview] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);
  const [interviewAnswer, setInterviewAnswer] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { interviewData } = location.state || {};
  const questions = interviewData?.data?.Questions || [];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    console.log("Interview Data:", interviewData);

    // console.log(interviewAnswer.data.Experience);
  }, [interviewData]);

  useEffect(() => {
    console.log("Current answers:", interviewAnswer);
  }, [interviewAnswer]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn’t support speech recognition.</span>;
  }

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(text);
    }
  };

  const handleStopAndSave = () => {
    SpeechRecognition.stopListening();
    if (activeQuestionIndex !== null && transcript.trim() !== "") {
      setInterviewAnswer((prev) => ({
        ...prev,
        [activeQuestionIndex + 1]: transcript.trim(),
      }));
      resetTranscript();
    }
  };

  const handleQuestionClick = (index) => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setActiveQuestionIndex(index);

    const questionText = questions[index]?.Question;
    if (questionText) {
      speakText(questionText);
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    }
  };

  //  End Interview → Show loading transition → Navigate
  const handleEndInterview = async () => {
    setShowConfirm(null);
    setSubmitting(true);
    SpeechRecognition.stopListening();
    setStartInterview(false);
    setActiveQuestionIndex(null);

    const mergedQuestions = questions.map((q, index) => ({
      ...q,
      userAnswer: interviewAnswer[index + 1] || "",
    }));

    const finalData = { Question: mergedQuestions };

    try {
      const response = await axiosClient.post(
        "/interview/interviewResult",
        finalData
      );

      // MERGE FINAL DATA + LLM RESPONSE
      const mergedData = finalData.Question.map((q, index) => ({
        ...q,
        ...response.data.data.questionEvaluations[index],
      }));

      console.log("Merged Data:", mergedData);
      console.log("Final Data:", finalData);

      setTimeout(() => {
        navigate("/interViewReport", {
          state: {
            reportData: {
              message: response.data.message,
              feedback: response.data.data.feedback,
              overallScore: response.data.data.overallScore,
              mergedData: mergedData,

              Experience: interviewData?.data?.Experience,
              JobDescription: interviewData?.data?.JobDescription,
              JobPosition: interviewData?.data?.JobPosition,
            },
          },
        });
      }, 1800);
    } catch (error) {
      console.error("Error submitting interview results:", error);
      alert("Failed to submit interview results. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white p-4 md:p-6 transition-all duration-300">
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* LEFT PANEL */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-cyan-700/30 rounded-3xl p-8 shadow-lg transition-all duration-500">
          {!startInterview ? (
            <>
              <h2 className="text-4xl font-extrabold mb-6 text-cyan-400 flex items-center">
                <Briefcase className="w-7 h-7 mr-3 text-cyan-500" />
                Interview Preparation
              </h2>

              <div className="space-y-6 text-lg">
                <DetailItem
                  icon={<Briefcase />}
                  label="Job Role"
                  value={interviewData?.data?.JobPosition}
                />
                <DetailItem
                  icon={<Code />}
                  label="Tech Stack"
                  value={interviewData?.data?.JobDescription}
                />
                <DetailItem
                  icon={<Clock />}
                  label="Experience"
                  value={`${interviewData?.data?.Experience} Year`}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400">
                Interview Questions
              </h2>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                      activeQuestionIndex === index
                        ? "bg-cyan-500 text-gray-900 border-cyan-400 scale-105"
                        : interviewAnswer[index + 1]
                        ? "bg-green-700/30 border-green-500/50 text-green-300"
                        : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-cyan-600/20 hover:border-cyan-400"
                    }`}
                  >
                    {interviewAnswer[index + 1] ? (
                      <CheckCircle className="inline w-4 h-4 mr-1 text-green-400" />
                    ) : null}
                    Q{index + 1}
                  </button>
                ))}
              </div>

              <div className="min-h-[180px] bg-gray-800/60 p-6 rounded-2xl border border-gray-700 text-gray-200 transition-all duration-500">
                {activeQuestionIndex !== null ? (
                  <div className="animate-fadeIn">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">
                      Question {activeQuestionIndex + 1}:
                    </h3>
                    <p className="text-gray-100 leading-relaxed">
                      {questions[activeQuestionIndex]?.Question}
                    </p>
                    <Volume2
                      className={`w-6 h-6 mt-3 cursor-pointer transition-transform hover:scale-110 ${
                        isSpeaking ? "text-yellow-400" : "text-cyan-400"
                      }`}
                      onClick={() =>
                        toggleSpeech(questions[activeQuestionIndex]?.Question)
                      }
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    Select a question to begin your mock interview.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-gray-900/60 backdrop-blur-md border border-cyan-700/30 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 shadow-lg">
          <div className="relative w-full h-64 bg-gray-950/80 rounded-2xl flex items-center justify-center border-2 border-dashed border-cyan-500/40 mb-8 overflow-hidden">
            {startInterview ? (
              <Webcam
                audio={false}
                mirrored={true}
                videoConstraints={{ facingMode: "user" }}
                className="rounded-2xl w-full h-60 object-cover transition-all duration-500"
              />
            ) : (
              <Camera className="w-16 h-16 text-cyan-400/60" />
            )}

            {listening && (
              <div className="absolute bottom-3 left-3 flex items-center space-x-2 animate-pulse">
                <Mic className="text-red-500 w-5 h-5" />
                <span className="text-sm text-red-400">Recording...</span>
              </div>
            )}
          </div>

          {!startInterview ? (
            <button
              onClick={() => setShowConfirm("start")}
              className="w-3/4 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl font-bold text-lg text-gray-900 shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start Interview
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm("end")}
              className="w-3/4 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold text-lg text-gray-900 shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "End Interview"}
            </button>
          )}

          {startInterview && (
            <div className="p-4 bg-gray-800 rounded-md mt-6 w-full transition-all duration-500">
              <p className="mb-2 text-sm text-gray-400">
                🎙️ Microphone:{" "}
                <span
                  className={`font-semibold ${
                    listening ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {listening ? "On" : "Off"}
                </span>
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() =>
                    SpeechRecognition.startListening({
                      continuous: true,
                      language: "en-IN",
                    })
                  }
                  className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded font-semibold hover:bg-cyan-400 transition-all"
                >
                  <Mic className="w-4 h-4" /> Start
                </button>

                <button
                  onClick={handleStopAndSave}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-400 transition-all"
                >
                  <StopCircle className="w-4 h-4" /> Stop & Save
                </button>

                <button
                  onClick={resetTranscript}
                  className="bg-gray-500 text-white px-4 py-2 rounded font-semibold hover:bg-gray-400 transition-all"
                >
                  Reset
                </button>
              </div>

              <p className="mt-3 bg-gray-900 p-3 rounded text-cyan-400 whitespace-pre-wrap min-h-[70px]">
                {transcript || "🎧 Say something..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/*  LOADING OVERLAY (NEW) */}
      {submitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 text-center animate-fadeIn">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-cyan-300">
            Evaluting your interview Answer...
          </h2>
          <p className="text-gray-400 mt-2">
            Please wait while we evaluate your answers
          </p>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity animate-fadeIn">
          <div className="bg-gray-900 border border-cyan-600 rounded-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">
              {showConfirm === "start"
                ? "Start the Interview?"
                : "End the Interview?"}
            </h3>
            <p className="text-gray-400 mb-6">
              {showConfirm === "start"
                ? "Once you start, questions will be available for answering."
                : "Make sure all answers are saved before submitting."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-cyan-500 text-gray-900 font-semibold rounded-lg hover:bg-cyan-400 transition-all"
                onClick={() => {
                  if (showConfirm === "start") {
                    setStartInterview(true);
                    setShowConfirm(null);
                  } else {
                    handleEndInterview();
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start">
      <div className="w-9 h-9 flex items-center justify-center mr-4 rounded-full bg-cyan-800/30 text-cyan-400">
        {icon}
      </div>
      <div>
        <span className="font-medium text-gray-400 block text-sm uppercase tracking-wider">
          {label}
        </span>
        <span className="font-semibold text-gray-100 text-lg">{value}</span>
      </div>
    </div>
  );
}
