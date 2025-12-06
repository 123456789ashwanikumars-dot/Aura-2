import { useForm } from "react-hook-form";
import axiosClient from "../utils/AxiosClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AiBasicDetail() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Start loading UI
      
      const response = await axiosClient.post("/interview/question", data);
      const interviewId = response.data;

      // Small delay to improve UX feel
      setTimeout(() => {
        if (interviewId) {
          navigate(`/interView`, { state: { interviewData: interviewId } });
        }
      }, 900);
    } catch (error) {
      console.error("Error sending data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black px-4">

      {/* FULL SCREEN LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-lg flex flex-col justify-center items-center z-50 animate-fadeIn">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-200 mt-4 text-lg tracking-wide animate-pulse">
            Preparing your AI interview...
          </p>
        </div>
      )}

      {/* FORM CARD */}
      <div className={`bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-10 w-full max-w-2xl text-white space-y-8 transition-all duration-300 
        ${loading ? "blur-sm scale-95" : "hover:shadow-[0_0_60px_rgba(244,63,94,0.3)]"}`}
      >

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 text-transparent bg-clip-text drop-shadow-md">
            Tell Us More About the Job
          </h1>
          <p className="text-gray-300 text-sm">
            Provide details about your job role, tech stack, and experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">

          {/* Job Position */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              Job Position / Role Name
            </label>
            <input
              {...register("JobPosition")}
              placeholder="e.g., Frontend Developer"
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 
              text-white placeholder-gray-400 focus:outline-none 
              focus:border-rose-400 focus:shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              Job Description / Tech Stack (Short)
            </label>
            <input
              {...register("JobDescription")}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 
              text-white placeholder-gray-400 focus:outline-none 
              focus:border-pink-400 focus:shadow-[0_0_15px_rgba(244,114,182,0.4)] transition-all"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-200">
              Years of Experience
            </label>
            <input
              {...register("Experience", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="e.g., 2"
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 
              text-white placeholder-gray-400 focus:outline-none 
              focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.4)] transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => reset()}
              disabled={loading}
              className="px-5 py-2 rounded-xl border border-white/20 
              text-gray-300 hover:bg-white/10 hover:scale-105 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            {/* SUBMIT BUTTON WITH LOADING SPINNER */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 
              rounded-xl font-semibold text-white shadow-md 
              flex items-center justify-center gap-2 hover:shadow-lg 
              hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
