"use client";

import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

export default function Generate() {
	const [text, setText] = useState("");
	const [flashcards, setFlashcards] = useState([]);

	const handleSubmit = async () => {
		if (!text.trim()) {
			alert("Please enter some text to generate flashcards.");
			return;
		}

		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				body: text,
			});

			if (!response.ok) throw new Error("Failed to generate flashcards");

			const data = await response.json();
			setFlashcards(data);
      const saveFlashcards = async () => {
				const batch = writeBatch(db);
				const userDocRef = doc(collection(db, "users"), user.id);
				batch.set(userDocRef, { flashcards });

				await batch.commit();
				alert("Flashcards saved successfully!");
			};
		} catch (error) {
			console.error("Error generating flashcards:", error);
			alert(
				"An error occurred while generating flashcards. Please try again."
			);
		}
	};

	return (
		<Container maxWidth="md">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Generate Flashcards
				</Typography>
				<TextField
					value={text}
					onChange={(e) => setText(e.target.value)}
					label="Enter text"
					fullWidth
					multiline
					rows={4}
					variant="outlined"
					sx={{ mb: 2 }}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					fullWidth
				>
					Generate Flashcards
				</Button>
				{flashcards.length > 0 && (
					<Box sx={{ mt: 4 }}>
						<Typography variant="h5" component="h2" gutterBottom>
							Generated Flashcards
						</Typography>
						{flashcards.map((flashcard, index) => (
							<Box key={index}>
								<Typography variant="h6">Front: {flashcard.front}</Typography>
								<Typography>Back: {flashcard.back}</Typography>
							</Box>
						))}
					</Box>
				)}
			</Box>
		</Container>
	);
}