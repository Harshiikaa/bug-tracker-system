
# 🐞 Bug Tracker

A full-stack bug tracking system with **role-based access** for Admins, Developers, and Testers.  
Admins can manage bugs and assign them to developers, developers can update bug statuses, and testers can track the bugs they’ve reported.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (with TypeScript)
- **Backend**: Express.js (Node.js)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)

---

## 🗂 Project Structure

### Backend (`/src`)
- `models/` – Mongoose schemas for Bug and User  
- `controllers/` – Logic for bugs, users, and authentication  
- `routes/` – API endpoints grouped by feature  
- `middlewares/` – Auth checks and error handling  
- `config/db.js` – MongoDB connection setup  
- `server.js` – Entry point for the backend server  

### Frontend (`/src`)
- `app/` – Next.js routing (e.g., dashboards per user role)  
- `hooks/` – Custom hooks for authentication and data fetching  
- `components/` – Reusable UI elements  
- `types/` – TypeScript interfaces and types  
- `features/page.tsx` – Core dashboard logic  

---

## 📦 Libraries & Tools Used

### Backend
- **express** – Core web server framework  
- **mongoose** – MongoDB ODM for schema modeling  
- **cors** – Enable frontend-backend communication  
- **bcryptjs** – Securely hash passwords  
- **dotenv** – Manage secrets using `.env`  
- **express-validator** – Validate input at route level  
- **jsonwebtoken** – Handle JWT-based auth  
- **asyncHandler** – Custom wrapper to handle async errors  
- **nodemon** – Auto-restarts server in development  

### Frontend
- **next** – Full-stack React framework with routing  
- **react / react-dom** – UI building and rendering  
- **jwt-decode** – Decode JWT on client-side  

### TypeScript & Linting
- **typescript** – Add type safety  
- **@types/react**, **@types/node** – Type definitions  
- **eslint + eslint-config-next** – Linting for clean code  
- **@eslint/eslintrc** – ESLint configuration  

### Styling
- **tailwindcss** – Utility-first CSS framework  
- **@tailwindcss/postcss** – PostCSS integration  

---


## 📘 What I Learned

Through this project, I learned how to structure and manage a full-stack application within a single project folder, keeping both frontend and backend organized but separate. I used:

- **Custom React hooks** to communicate with the backend for data fetching and authentication  
- **JWT-based middleware** in the backend to secure routes and allow access only based on user roles  
- **Frontend-level route protection** to ensure users can only access pages relevant to their role, redirecting unauthorized attempts to a fallback error page  
- **Clean modular design** for better scalability and maintenance  

### 🧠 Working with Next.js (App Router) and TypeScript taught me:

- The importance of **explicit typing** for objects (e.g., bugs, users) to ensure type safety, more reliable code, and strong IDE support  
- While I used to work with the Page Router, switching to the **App Router** gave me more flexibility and structure. It's now the preferred routing method in modern Next.js apps  
- With the App Router, I learned how to structure routes:
  - To create a route like `/feature`, you must:
    - Create a folder named `feature/`
    - Add a `page.tsx` file inside it
  - For dynamic routes like `/feature/:id`:
    - Create a subfolder named `[id]/` inside `feature/`
    - Place a `page.tsx` file inside it

This structure helped me understand modern routing and how frontend and backend logic integrate effectively in a full-stack app.

---

## 🛠 How to Run Locally

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
  
   npm run dev:backend
   npm run dev:frontend
