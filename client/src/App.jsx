import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// Components
import Header from "./components/Header.jsx";
import Footer from "./components/home/Footer.jsx";

// Pages
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterCoursePage from "./pages/RegisterCoursePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ThanksFreeTrialPage from "./pages/ThanksFreeTrialPage.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";
import TermsAndPolicyPage from "./pages/TermsAndPolicyPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import BlogDetailsPage from "./pages/BlogDetailsPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";

const App = () => {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    script.setAttribute("data-widget-id", "66941593748b6842e5ace39e");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Toaster />
      <Header />

      {/* Main Container */}
      <div className="main-container">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/login" element={<LogInPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/register-course" element={<RegisterCoursePage />} />
            <Route path="/blogs">
              <Route index element={<BlogsPage />} />
              <Route path=":slug" element={<BlogDetailsPage />} />
            </Route>
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/thanks-free-trial-reg" element={<ThanksFreeTrialPage />} />
            <Route path="/terms" element={<TermsAndPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* 🚨 Catch-all for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
