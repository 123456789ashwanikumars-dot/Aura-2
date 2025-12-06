import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import axiosClient from "../utils/AxiosClient";
import { RegisterStore, LoginAssign } from "../Redux/AuthSlice";

function Register_Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [auth, setAuth] = useState(false);
  const imageUrl = new URL("../Photo/ai-tools.webp", import.meta.url).href;

  // 🔹 Register Function
  const handleRegister = async (data) => {
    try {
      await dispatch(RegisterStore(data)).unwrap();
      reset();
      setAuth(true);
      navigate("/dashboard");
    } catch (error) {
      alert("Registration failed: " + error);
    }
  };

  // 🔹 Login Function
  const handleLogin = async (data) => {
    try {
      const user = await dispatch(LoginAssign(data)).unwrap();
      console.log(user);
      reset();
      navigate("/dashboard", { state: user });
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please sign up first!");
    }
  };

  // 🔹 Handle form submission
  const onSubmit = (data) => {
    if (!auth) {
      handleRegister(data);
    } else {
      handleLogin(data);
    }
  };

  useEffect(() => {
    // console.log(user)
  });

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full p-4 transition-all duration-500"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#1f2937",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full max-w-5xl mx-auto rounded-3xl shadow-2xl overflow-hidden min-h-auto lg:min-h-[35rem]">
        {/* 🔹 SECTION 1: Left Side (Register Form OR Login Image) */}
        {!auth ? (
          // === REGISTER FORM ===
          <div className="w-full lg:w-1/2 p-6 sm:p-12 bg-white/5 backdrop-blur-xl border border-white/20 space-y-8 rounded-3xl lg:rounded-r-none">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center sm:text-left">
              Create Your Account
            </h1>
            <p className="text-gray-300 text-center sm:text-left text-sm sm:text-base">
              Give Interview as per your Dream Company
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName", {
                    required: "First Name is required",
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.firstName
                      ? "border-red-500"
                      : "border border-white/20"
                  }`}
                  placeholder="Ashwani"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Last Name
                </label>
                <input
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.lastName
                      ? "border-red-500"
                      : "border border-white/20"
                  }`}
                  placeholder="Singh"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border border-white/20"
                  }`}
                  placeholder="2005ashwani01@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border border-white/20"
                  }`}
                  placeholder="************"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl text-lg font-semibold text-white bg-blue-600 shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition transform hover:scale-[1.01]"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-400 pt-4">
              Already have an account?{" "}
              <button
                className="text-blue-400 hover:text-blue-300 transition"
                onClick={() => setAuth(true)}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          // === LOGIN IMAGE BACKGROUND (Hidden on Mobile) ===
          <div className="hidden lg:block w-1/2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-r-3xl lg:rounded-r-none lg:rounded-l-3xl">
            <div
              className="flex justify-center items-center h-full w-full"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
        )}

        {/* 🔹 SECTION 2: Right Side (Login Form OR Register Image) */}
        {auth ? (
          // === LOGIN FORM ===
          <div className="w-full lg:w-1/2 p-6 sm:p-12 bg-white/5 backdrop-blur-xl border border-white/20 space-y-8 rounded-3xl lg:rounded-l-none">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center sm:text-left">
              Login Your Account
            </h1>
            <p className="text-gray-300 text-center sm:text-left text-sm sm:text-base">
              Give Interview as per your Dream Company
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.email ? "border-red-500" : "border border-white/20"
                  }`}
                  placeholder="2005ashwani01@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                  className={`w-full px-4 py-3 bg-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.password
                      ? "border-red-500"
                      : "border border-white/20"
                  }`}
                  placeholder="************"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 px-4 rounded-xl text-lg font-semibold text-white bg-blue-600 shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition transform hover:scale-[1.01]"
              >
                Login
              </button>
            </form>

            <div className="text-center text-sm text-gray-400 pt-4">
              Have no account?{" "}
              <button
                className="text-blue-400 hover:text-blue-300 transition"
                onClick={() => setAuth(false)}
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          // === REGISTER IMAGE BACKGROUND (Hidden on Mobile) ===
          <div className="hidden lg:block w-1/2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-r-3xl lg:rounded-r-none lg:rounded-l-none">
            <div
              className="flex justify-center items-center h-full w-full"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register_Login;
