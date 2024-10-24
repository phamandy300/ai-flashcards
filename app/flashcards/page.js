"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { db, auth } from "../../firebase";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Firebase Authentication logic remains the same
  useEffect(() => {
    const authenticateWithFirebase = async () => {
      if (isSignedIn && user) {
        try {
          const token = await getToken({ template: "integration_firebase" });
          if (token) {
            await signInWithCustomToken(auth, token);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Firebase authentication error:", error);
        }
      }
    };

    authenticateWithFirebase();
  }, [isSignedIn, user, getToken]);

  // Fetch flashcards logic remains the same
  useEffect(() => {
    async function getFlashcards() {
      if (!isAuthenticated || !user) return;
      
      try {
        const docRef = doc(db, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcards(collections);
        } else {
          await setDoc(docRef, { flashcards: [] });
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    getFlashcards();
  }, [user, isAuthenticated]);

  const handleDelete = async (flashcardName) => {
    if (!isAuthenticated) return;

    try {
      const updatedFlashcards = flashcards.filter(
        (flashcard) => flashcard.name !== flashcardName
      );
      const docRef = doc(db, "users", user.id);
      await setDoc(docRef, { flashcards: updatedFlashcards });

      setFlashcards(updatedFlashcards);

      const subColRef = collection(docRef, flashcardName);
      const snapshot = await getDocs(subColRef);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const editFlashcard = async (oldName, newName) => {
    if (!isAuthenticated || !newName) return;

    try {
      const userDocRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        let collections = docSnap.data().flashcards || [];
        const flashcardIndex = collections.findIndex((f) => f.name === oldName);
        
        if (collections.some((f) => f.name === newName)) {
          alert("A flashcard with this name already exists");
          return;
        }

        collections[flashcardIndex].name = newName;
        await setDoc(userDocRef, { flashcards: collections }, { merge: true });

        setFlashcards(
          flashcards.map((flashcard) =>
            flashcard.name === oldName ? { ...flashcard, name: newName } : flashcard
          )
        );

        const oldSubColRef = collection(userDocRef, oldName);
        const newSubColRef = collection(userDocRef, newName);
        const querySnapshot = await getDocs(oldSubColRef);
        const batch = writeBatch(db);

        querySnapshot.forEach((docSnapshot) => {
          const newDocRef = doc(db, `${newSubColRef.path}/${docSnapshot.id}`);
          batch.set(newDocRef, docSnapshot.data());
          batch.delete(docSnapshot.ref);
        });

        await batch.commit();
        setIsModalOpen(false);
        setName("");
      }
    } catch (error) {
      console.error("Error editing flashcard:", error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-300 text-xl">Please sign in to access your flashcards.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
        >
          Your Flashcards
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {flashcards.map((flashcard, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div 
                onClick={() => handleCardClick(flashcard.name)}
                className="cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <h2 className="text-xl font-semibold text-white mb-4">{flashcard.name}</h2>
                
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOldName(flashcard.name);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-full bg-purple-900 hover:bg-purple-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(flashcard.name);
                    }}
                    className="p-2 rounded-full bg-red-900 hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Flashcard</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setName("");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editFlashcard(oldName, name)}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors"
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