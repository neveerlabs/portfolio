import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ServicesSection } from "./components/ServicesSection/ServicesSection";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import { EducationSection } from "./components/EducationSection/EducationSection";
import { CareerTimeline } from "./components/CareerSection/CareerTimeline";
import { ContactSection } from "./components/ContactSection/ContactSection";
import { Footer } from "./components/Footer/Footer";
import ReactLenis from "lenis/react";
import { Home, User, GraduationCap, Briefcase, FolderKanban, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Dock from "./components/lightswind/dock";
import { SmoothCursor } from "./components/lightswind/smooth-cursor";

function App() {
  const [showDock, setShowDock] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = currentScrollY > lastScrollY && currentScrollY > window.innerHeight * 0.5;
      const isTop = currentScrollY < window.innerHeight * 0.5;

      if (shouldShow) {
        setShowDock(true);
      } else if (isTop) {
        setShowDock(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dockItems = [
    { icon: <Home size={20} />, label: "Home", onClick: () => scrollToSection("hero") },
    { icon: <User size={20} />, label: "About", onClick: () => scrollToSection("about") },
    { icon: <Briefcase size={20} />, label: "Experience", onClick: () => scrollToSection("career") },
    { icon: <FolderKanban size={20} />, label: "Projects", onClick: () => scrollToSection("projects") },
    { icon: <GraduationCap size={20} />, label: "Education", onClick: () => scrollToSection("education") },
    { icon: <Send size={20} />, label: "Contact", onClick: () => scrollToSection("contact") },
  ];

  return (
    <div className="bg-transparent min-h-screen relative overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <SmoothCursor glowEffect showTrail trailLength={4} />
      <ReactLenis root options={{ smoothWheel: true, duration: 1.2 }}>
        <Header />

        <main className="w-full flex flex-col pt-10 border-none">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <CareerTimeline />
          <EducationSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Dock */}
        <AnimatePresence>
          {showDock && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed bottom-2 left-0 right-0 z-[999] hidden md:block"
            >
              <Dock
                items={dockItems}
                panelHeight={56}
                baseItemSize={44}
                magnification={66}
                distance={180}
                multiBorder
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ReactLenis>
    </div>
  );
}

export default App;
