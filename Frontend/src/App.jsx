import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register_Login from "./Pages/Register&Login";
import DashBoard from "./Pages/DashBoard";
import AiBasicDetail from "./components/AiBasicDetail";
import Interview from "./components/InterView";
import InterViewReport from "./components/InterViewReport";
import HowITWork from "./components/HowITWork";
import Question from "./Pages/Questions";
import Upgrade from "./Pages/Upgrade";

import { checkAuth } from "./Redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  // to read the data from the authSlicer
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register_Login />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashBoard /> : <Navigate to="/" />}
        />
        <Route
          path="yourDetails"
          element={isAuthenticated ? <AiBasicDetail /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/interView"
          element={isAuthenticated ? <Interview /> : <Navigate to="/" />}
        ></Route>

        <Route
          path="/interViewReport"
          element={isAuthenticated ? <InterViewReport /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/HowITWork"
          element={isAuthenticated ? <HowITWork /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/Upgrade"
          element={isAuthenticated ? <Upgrade /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/Question"
          element={isAuthenticated ? <Question /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </Router>
  );
}
