"use client";

import getStripe from "@/utils/get-stripe";
import { styled } from "@mui/material/styles";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import {

	FaLinkedinIn,
} from "react-icons/fa";
import {
	AppBar,
	Box,
	Container,
	Grid,
	Typography,
	IconButton,
	Paper,
} from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

// Styled component for gradient text
const GradientText = styled(Typography)(({ theme }) => ({
	background: "linear-gradient(45deg, #f06, #ff7e5f)",
	WebkitBackgroundClip: "text",
	WebkitTextFillColor: "transparent",
	fontSize: "3rem",
	fontWeight: "bold",
}));

// Language Learning App Features
const features = [
	{
		title: "Immersive Learning",
		description:
			"Transform your language learning experience with interactive flashcards designed to immerse you in the new language. Practice vocabulary, phrases, and grammar with ease.",
	},
	{
		title: "Personalized Flashcards",
		description:
			"Our AI generates flashcards tailored to your learning needs. Add your own content, or use our smart algorithms to create flashcards from texts and documents.",
	},
	{
		title: "Accessible Anytime",
		description:
			"Study and review flashcards on any device, whether you’re at home or on the go. Your progress is synced across devices, so you can pick up right where you left off.",
	},
];

// Pricing Plans
const pricingPlans = [
	{
		title: "Free Tier",
		price: "$0",
		features: [
			"Basic Flashcards",
			"Limited Flashcard Creation",
			"Access to Community Support",
		],
	},
	{
		title: "Basic Tier",
		price: "$9.99/month",
		features: [
			"Unlimited Flashcards",
			"Personalized Content",
			"Priority Support",
		],
	},
	{
		title: "Pro Tier",
		price: "$19.99/month",
		features: [
			"All Basic Tier Features",
			"Advanced Analytics",
			"Custom Themes",
			"One-on-One Coaching",
		],
	},
];

export default function Home() {
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

	const handleSubmit = async (amount) => {
		try {
			const checkoutSession = await fetch(`/api/checkout_session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					origin: "http://localhost:3000",
				},
				body: JSON.stringify({ amount: Number(amount) }),
			});

			const checkoutSessionJson = await checkoutSession.json();

			if (checkoutSession.status === 500) {
				console.error(
					"Error creating checkout session:",
					checkoutSessionJson.error
				);
				return;
			}

			const stripe = await getStripe();
			const { error } = await stripe.redirectToCheckout({
				sessionId: checkoutSessionJson.id,
			});

			if (error) {
				console.warn(error.message);
			}
		} catch (error) {
			console.error("An error occurred:", error);
		}
	};

	return (
		<Container maxWidth="100vw" disableGutters>
			<Head>
				<title>Language Learning Flashcards</title>
				<meta
					name="description"
					content="Enhance your language skills with interactive flashcards"
				/>
			</Head>
			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
					color: "#212529",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						flexDirection: "column",
						py: 8,
					}}
				>
					<Typography
						variant="h2"
						sx={{ fontSize: "2.5rem", fontWeight: "bold", mb: 2 }}
					>
						<GradientText >Welcome {dynamicText}</GradientText>
					</Typography>
					<Typography variant="h5" sx={{ mb: 4, color: "#000000" }}>
						Dive into language learning with our interactive and AI-powered
						flashcards
					</Typography>
					<IconButton
						sx={{
							mt: 2,
							width: 150,
							height: 150,
							borderRadius: "50%",
							border: "3px solid",
							borderColor: "#007bff",
							backgroundColor: "#0056b3",
							color: "#fff",
							"&:hover": {
								borderColor: "#0056b3",
								backgroundColor: "#004085",
							},
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							p: 2,
						}}
						href="/generate"
					>
						<Typography
							variant="body2"
							sx={{ color: "white", mb: 1, fontSize: "1.2rem" }}
						>
							Start Your Journey <ArrowOutwardIcon sx={{ color: "white" }} />
						</Typography>
					</IconButton>
				</Box>

				<Box sx={{ my: 6, textAlign: "center", px: 2 }}>
					<Typography variant="h4" gutterBottom sx={{ color: "#000000" }}>
						Key Features
					</Typography>
					<Typography variant="body1" paragraph sx={{ color: "#000000" }}>
						Discover how our flashcard app enhances your language learning
						experience with these standout features:
					</Typography>
					<Grid container spacing={4} justifyContent="center">
						{features.map((feature, index) => (
							<Grid item xs={12} sm={4} key={index}>
								<Paper
									sx={{
										p: 3,
										backgroundColor: "rgba(255, 255, 255, 0.1)",
										borderRadius: 2,
										boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
									}}
								>
									<Typography
										variant="h6"
										gutterBottom
										sx={{ color: "#000000" }}
									>
										{feature.title}
									</Typography>
									<Typography
										variant="body2"
										paragraph
										sx={{ color: "#000000" }}
									>
										{feature.description}
									</Typography>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Box>

				{/* <Box sx={{ my: 6, textAlign: "center", px: 2, color: "#000000" }}>
					<Typography variant="h4" gutterBottom sx={{ color: "#000000" }}>
						Pricing Plans
					</Typography>
					<Typography variant="body1" paragraph sx={{ color: "#000000" }}>
						Choose a plan that fits your learning needs:
					</Typography>
					<Grid container spacing={4} justifyContent="center">
						{pricingPlans.map((plan, index) => (
							<Grid item xs={12} sm={4} key={index}>
								<Paper
									sx={{
										p: 3,
										backgroundColor: "rgba(255, 255, 255, 0.1)",
										borderRadius: 2,
										boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
										textAlign: "center",
									}}
								>
									<Typography
										variant="h5"
										gutterBottom
										sx={{ color: "#000000" }}
									>
										{plan.title}
									</Typography>
									<Typography
										variant="h6"
										gutterBottom
										sx={{ color: "#000000" }}
									>
										{plan.price}
									</Typography>
									<ul>
										{plan.features.map((feature, i) => (
											<li key={i} style={{ color: "#000000" }}>
												{feature}
											</li>
										))}
									</ul>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Box> */}

				<Box
					sx={{
						py: 4,
						textAlign: "center",
						backgroundColor: "#343a40",
						color: "#fff",
					}}
				>
					<Typography variant="body2">
						&copy; 2024 Language Learning Flashcards. All rights reserved.
					</Typography>
					<Box sx={{ mt: 2 }}>
						<IconButton
							color="inherit"
							href="https://www.linkedin.com/in/andy-pham-03454a25a/"
							target="_blank"
							rel="noopener"
						>
							<FaLinkedinIn />
						</IconButton>
						{/* Placeholder for the Second LinkedIn Icon */}
						<IconButton
							color="inherit"
							href="https://linkedin.com"
							target="_blank"
							rel="noopener"
						>
							<FaLinkedinIn />
						</IconButton>
						{/* Placeholder for the Third LinkedIn Icon */}
						<IconButton
							color="inherit"
							href="https://linkedin.com"
							target="_blank"
							rel="noopener"
						>
							<FaLinkedinIn />
						</IconButton>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
