import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import CenthropyApp from "./CenthropyApp";
import PageTransition from "./components/PageTransition";

// Lazy load secondary route components — only loaded when navigated to
const Newsroom = lazy(() => import("./Newsroom"));
const ImpactStudies = lazy(() => import("./ImpactStudies"));
const BlogPost = lazy(() => import("./BlogPost"));
const Waitlist = lazy(() => import("./Waitlist"));
const LoginRedirect = lazy(() => import("./LoginRedirect"));
const CorporateAnnouncements = lazy(() => import("./CorporateAnnouncements"));
const AdminLogin = lazy(() => import("./editorial/AdminLogin"));
const EditorialPanel = lazy(() => import("./editorial/EditorialPanel"));
const DocumentationConstruction = lazy(() => import("./DocumentationConstruction"));
const NotFound = lazy(() => import("./NotFound"));
const GrowthEngine = lazy(() => import("./GrowthEngine"));

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
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

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
        window.scrollTo(0, 0);
      }, 150); // Internal navigation cover time

      return () => clearTimeout(timer);
    }
  }, [location.pathname, displayLocation.pathname]);

  // Fallback Scroll to top on navigation change (for displayLocation updates)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [displayLocation.pathname]);

  return (
    <>
      <PageTransition stage={transitionStage} />
      <div
        style={{
          visibility: transitionStage === "covering" ? "hidden" : "visible",
        }}
      >
        <Suspense fallback={null}>
          <Routes location={displayLocation}>
            <Route path="/" element={<CenthropyApp />} />
            <Route path="/newsroom" element={<Newsroom />} />
            <Route path="/impact-studies" element={<ImpactStudies />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/announcements" element={<CorporateAnnouncements />} />
            <Route path="/docs" element={<DocumentationConstruction />} />
            <Route path="/growthengine" element={<GrowthEngine />} />
            {/* Stealth Editorial Routes */}
            <Route path="/terminal-x92-core" element={<AdminLogin />} />
            <Route
              path="/terminal-x92-core/dashboard"
              element={<EditorialPanel />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default App;
