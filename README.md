# StayLocal Platform

Tanzania's first 100% physically verified short-term rental platform.

## Project Structure

```
staylocal/
├── staylocal-app.jsx      ← React Frontend (Claude Artifact)
├── staylocal-server.js    ← Node.js Express Backend API
└── README.md
```

## Frontend Features
- Live World Cup 2026 ticker (Spain, Belgium, Germany results)
- Property search with filters (location, type, price, beds)
- Property detail pages with real Unsplash photos
- Full booking flow: dates → payment method → STK Push simulation → confirm
- Save to wishlist (heart button)
- Guest reviews + add review
- User authentication (login/register)
- My Bookings page with cancel functionality
- Toast notifications throughout
- Fully responsive

## Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/properties | List all (with filters) |
| GET | /api/properties/:id | Single property + reviews |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/user/:id | User's bookings |
| DELETE | /api/bookings/:id | Cancel booking |
| POST | /api/saved/:userId/:propId | Toggle save |
| GET | /api/saved/:userId | Get saved properties |
| POST | /api/reviews | Add review |
| POST | /api/payment/initiate | Initiate mobile money |
| POST | /api/payment/confirm | Confirm payment |
| GET | /api/stats | Platform statistics |

## Running the Backend

```bash
npm install express cors
node staylocal-server.js
# API runs at http://localhost:3001
```

## Demo Credentials
- Email: demo@staylocal.co.tz
- Password: demo123

## Payment Methods Supported
- M-Pesa (Vodacom)
- Tigo Pesa
- Airtel Money
- HaloPesa
- Visa/Mastercard
