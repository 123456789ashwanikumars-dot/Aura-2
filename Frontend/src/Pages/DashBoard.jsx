const imagelogo = new URL(
  "../Photo/Gemini_Generated_Image_k85738k85738k857.png",
  import.meta.url
).href;
import { logoutUser } from "../Redux/AuthSlice";
import { useDispatch } from "react-redux";

const ProfileImage = new URL("../Photo/ai-tools.webp", import.meta.url).href;
import { useLocation } from "react-router-dom";

import { Outlet, Link } from "react-router-dom";
import axiosClient from "../utils/AxiosClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashBoard() {
  const [interviewData, setInterviewData] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // To get detail after login
  const location = useLocation();
  const profile = location.state;

  useEffect(() => {
    if (profile) {
      console.log("User Profile:", profile);
      console.log(profile.firstName);
    }
  }, [profile]);

  useEffect(() => {
    const GetTotalInterView = async () => {
      const response = await axiosClient.post(
        "/interview/totalInterviewConducted"
      );
      setInterviewData(response.data);
    };
    GetTotalInterView();
  }, []);

  // click on View Details
  const ViewProblemDetail = async (_id) => {
    try {
      const response = await axiosClient.post(
        `/interview/getProblemDetail/${_id}`
      );

      console.log(response.data);
      console.log(_id);

      setTimeout(() => {
        navigate("/interViewReport", {
          state: {
            reportData: {
              message: response.data.message,
              feedback: response.data.data.feedback,
              overallScore: response.data.data.overallScore,
              mergedData: response.data.data.mergedData,
            },
          },
        });
      });
    } catch (error) {
      console.log("The Error : " + error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());

      navigate("/");

      console.log("logout Successfully");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0f] via-[#111113] to-[#1b1b1d] text-white">
      {/* NAVBAR */}
      <nav
        className="flex justify-between items-center px-8 py-4 
      bg-white/5 backdrop-blur-xl border-b border-white/10 shadow 
      sticky top-0 z-50"
      >
        {/* LOGO */}
        <div className="flex items-center space-x-3">
          <img
            src={imagelogo}
            alt="Logo"
            className="h-10 w-30 rounded-full border border-white p-1 bg-white shadow"
          />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
            Aura AI
          </h1>
        </div>

        {/* NAV BUTTONS */}
        <div className="hidden md:flex gap-6 text-gray-300 font-medium">
          <Link to={"/dashboard"}>
            <button className="hover:text-pink-400 transition">
              Dashboard
            </button>
          </Link>

          <Link to={"/Question"}>
            <button className="hover:text-pink-400 transition">Question</button>
          </Link>

          <Link to={"/Upgrade"}>
            <button className="hover:text-pink-400 transition">Upgrade</button>
          </Link>

          <Link to={"/HowITWork"}>
            <button className="hover:text-pink-400 transition">
              How it Works
            </button>
          </Link>
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0d0d0f] p-1.5 pr-3 rounded-full border border-gray-200 dark:border-gray-800">
          {/* Avatar Group */}
          <div className="relative shrink-0">
            <img
              src={ProfileImage}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0d0d0f]"></span>
          </div>

          {/* Styled Select */}
          <div className="relative">
            <select
              onChange={handleLogout}
              className="appearance-none bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer pr-6"
              defaultValue="Ashwani"
            >
              <option value="Ashwani" disabled className="text-gray-900">
                Ashwani
              </option>
              <option value="edit" className="text-gray-800">
                Edit Profile
              </option>
              <option value="logout" className="text-red-500">
                Logout
              </option>
            </select>

            {/* Custom Arrow to hide the ugly browser default */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-500">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="p-8">
        {/* HEADER CARD */}
        <div
          className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl 
        shadow-2xl p-8 w-full md:w-96 mx-auto mb-12 text-center 
        transform hover:scale-[1.02] transition-all duration-300"
        >
          <h2 className="text-3xl font-bold text-white mb-2">AI Interview</h2>
          <p className="text-gray-200 text-sm mb-5">
            Improve your confidence with AI-powered mock interviews.
          </p>

          <Link to="/yourDetails">
            <button
              className="bg-white text-pink-600 font-semibold px-6 py-2 
            rounded-xl shadow hover:bg-gray-100 transition-all"
            >
              Start Now
            </button>
          </Link>
        </div>

        {/* SECTION TITLE */}
        <h2 className="text-3xl font-bold text-white mb-6">
          Your Past Interviews
        </h2>

        {/* INTERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {interviewData?.length > 0 ? (
            interviewData.map((item) => (
              <div
                key={item._id}
                className="bg-white/10 backdrop-blur-xl border border-white/10 
                shadow-xl rounded-2xl p-6 
                hover:shadow-2xl hover:-translate-y-1 
                hover:bg-white/15 transform transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.JobPosition}
                </h3>

                <p className="text-gray-300 mt-2">
                  <span className="font-semibold text-gray-200">
                    Description:{" "}
                  </span>
                  {item.JobDescription}
                </p>

                <p className="text-gray-300 mt-1">
                  <span className="font-semibold text-gray-200">
                    Experience:{" "}
                  </span>
                  {item.Experience} Years
                </p>

                <p className="text-gray-300 mt-1 line-clamp-2">
                  <span className="font-semibold text-gray-200">
                    Feedback:{" "}
                  </span>
                  {item.feedback}
                </p>

                <p className="text-gray-400 text-sm mt-4">
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>

                <button
                  className="w-full mt-5 bg-pink-600 text-white py-2 rounded-lg 
  font-medium hover:bg-pink-700 hover:shadow transition-all"
                  onClick={() => ViewProblemDetail(item._id)}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-center col-span-3 text-lg">
              Loading interviews...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
