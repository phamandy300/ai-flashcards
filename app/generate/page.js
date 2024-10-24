"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { getDoc, writeBatch, collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const saveFlashcards = async () => {
    if (!user?.id) {
      alert("User information is not available.");
      return;
    }

    if (!name) {
      alert("Please enter a name for your flashcards");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.some((f) => f.name === name)) {
        alert("A flashcard collection with that name already exists");
        return;
      }
      collections.push({ name });
      batch.set(userDocRef, { flashcards: collections }, { merge: true });
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    try {
      await batch.commit();
      setIsDialogOpen(false);
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Generate Flashcards
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Enter your text below to create AI-powered flashcards
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-40 bg-gray-900 text-white rounded-xl p-4 mb-4 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-white text-black py-4 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Generate Flashcards
          </button>
        </motion.div>

        {flashcards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">Preview Your Flashcards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((flashcard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative perspective-1000"
                >
                  <div
                    className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform ${
                      flipped[index] ? "rotate-y-180" : ""
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                    onClick={() => handleCardClick(index)}
                  >
                    {/* Front of Card */}
                    <div
                      className="absolute inset-0 backface-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 flex items-center justify-center"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-lg font-medium text-center">
                        {flashcard.front} {/* Word in native language */}
                      </p>
                    </div>

                    {/* Back of Card */}
                    <div
                      className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-purple-900 to-black border border-gray-800 rounded-xl p-6 flex items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-lg font-medium text-center">
                        {flashcard.back} {/* Additional information */}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Save Collection
              </button>
            </div>
          </motion.div>
        )}

        {/* Save Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Save Your Collection</h3>
              <p className="text-gray-400 mb-4">Enter a name for your flashcard collection</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Collection name"
                className="w-full bg-gray-900 text-white rounded-xl p-4 mb-6 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6 py-2 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveFlashcards}
                  className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
