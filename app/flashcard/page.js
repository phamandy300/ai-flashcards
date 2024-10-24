"use client";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDocs,
} from "@firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcards();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Your Flashcards
          </h1>
          <p className="text-gray-400 text-lg">
            Click on a card to reveal its translation
          </p>
        </motion.div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {flashcards.map((flashcard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleCardClick(index)}
                >
                  <div className="w-full h-80 perspective">
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform ${
                        flipped[index] ? "rotate-y-180" : ""
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front of Card */}
                      <div
                        className="absolute inset-0 backface-hidden flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-lg"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <p className="text-2xl font-medium text-white text-center">
                          {flashcard.front} {/* Word in native language */}
                        </p>
                      </div>

                      {/* Back of Card */}
                      <div
                        className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-purple-900 to-black border border-gray-800 shadow-lg"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <p className="text-2xl font-medium text-white text-center">
                          {flashcard.back} {/* Extra information */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {flashcards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl">
              No flashcards found in this set. Start by creating some new cards!
            </p>
            <motion.a
              href="/generate"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block mt-6 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Flashcards
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
