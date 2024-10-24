"use client";

import getStripe from "@/utils/get-stripe";
import { FaLinkedinIn, FaGithub, FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [dynamicText, setDynamicText] = useState("");

  useEffect(() => {
    const text = "to Language Learning";
    let i = 0;
    const intervalId = setInterval(() => {
      setDynamicText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(intervalId);
      }
    }, 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      title: "Immersive Learning",
      description: "Transform your language journey through interactive, AI-powered flashcards."
    },
    {
      title: "Personalized For You",
      description: "Custom flashcards that adapt to your learning style and pace."
    },
    {
      title: "Learn Anywhere",
      description: "Seamlessly sync your progress across all your devices."
    }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient that spans the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/50 via-black to-purple-900/30 pointer-events-none" />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 leading-normal pb-2"
          >
            Welcome {dynamicText}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mt-8 mb-8 text-gray-300"
          >
            Dive into language learning with our interactive and AI-powered flashcards
          </motion.p>
          <motion.a 
            href="/generate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </motion.a>
        </div>
      </div>

      {/* Features Section with modified background */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section with smoother transition */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black/50" />
        <div className="relative z-10 text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            Begin Your Journey
          </motion.h2>
          <motion.a 
            href="/generate"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </motion.a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-4 bg-black/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2024 Language Learning Flashcards</p>
          <div className="flex space-x-6">
            <a 
              href="https://www.linkedin.com/in/andy-pham-03454a25a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedinIn className="w-6 h-6" />
            </a>
            <a 
              href="https://andypham.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGlobe className="w-6 h-6" />
            </a>
            <a 
              href="https://github.com/phamandy300/ai-flashcards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}