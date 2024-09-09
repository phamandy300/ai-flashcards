# AI-Flashcards

## Overview

**AI-Flashcards** is an innovative web application designed to facilitate language learning through interactive flashcards. Users can generate flashcards for various languages, featuring random words, their English translations, and pronunciation guides. This tool aims to enhance vocabulary retention and engage learners through quizzes and competition features, allowing for a more immersive learning experience.

## Motivation

In today's globalized world, mastering multiple languages is increasingly valuable. Traditional methods of studying vocabulary can be tedious and less impactful. AI-Flashcards addresses this by creating personalized and engaging flashcards that adapt to users' needs. By integrating gamification elements like progress tracking and competitive quizzes, this application encourages users to learn and improve their language skills effectively.

## Tech Stack

This project is built using the following technologies:

- **Next.js**: A React framework for building server-rendered applications.
- **Firebase**: A comprehensive app development platform that provides back-end services, including Firestore.
- **JavaScript**: The programming language used to develop the application.
- **Stripe**: For handling subscription payments.
- **Axios**: For making HTTP requests to generate content and interact with APIs.
- **Material-UI**: For efficient and beautiful component design.

## Installation

### Prerequisites

To set up this project locally, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- Firebase account for database setup
- Stripe account for payment processing

### Steps

1. **Clone the Repository**
bash
   git clone https://github.com/wilscooding/ai-flashcards.git

2. **Navigate into the Project Directory**
bash
   cd ai-flashcards

3. **Install Dependencies**
bash
   npm install

4. **Set Up Environment Variables**
   Create a `.env.local` file in the root of your project with the following:

STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key


5. **Run the Application**
   Start the development server:

bash
   npm run dev

   Open your browser and go to `http://localhost:3000` to access the application.

## Usage

### Generating Flashcards

1. **Start Flashcard Generation**: Navigate to the "Generate" page.
2. **Input Text**: Enter text in the field to generate flashcards for the target language.
3. **Submit**: Click the "Submit" button to create flashcards.
4. **Preview Flashcards**: Upon generation, flashcards will be displayed for you to study.

### Studying Flashcards

- Use the interactive cards to flip and review words, their meanings, and pronunciations.

## Features

- **AI-Powered Flashcard Generation**: Generates flashcards based on user input in various languages.
- **Pronunciation Guides**: Each flashcard includes pronunciation information to aid in language mastery.

## Future Features

- **Progress Tracking**: Users can monitor their learning levels and improvements.
- **Quiz Functionality**: Engage in quizzes to challenge yourself and reinforce vocabulary retention.
- **Competition Aspect**: Compete with friends or users to enhance engagement and motivation.

## Contributing

Contributions are welcome! If you'd like to help improve the AI-Flashcards project, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add your message"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.
