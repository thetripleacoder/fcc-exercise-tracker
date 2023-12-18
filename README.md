# Exercise Tracker

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

Certainly! Below is a sample **README** for the **Exercise Tracker Microservice** backend application. Feel free to customize it further based on your project's specifics:

---

# Exercise Tracker Microservice

This project is a solution to the **Exercise Tracker Microservice** backend certification project from **freeCodeCamp**. It provides an API endpoint for tracking and managing exercise data.

## Project URL

You can access the live version of this microservice here: [Exercise Tracker Microservice](https://fcc-exercise-tracker-kappa.vercel.app/)

## User Stories

1. You can **POST** a new user to `/api/users` and receive a JSON response with the newly created user object.
2. You can **GET** all users to `/api/users` and receive a JSON response with a list of all users.
3. You can **POST** an exercise to `/api/users/:_id/exercises` and receive a JSON response with the user object with the exercise fields added.
4. You can **GET** a user's exercise log from `/api/users/:_id/logs` with optional parameters for filtering by date range and limiting the number of exercises returned using `/api/users/:_id/logs?[from][&to][&limit]`.

## Built With

- Node.js
- Express.js
- MongoDB (using Mongoose)

## Getting Started

1. Clone this repository or use the provided starter project.
2. Install dependencies using `npm install`.
3. Set up your MongoDB connection in the `.env` file.
4. Run the server using `npm start` or `npm run dev`.
5. On the HTML page, create a new user and add exercises by filling up respective forms.
6. Follow additional instructions for limiting user's exercise logs.
