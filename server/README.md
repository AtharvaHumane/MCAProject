# Server

Express and MongoDB backend for the MCAProject salon booking app.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

## Setup

```bash
npm install
npm start
```

The server starts on port `5000` and connects to:

```text
mongodb://127.0.0.1:27017/salon
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/owners`
- `GET /api/auth/cart/:userId`
- `PUT /api/auth/cart/:userId`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/owner/:ownerId`
- `PUT /api/bookings/accept/:id`
- `PUT /api/bookings/reject/:id`
- `PUT /api/bookings/:id`

## Notes

- The server currently stores the MongoDB connection string directly in `server.js`.
- If you want, you can later move that into environment variables.
