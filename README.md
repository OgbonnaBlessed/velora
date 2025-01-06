# VELORA: Flight, Hotel and Car Booking Application.

## Project Overview
**VELORA** is a travel platform that simplifies the booking process for flights, hotels, and car rentals. Built using the MERN stack and powered by the Amadeus API, the platform ensures a seamless and comfortable travel planning experience. It addresses common challenges in travel booking, such as complex search processes, lack of personalized options, and limited access to real-time data.

## Problem Statement

### 1. Complex Travel Booking Processes
- **Challenge**: Travelers often face difficulties navigating multiple platforms to book flights, accommodations, and transportation, leading to inefficiencies and frustrations.
- **Solution**: VELORA consolidates these services into a single platform, providing users with a unified booking experience for flights, hotels, and car rentals.

### 2. Lack of Real-Time Data and Personalization
- **Challenge**: Travelers struggle to find up-to-date availability and tailored recommendations for their specific needs.
- **Solution**: With the Amadeus API, VELORA delivers real-time updates on availability, pricing, and personalized suggestions based on user preferences and travel history.

## Project Goals
- **Seamless Travel Planning**: Provide an all-in-one solution for booking flights, hotels, and car rentals.
- **Real-Time Updates**: Deliver accurate and up-to-date information on availability and pricing.
- **Enhanced User Experience**: Offer personalized recommendations, secure payments, and efficient navigation.

## Key Features
- **Unified Booking**: Search and book flights, hotels, and car rentals in one place.
- **Real-Time Data**: Access live availability and pricing through the Amadeus API.
- **Personalization**: Tailored recommendations based on user preferences and history.
- **Secure Authentication**: User accounts with secure login and session management.

## Tech Stack
### Frontend:
- **React.js**: User interface development
- **Next.js**: Server-side rendering
- **Tailwind CSS**: Styling
- **Axios**: API requests

### Backend:
- **Node.js with Express**: Server-side logic and API development.
- **MongoDB**: NoSQL database for efficient data storage.
- **JWT**: Authentication and session management.
- **Payment Integration**: Local payment system.

### Third-Party Integrations:
- **Amadeus API**: Real-time flight, hotel, and car rental data.
- **Firebase**: User authentication and media storage

## Website Pages
- **Home Page**: Introduction to the platform with quick search functionality.
- **Search Results Page**: Displays flight, hotel, and car rental options based on user queries.
- **Booking Details Page**: Provides detailed information on selected options with add-ons and reviews.
- **User Profile Page**: Manage bookings, preferences, and personal details.
- **Signin/Signup Pages**: Secure authentication for new and returning users.

## Target Users & Personas
- **Frequent Travelers**: Business professionals and leisure travelers who need efficient booking solutions.
- **Budget-Conscious Users**: Travelers seeking affordable travel packages and deals.
- **Travel Enthusiasts**: Adventurers and tourists looking for personalized recommendations.

## Git Setup and Version Control Workflow
### Repository Structure: Organized for clear separation of concerns between frontend, backend, and shared resources.

### Branching Strategy:
- **main**: Stable production-ready code.
- **develop**: Integration of new features before merging into main.
- **feature/branch-name**: Dedicated branches for individual feature development.

### Workflow:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
2. Create a new feature branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/branch-name
3. Commit your changes:
   ```bash
   git add .
   git commit -m "Added feature description"
4. Push your changes:
   ```bash
   git push origin feature/branch-name
5. Open a pull request (PR) for review before merging into develop
