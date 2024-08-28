# Async Race - Car Racing SPA

## 📜 Project Description

This project is a Single Page Application (SPA) designed to manage a collection of cars, operate their engines, and showcase race statistics. The application allows users to engage in racing competitions, managing and racing cars via a user-friendly interface.

The project was inspired by a challenge to recreate a nearly-completed application after the original developer lost their work. With the demo video and a server mock as references, this application has been meticulously reconstructed with a focus on speed, efficiency, and modular architecture. The goal was to outpace competitors by delivering an innovative solution to car management and racing competitions.

## 🎯 Objectives

- **Create a Single Page Application (SPA):** Manage a collection of cars, operate their engines, and showcase race statistics in an engaging, interactive SPA.
- **Revive the Project:** Reconstruct the UI from a demo video and server mock, bringing the ambitious project back to life.
- **Outpace the Competition:** Implement the project with speed and efficiency to ensure a timely launch, showcasing our innovative solution.

## 🚗 Functional Requirements

### Garage View

- **CRUD Operations:** Manage cars with "name" and "color" attributes.
- **Color Selection:** Choose car colors from an RGB palette with a real-time preview.
- **Pagination:** Display up to 7 cars per page with a feature to generate 100 random cars at once.
- **Car Animation:** Start/stop engine buttons with animations and handling of engine states.
- **Adaptive Animations:** Ensure animations work seamlessly on screens as small as 500px.
- **Race Animation:** Start a race for all cars on the current page with reset functionality and display of the winner's name.

### Winners View

- **Display Winning Cars:** Show cars with their image, name, number of wins, and best time.
- **Sorting and Pagination:** Sort winners by wins and best times with pagination support.

## 🛠️ Technical Implementation

- **Pure TypeScript:** No libraries or frameworks used, with a focus on strong typing and modular architecture.
- **SPA Implementation:** Content is generated via TypeScript, bundled using Webpack.
- **Code Quality:** Adherence to Airbnb's ESLint configuration, with a focus on clean, maintainable code.

## 🚀 Running the Project

To experience the application, follow these steps:

1. **Clone the Repository:** Retrieve the project from the GitHub repository. You can also use the [deploy](https://rolling-scopes-school.github.io/juliabel5-JSFE2023Q4/async-race/)
2. **Install Dependencies:** Ensure Node.js is installed, then install the necessary packages.
3. **Launch the Server:** The application uses a server mock to manage car data and race operations. Start the server by following the instructions provided in the [server repository](https://github.com/mikhama/async-race-api).
4. **Start the Application:** Once the server is running, start the development server and open your browser to interact with the application.

Enjoy!
