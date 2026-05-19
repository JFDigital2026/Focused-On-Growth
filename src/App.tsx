/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import Home from "./pages/Home";
import Advisors from "./pages/Advisors";
import Services from "./pages/Services";
import Careers from "./pages/Careers";
import { motion, useScroll, useSpring } from "motion/react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const openContact = () => setIsContactModalOpen(true);

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] origin-left"
        style={{ scaleX }}
      />

      <Navbar onOpenContact={openContact} />
      
      <Routes>
        <Route path="/" element={<Home onOpenContact={openContact} />} />
        <Route path="/advisors" element={<Advisors onOpenContact={openContact} />} />
        <Route path="/services" element={<Services onOpenContact={openContact} />} />
        <Route path="/careers" element={<Careers onOpenContact={openContact} />} />
      </Routes>

      <Footer />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
