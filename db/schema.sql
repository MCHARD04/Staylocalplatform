CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest',
  saved INTEGER[] DEFAULT '{}',
  created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price INTEGER NOT NULL,
  type TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT true,
  available BOOLEAN DEFAULT true,
  image TEXT,
  amenities TEXT[] DEFAULT '{}',
  beds INTEGER DEFAULT 1,
  baths INTEGER DEFAULT 1,
  guests INTEGER DEFAULT 2,
  description TEXT,
  host_id INTEGER REFERENCES users(id),
  host_name TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  property_id INTEGER REFERENCES properties(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  total INTEGER NOT NULL,
  service_fee INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  payment_method TEXT,
  property_title TEXT,
  property_image TEXT,
  property_location TEXT,
  host_id INTEGER,
  host_name TEXT,
  cancel_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  checked_in_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  user_id INTEGER REFERENCES users(id),
  user_name TEXT,
  rating INTEGER,
  comment TEXT,
  date DATE DEFAULT CURRENT_DATE,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_name TEXT,
  email TEXT,
  role TEXT,
  event TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER,
  user_id INTEGER,
  amount INTEGER,
  phone TEXT,
  provider TEXT,
  card_last4 TEXT,
  card_name TEXT,
  card_expiry TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  azam_transaction_id TEXT,
  external_id TEXT,
  mode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS property_requests (
  id SERIAL PRIMARY KEY,
  title TEXT,
  location TEXT,
  host_name TEXT,
  phone TEXT,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  date DATE DEFAULT CURRENT_DATE,
  price INTEGER,
  type TEXT,
  description TEXT,
  beds INTEGER,
  baths INTEGER,
  max_guests INTEGER,
  amenities TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]'
);
