"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
  setDoc,
  getFirestore,
} from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { db, auth } from "../../firebase"; // Make sure these are properly exported from your firebase.js

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Handle Firebase Authentication with Clerk
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

  // Fetch flashcards only after Firebase authentication is complete
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

  if (!isLoaded || !isSignedIn) {
    return <Typography>Please sign in to access your flashcards.</Typography>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleOpen = (flashcardName) => {
    setOpen(true);
    setOldName(flashcardName);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const editFlashcard = async (oldName, newName) => {
    if (!isAuthenticated) return;
    
    if (!newName) {
      alert("Please enter a new name");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        let collections = docSnap.data().flashcards || [];
        const flashcardIndex = collections.findIndex((f) => f.name === oldName);
        
        if (collections.some((f) => f.name === newName)) {
          alert("A flashcard with this name already exists. Please choose a different name.");
          return;
        }

        if (flashcardIndex === -1) {
          alert("Flashcard collection not found");
          return;
        }

        collections[flashcardIndex].name = newName;
        await setDoc(userDocRef, { flashcards: collections }, { merge: true });

        setFlashcards(
          flashcards.map((flashcard) => {
            if (flashcard.name === oldName) {
              return { ...flashcard, name: newName };
            }
            return flashcard;
          })
        );

        const oldSubColRef = collection(userDocRef, oldName);
        const newSubColRef = collection(userDocRef, newName);

        const querySnapshot = await getDocs(oldSubColRef);
        const batch = writeBatch(db);

        querySnapshot.forEach((docSnapshot) => {
          const oldDocRef = docSnapshot.ref;
          const newDocRef = doc(db, `${newSubColRef.path}/${docSnapshot.id}`);
          batch.set(newDocRef, docSnapshot.data());
          batch.delete(oldDocRef);
        });

        await batch.commit();
        handleClose();
      }
    } catch (error) {
      console.error("Error editing flashcard:", error);
    }
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                display: "flex",
                p: 2,
                mb: 2,
                bgcolor: "#fff",
                boxShadow: 3,
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(flashcard.name)}
                sx={{ flex: 1 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: "1.2rem", color: "#333" }}
                  >
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 1,
                }}
              >
                <Button
                  sx={{
                    mb: 1,
                    backgroundColor: "#87CEEB",
                    "&:hover": {
                      backgroundColor: "#0000FF",
                    },
                    borderRadius: 1,
                    p: 1,
                  }}
                  onClick={() => handleOpen(flashcard.name)}
                >
                  <EditIcon sx={{ fontSize: "1.9rem" }} />
                </Button>
                <Button
                  sx={{
                    mb: 1,
                    backgroundColor: "#FF7F7F",
                    "&:hover": {
                      backgroundColor: "#FF0000",
                    },
                    borderRadius: 1,
                    p: 1,
                  }}
                  onClick={() => handleDelete(flashcard.name)}
                >
                  <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a name for the flashcard collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => editFlashcard(oldName, name)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}