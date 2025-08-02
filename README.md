# Football-Manager

This is a web application for a football fantasy manager that allows users to manage their teams and buy/sell players in a dynamic transfer market.

## Product Requirements Implemented

The application fulfills the following core product requirements:

**User Authentication**:
- Users can register and log in using their email and password.
- A single flow handles both new user registration and existing user login. If an email is not found, a new account is created.

**Team Creation**:
- Upon successful registration, a new team is automatically created for the user.
- Each new team starts with a budget of $5,000,000.
- The team is populated with 20 players, distributed as follows: 3 Goalkeepers, 6 Defenders, 6 Midfielders, and 5 Attackers.
- Team creation is handled asynchronously, and the UI provides feedback while the team is being set up.

**Transfer Market**:
- Users can browse the transfer market to view players listed by other teams.
- **Filtering**: The market can be filtered by team name, player name, minimum price, and maximum price.
- **Listing Players**: Users can add their own players to the transfer list and set a specific asking price.
- **Removing Players**: Users can remove their players from the transfer list.
- **Buying Players**: Users can purchase players from other teams at 95% of their asking price.
- **Squad Size Constraints**: Teams must maintain a squad size between 15 and 25 players at all times. This means a user cannot sell a player if their squad size would drop below 15, and they cannot buy a player if their squad size would exceed 25.

## Technical Requirements
- **Backend**: Node.js with Express.js framework. MongoDB is used as the database, managed with Mongoose.
- **Frontend**: React.js application.
- **API Structure**: RESTful API endpoints for authentication, team management, and transfer market operations.
- **Database Seeding**: A script is provided to seed the database with sample teams and players for the transfer market.

## Setup Instructions

Follow these steps to get the Football Manager application running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/RutikKulkarni/Football-Manager.git
cd Football-Manager
```

### 2. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**

Create a `.env` file in the `backend` directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/football-manager # Or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key # Use a strong, random string
FRONTEND_URL=http://localhost:3000 # Or your frontend URL if different
PORT=8082 # Or any port you prefer
```

**Seed the Database (Optional but Recommended):**

This will populate your database with sample teams and players for the transfer market.
```bash
npm run seed
```

**Run the Backend Server:**
```bash
npm start
```

The backend server will start on `http://localhost:8082` (or your specified PORT).

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**

Create a `.env` file in the `frontend` directory with the following variable:
```
REACT_APP_API_URL=http://localhost:8082/api # Ensure this matches your backend URL and port
```

**Run the Frontend Application:**
```bash
npm start
```

The frontend application will open in your browser at `http://localhost:3000`.

## Time Report

This project was completed within **4 days**. Below is a breakdown of the time spent on different sections:

**Day 1: Backend Core & Authentication**
- Project setup (Node.js, Express, Mongoose).
- User Model and Authentication (register/login logic, password hashing, JWT generation).
- Authentication middleware.
- Initial Team Model and basic creation logic.

**Day 2: Backend Player & Transfer Market Logic**
- Player Model definition.
- Integration of players into team creation.
- Transfer market API endpoints (get, add/remove from list, buy player).
- Implementation of business rules (15-25 player limit, budget calculations).
- Database seeding script development.

**Day 3: Frontend Core UI & Authentication Integration**
- React project setup.
- Global styling with Tailwind CSS.
- AuthContext and ProtectedRoute implementation.
- Login/Registration page UI and integration with backend authentication.
- Main Layout (Navbar, Sidebar) components.
- Dashboard page UI and initial data fetching.

**Day 4: Frontend Team & Transfer Market UI, Refinements**
- My Team page UI (player listing, add/remove from transfer list modals).
- Transfer Market page UI (player listing, search/filter functionality, buy player modal).
- Helper utilities (currency formatting, position formatting, debounce).
- Integration of all frontend components with backend APIs.
- Error handling and toast notifications.
- Overall UI/UX refinements and responsiveness.
