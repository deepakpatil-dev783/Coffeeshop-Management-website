# Brew & Bean Coffee Shop App

A full-stack coffee shop application with a React frontend, Express backend, MongoDB data layer, and a Streamlit analytics dashboard.

## Project Structure

- `frontend/` — React + Vite + Tailwind app
- `server/` — Express REST API with MongoDB
- `analytics/` — Python Streamlit analytics dashboard

## Features

- Customer login and signup
- Customer profile and booking flow
- Menu browsing and cart checkout
- Reservation management
- Staff dashboard
- Owner analytics dashboard
- MongoDB persistence for app data
- Streamlit analytics dashboard

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Analytics: Python, Streamlit, pandas, plotly

## Local Development

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Start MongoDB locally

Make sure MongoDB is running on:

```bash
mongodb://127.0.0.1:27017
```

### 4. Start the backend

```bash
cd server
npm start
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

Backend runs on:

```bash
http://localhost:5000
```

### 6. Start analytics dashboard

```bash
cd analytics
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Environment Variables

### Backend

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/brew_and_bean
```

For production or MongoDB Atlas:

```env
PORT=10000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/brew_and_bean
```

### Frontend

Create a `.env` file in `frontend/` for production deployment:

```env
VITE_API_URL=https://your-backend-render-url
```

## Default Accounts

- Customer: `customer@brewbean.com` / `customer123`
- Staff: `staff@brewbean.com` / `staff123`
- Admin: `admin@brewbean.com` / `admin123`

## Deployment

This project is structured for deployment on Render or similar platforms.

### Suggested Render setup

- Web Service 1: `server`
  - Build: `npm install`
  - Start: `npm start`

- Web Service 2: `frontend`
  - Build: `npm install && npm run build`
  - Start: `npm run preview -- --host 0.0.0.0 --port 10000`

## Notes

- The app is designed to seed default menu, table, reservation, and payment data when MongoDB is available.
- If MongoDB is unavailable, the backend may fall back to in-memory behavior during local testing, but production should use a real MongoDB database.

## License

This project is for educational/demo purposes.
