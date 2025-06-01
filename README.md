#Bug Tracker

A full-stack bug tracking system with ‘role-based access’ for Admins, Developers, and Testers. The system enables admins to manage bugs and assign them to developers, while developers can update the bug status. Testers can also track bugs they’ve reported. 


#Tech Stack
- Frontend: Next.js (with TypeScript)
- Backend: Express.js (Node.js)
- Database: MongoDB (Mongoose)
- Authentication: JWT (JSON Web Tokens) 


#Project Structure

Backend (`/src`)
- `models/` – Mongoose schemas for Bug and User
- `controllers/` – Logic for bugs, users, and authentication
- `routes/` – API endpoints grouped by feature
- `middlewares/` – Auth checks and error handling
- `config/db.js` – MongoDB connection setup
- `server.js` – Entry point for the backend server

Frontend (`/src`)
- `app/` – Next.js routing (e.g., dashboards per user role)
- `hooks/` – Custom hooks for authentication and data fetching
- `components/` – Reusable UI elements
- `types/` – TypeScript interfaces and types
- `features/page.tsx` – Core dashboard logic


#Libraries & Tools Used

Backend
express – Core web server framework for Node.js
mongoose – ODM for MongoDB, used for schema modeling and data interaction
cors – To enable communication between frontend and backend
bcryptjs – To securely hash and store passwords
dotenv – To manage sensitive data via `.env` files
express-validator – To validate request input directly in routes
jsonwebtoken – To generate and verify user tokens
Custom ‘asyncHandler’ – To streamline error handling in async routes
nodemon – Automatically restarts the server on code changes during development

Frontend
next – Framework for server-side rendered React apps with built-in routing
react – Library for building UI components
react-dom – Rendering engine for React apps
jwt-decode – Decodes JWT tokens on the client-side for user info and role checks
TypeScript & Linting
typescript – Adds static typing to JavaScript for safety and better tooling
@types/react, @types/node – Type definitions for React and Node.js
eslint + eslint-config-next – Linting setup to enforce code standards
@eslint/eslintrc – ESLint configuration system used internally
Styling
tailwindcss – Utility-first CSS framework for building modern, responsive UIs
@tailwindcss/postcss – PostCSS integration for Tailwind


#What I Learned
Through this project, I learned how to structure and manage a full-stack application within a single project folder keeping both frontend and backend organized but separate. I used: 
- ‘Custom React hooks’ to communicate with the backend for data fetching and auth
- ‘JWT-based middleware’ in the backend to secure routes and allow access only based on user roles
- ‘Frontend-level route protection’ to ensure users can only access pages relevant to their role, redirecting unauthorized attempts to a fallback error page
- ‘Clean modular design’ for better scalability and maintenance
#Additionally, working with Next.js (App Router) and TypeScript taught me: 
- The importance of ‘explicit typing’ for objects (e.g., bugs, users) to ensure type safety, reliable code, and strong IDE support.
- While I used to work with Page Router, switching to ‘App Router’ gave me more flexibility and structure. It's now considered the preferred routing method in newer Next.js apps.
- With App Router, I learned that to create a route like `/feature`, you must:
  - Create a folder named `feature/`
  - Add a `page.tsx` file inside it
- For dynamic routes like `/feature/:id`, I created a subfolder named `[id]/` inside `feature/`, and placed a `page.tsx` there. 
This structure improved my understanding of modern routing and how it integrates with backend logic in full-stack apps.


#How to Run Locally
1. Clone the repository
2. Create `.env` files for both backend and frontend with necessary config
3. Ensure MongoDB is running locally or connect to MongoDB Atlas
4. From the root:
   - Start backend: 
     npm run dev:backend
   - Start frontend:
     npm run dev:frontend


