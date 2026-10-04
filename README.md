MERN Stack Project
A web application built while learning the MERN stack: MongoDB, Express.js, React, and Node.js.
Project Status
This project is under active development. Features and documentation will be updated as development progresses.
Tech Stack
Layer	Technology
Frontend	React
Backend	Node.js and Express.js
Database	MongoDB
Version Control	Git and GitHub


Run Locally
The commands below assume folders named backend and frontend. Replace these with your actual folder names. Check each folder's package.json for its available start scripts.
1. Clone the repository
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_FOLDER>
2. Set up the backend
cd backend
npm install
Create a .env file if your backend uses environment variables. If an .env.example file exists, copy it to .env and fill in your local configuration.
Typical configuration (use the exact variable names expected by your code):
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
Use JWT_SECRET only if the project uses JWT authentication. Ensure the backend loads its environment configuration.
Run the backend using the script defined in package.json, for example:
npm run dev
If there is no development script and your entry file is server.js, run:
node server.js
3. Set up the frontend
Open another terminal from the project root:
cd frontend
npm install
npm run dev
Open the URL printed by the frontend development server. Ensure the frontend API URL and backend CORS settings match your local ports.
Configuration and Security
- Keep database credentials and authentication secrets in the backend environment configuration.
- Exclude .env, node_modules, build output, and private uploads from Git.
- Commit dependency files such as package.json and package-lock.json.
- Never place backend secrets in frontend environment variables.
Author
Suryadeep Sinh Jadeja
Built as part of my journey to become a MERN stack developer.
