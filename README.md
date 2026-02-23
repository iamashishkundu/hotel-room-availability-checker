# Hotel Room Availability Checker

A full-stack web application to search for available hotel rooms by date range and room type, then simulate a booking. Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## Features

- Search rooms by check-in/check-out dates and room type
- Real-time availability checking with date-overlap detection
- Booking flow with server-side double-booking prevention
- Confirmation page with full booking details
- Admin panel to view and cancel bookings
- Pre-seeded database with 12 rooms and 6 bookings

---

## Folder Structure

```
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/
│   │   ├── Room.js           # Room schema
│   │   └── Booking.js        # Booking schema
│   ├── routes/
│   │   ├── rooms.js          # Room endpoints
│   │   └── bookings.js       # Booking endpoints
│   ├── seed.js               # Database seeder
│   ├── server.js             # Express entry point
│   ├── package.json
│   └── .env                  # Environment variables (not committed)
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── api.js            # Axios API client
│   │   ├── App.js            # Routes
│   │   ├── index.js          # React entry
│   │   ├── index.css         # Global styles
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   └── pages/
│   │       ├── SearchPage.js
│   │       ├── ResultsPage.js
│   │       ├── BookingPage.js
│   │       ├── ConfirmationPage.js
│   │       └── AdminPage.js
│   ├── package.json
│   └── .env                  # Environment variables (not committed)
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or MongoDB Atlas)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd Hotel-Room-Availability-Checker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-availability
```

> For MongoDB Atlas, replace the URI with your connection string.

### 3. Seed the database

```bash
npm run seed
```

This inserts **12 rooms** (3 Single, 3 Double, 3 Suite, 3 Deluxe) and **6 bookings** spread across the next 30 days.

### 4. Start the backend

```bash
npm run dev
# or
npm start
```

The API runs on `http://localhost:5000`.

### 5. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start the frontend

```bash
npm start
```

Opens at `http://localhost:3000`.

---

## API Endpoints

### Rooms

| Method | Endpoint                 | Description                                      |
|--------|--------------------------|--------------------------------------------------|
| GET    | `/api/rooms`             | List all active rooms                            |
| GET    | `/api/rooms/availability`| Check availability by date range & type          |

**Query Parameters for `/api/rooms/availability`:**

| Param    | Required | Description                            |
|----------|----------|----------------------------------------|
| checkIn  | Yes      | ISO 8601 date string                   |
| checkOut | Yes      | ISO 8601 date string (must be > checkIn)|
| type     | No       | `Single`, `Double`, `Suite`, `Deluxe`, or `All` |

### Bookings

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/bookings`             | List all bookings        |
| GET    | `/api/bookings/:id`         | Get a single booking     |
| POST   | `/api/bookings`             | Create a new booking     |
| PATCH  | `/api/bookings/:id/cancel`  | Cancel a booking         |

**POST `/api/bookings` body:**

```json
{
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "roomId": "<room_object_id>",
  "checkIn": "2026-03-01T00:00:00.000Z",
  "checkOut": "2026-03-05T00:00:00.000Z"
}
```

### Health

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | `/api/health`  | Health check   |

---

## Data Models

### Room

| Field         | Type     | Description                                  |
|---------------|----------|----------------------------------------------|
| roomNumber    | String   | Unique room identifier                       |
| type          | String   | `Single` / `Double` / `Suite` / `Deluxe`     |
| pricePerNight | Number   | Cost per night in USD                        |
| maxOccupancy  | Number   | Maximum number of guests                     |
| amenities     | [String] | List of amenities                            |
| isActive      | Boolean  | Whether the room is available for booking    |

### Booking

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| guestName  | String   | Full name of the guest                      |
| guestEmail | String   | Email address                               |
| room       | ObjectId | Reference to Room                           |
| checkIn    | Date     | Check-in date                               |
| checkOut   | Date     | Check-out date                              |
| totalPrice | Number   | Auto-calculated (nights × pricePerNight)    |
| status     | String   | `confirmed` or `cancelled`                  |

---

## Deployment

### Backend (Railway / Render)

1. Push to GitHub
2. Connect your repo on [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `PORT` — (Railway/Render set this automatically)
4. Build command: `npm install`
5. Start command: `npm start`
6. After deploy, run the seed script once: `npm run seed`

### Frontend (Vercel / Netlify)

1. Connect frontend folder or set root directory to `frontend/`
2. Set environment variable:
   - `REACT_APP_API_URL` — your deployed backend URL + `/api`
3. Build command: `npm run build`
4. Publish directory: `build`

---

## Environment Variables

| Variable          | Location | Description                      |
|-------------------|----------|----------------------------------|
| `MONGODB_URI`     | Backend  | MongoDB connection string        |
| `PORT`            | Backend  | Server port (default: 5000)      |
| `REACT_APP_API_URL`| Frontend| Backend API base URL             |

> **Never hardcode credentials.** All sensitive config uses `.env` files excluded by `.gitignore`.

---

## License

MIT
