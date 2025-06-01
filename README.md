
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

Through this project, I learned how to structure and manage a full-stack application inside one project while keeping the frontend and backend modular.

### Key Concepts:
- ✅ **Custom React Hooks** – For auth and data communication  
- ✅ **JWT-based Middleware (Backend)** – To secure protected routes  
- ✅ **Frontend Route Protection** – Redirect unauthorized users and guard pages  
- ✅ **Clean Modular Design** – Easier to scale and maintain

### Next.js App Router + TypeScript:
- I learned how **explicit typing** improves IDE support and reduces bugs
- Switched from Page Router to **App Router**, which offers:
  - Better structure
  - Cleaner routing logic
- For example, to create `/feature`:
  - Make folder: `feature/`
  - Add file: `page.tsx`
- For dynamic routes like `/feature/:id`:
  - Make folder: `feature/[id]/`
  - Add file: `page.tsx`

This helped me understand modern routing and how frontend and backend integrate in a full-stack setup.

---

## 🚀 How to Run Locally

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/bug-tracker.git
