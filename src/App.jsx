import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import CenthropyApp from "./CenthropyApp";
import Newsroom from "./Newsroom";
import ImpactStudies from "./ImpactStudies";
import BlogPost from "./BlogPost";
import Waitlist from "./Waitlist";
import LoginRedirect from "./LoginRedirect";
import CorporateAnnouncements from "./CorporateAnnouncements";
import PageTransition from "./components/PageTransition";
import AdminLogin from "./editorial/AdminLogin";
import EditorialPanel from "./editorial/EditorialPanel";
import Documentation from "./Documentation";
import NotFound from "./NotFound";

const App = () => {
  return (
    <Router>
      <PageTransitionWrapper />
    </Router>
  );
};

const PageTransitionWrapper = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("covering"); // Initial state is covering

  // Handle Initial Load
  useEffect(() => {
    console.log("Deployed. Developed by Centhropy.");

    const timer = setTimeout(() => {
      setTransitionStage("revealing");
    }, 1000); // Initial load reveal wait time (1s)
    return () => clearTimeout(timer);
  }, []);

  // Handle Internal Navigation
  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("covering");

      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("revealing");
      }, 150); // Internal navigation cover time

      return () => clearTimeout(timer);
    }
  }, [location.pathname, displayLocation.pathname]);

  return (
    <>
      <PageTransition stage={transitionStage} />
      <div
        style={{
          visibility: transitionStage === "covering" ? "hidden" : "visible",
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<CenthropyApp />} />
          <Route path="/newsroom" element={<Newsroom />} />
          <Route path="/impact-studies" element={<ImpactStudies />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/announcements" element={<CorporateAnnouncements />} />
          <Route path="/docs" element={<Documentation />} />
          {/* Stealth Editorial Routes */}
          <Route path="/terminal-x92-core" element={<AdminLogin />} />
          <Route
            path="/terminal-x92-core/dashboard"
            element={<EditorialPanel />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
