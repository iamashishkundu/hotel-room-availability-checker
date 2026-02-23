# Hotel Room Availability Checker

Full-stack hotel booking app — search rooms by date/type, book them, manage everything from an admin panel.

**Live:** [hotel-room-availability-checker.vercel.app](https://hotel-room-availability-checker.vercel.app) | **API:** [hotel-availability-api-5stf.onrender.com](https://hotel-availability-api-5stf.onrender.com/api/health)

*(Render free tier — first load might take ~30s to wake up)*

**Tech:** React, Node/Express, MongoDB

## What it does

- Pick check-in/check-out dates + room type, see what's available
- Book a room — server checks for date overlaps so double-bookings can't happen
- Get a confirmation page with all the details
- Admin page (`/admin`) lists every booking, lets you cancel any of them
- DB comes pre-seeded with 12 rooms (Single/Double/Suite/Deluxe) and a few sample bookings

## Running locally

You'll need Node 18+ and a MongoDB instance (local or Atlas).

```bash
# clone it
git clone https://github.com/iamashishkundu/hotel-room-availability-checker.git
cd hotel-room-availability-checker

# backend
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-availability
```

```bash
# seed the db (12 rooms + sample bookings)
npm run seed

# start the server
npm run dev
```

```bash
# frontend (new terminal)
cd frontend
npm install
```

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start
# opens at localhost:3000
```

## API

**Rooms**

- `GET /api/rooms` — all active rooms
- `GET /api/rooms/availability?checkIn=...&checkOut=...&type=...` — available rooms for a date range. `type` is optional (Single/Double/Suite/Deluxe)

**Bookings**

- `GET /api/bookings` — all bookings
- `GET /api/bookings/:id` — single booking
- `POST /api/bookings` — create a booking
  ```json
  {
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "roomId": "mongo_object_id",
    "checkIn": "2026-03-01",
    "checkOut": "2026-03-05"
  }
  ```
- `PATCH /api/bookings/:id/cancel` — cancel a booking

**Health:** `GET /api/health`

## Deployment

Backend is on Render, frontend on Vercel. If you're deploying your own:

**Backend (Render):** root dir `backend`, build `npm install`, start `node server.js`, set `MONGODB_URI` env var

**Frontend (Vercel):** root dir `frontend`, set `REACT_APP_API_URL` to your backend URL + `/api`

## Env vars

| Variable | Where | What |
|----------|-------|------|
| `MONGODB_URI` | backend | Mongo connection string |
| `PORT` | backend | defaults to 5000 |
| `REACT_APP_API_URL` | frontend | backend URL ending in `/api` |

All config lives in `.env` files, which are gitignored.
