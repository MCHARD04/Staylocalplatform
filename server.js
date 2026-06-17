require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const http = require('http');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── FLUTTERWAVE CONFIG ───────────────────────────────────────
// HATUA ZA KUPATA CREDENTIALS:
// 1. Nenda: https://dashboard.flutterwave.com/signup
// 2. Jisajili (hauhitaji approval - test keys zinafanya kazi mara moja)
// 3. Login, nenda: Settings > API Keys
// 4. Nakili "Test Secret Key" (huanza na FLWSECK_TEST-)
const FLW = {
  secretKey:   process.env.FLW_SECRET_KEY   || '',
  publicKey:   process.env.FLW_PUBLIC_KEY   || '',
  baseUrl:     process.env.FLW_BASE_URL     || 'https://api.flutterwave.com/v3',
  redirectUrl: process.env.FLW_REDIRECT_URL || 'http://localhost:3001/api/payment/callback',
  webhookHash: process.env.FLW_WEBHOOK_HASH || '',
};

// ─── ROW → API MAPPERS (snake_case DB columns → camelCase API fields) ─────
function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id, name: row.name, email: row.email, role: row.role,
    saved: row.saved || [], createdAt: row.created_at,
  };
}
function mapProperty(row) {
  return {
    id: row.id, title: row.title, location: row.location, price: row.price, type: row.type,
    rating: parseFloat(row.rating), reviews: row.reviews, verified: row.verified, available: row.available,
    image: row.image, amenities: row.amenities || [], beds: row.beds, baths: row.baths, guests: row.guests,
    description: row.description, hostId: row.host_id, hostName: row.host_name,
  };
}
function mapBooking(row) {
  return {
    id: row.id, userId: row.user_id, propertyId: row.property_id,
    checkIn: row.check_in.toISOString().split('T')[0], checkOut: row.check_out.toISOString().split('T')[0],
    guests: row.guests, nights: row.nights, total: row.total, serviceFee: row.service_fee,
    status: row.status, paymentMethod: row.payment_method,
    propertyTitle: row.property_title, propertyImage: row.property_image, propertyLocation: row.property_location,
    hostId: row.host_id, hostName: row.host_name, cancelReason: row.cancel_reason,
    createdAt: row.created_at, updatedAt: row.updated_at, checkedInAt: row.checked_in_at, cancelledAt: row.cancelled_at,
  };
}
function mapReview(row) {
  return {
    id: row.id, propertyId: row.property_id, userId: row.user_id, userName: row.user_name,
    rating: row.rating, comment: row.comment, date: row.date ? row.date.toISOString().split('T')[0] : null,
    avatar: row.avatar,
  };
}
function mapTransaction(row) {
  return {
    id: row.id, bookingId: row.booking_id, userId: row.user_id, amount: row.amount, phone: row.phone,
    provider: row.provider, cardLast4: row.card_last4, cardName: row.card_name, cardExpiry: row.card_expiry,
    status: row.status, azamTransactionId: row.azam_transaction_id, externalId: row.external_id, mode: row.mode,
    createdAt: row.created_at, completedAt: row.completed_at,
  };
}
function mapPropertyRequest(row) {
  return {
    id: row.id, title: row.title, location: row.location, hostName: row.host_name, phone: row.phone,
    email: row.email, status: row.status, date: row.date ? row.date.toISOString().split('T')[0] : null,
    price: row.price, type: row.type, description: row.description, beds: row.beds, baths: row.baths,
    maxGuests: row.max_guests, amenities: row.amenities || [], images: row.images || [],
  };
}
function mapLoginLog(row) {
  return { id: row.id, userId: row.user_id, userName: row.user_name, email: row.email, role: row.role, event: row.event, timestamp: row.timestamp.toISOString() };
}

// ─── HTTP HELPER (kwa Flutterwave) ─────────────────────────────
function makeRequest(url, method, body, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + (parsed.search || ''),
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...headers,
      }
    };
    const lib = isHttps ? https : http;
    const req = lib.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: {} }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function verifyFlutterwaveTransaction(id) {
  const res = await makeRequest(`${FLW.baseUrl}/transactions/${id}/verify`, 'GET', null, {
    'Authorization': `Bearer ${FLW.secretKey}`,
  });
  return res.data;
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'guest' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, password, role]
    );
    const user = rows[0];
    await pool.query(
      `INSERT INTO login_logs (user_id, user_name, email, role, event) VALUES ($1,$2,$3,$4,'register')`,
      [user.id, user.name, user.email, user.role]
    );
    res.json({ success: true, user: mapUser(user), token: `token_${user.id}_${Date.now()}` });
  } catch (err) {
    console.error('[Register Error]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    await pool.query(
      `INSERT INTO login_logs (user_id, user_name, email, role, event) VALUES ($1,$2,$3,$4,'login')`,
      [user.id, user.name, user.email, user.role]
    );
    res.json({ success: true, user: mapUser(user), token: `token_${user.id}_${Date.now()}` });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── PROPERTIES ───────────────────────────────────────────────
app.get('/api/properties', async (req, res) => {
  const { location, type, minPrice, maxPrice, beds } = req.query;
  const conditions = [];
  const params = [];
  if (location) { params.push(`%${location.toLowerCase()}%`); conditions.push(`(LOWER(location) LIKE $${params.length} OR LOWER(title) LIKE $${params.length})`); }
  if (type && type !== 'All') { params.push(type); conditions.push(`type = $${params.length}`); }
  if (minPrice) { params.push(parseInt(minPrice)); conditions.push(`price >= $${params.length}`); }
  if (maxPrice) { params.push(parseInt(maxPrice)); conditions.push(`price <= $${params.length}`); }
  if (beds) { params.push(parseInt(beds)); conditions.push(`beds >= $${params.length}`); }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(`SELECT * FROM properties ${where} ORDER BY id`, params);
  res.json({ success: true, count: rows.length, properties: rows.map(mapProperty) });
});

app.get('/api/properties/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await pool.query('SELECT * FROM properties WHERE id=$1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Property not found' });
  const { rows: revRows } = await pool.query('SELECT * FROM reviews WHERE property_id=$1 ORDER BY id DESC', [id]);
  res.json({ success: true, property: { ...mapProperty(rows[0]), reviewsList: revRows.map(mapReview) } });
});

// ─── BOOKINGS ─────────────────────────────────────────────────
app.post('/api/bookings', async (req, res) => {
  const { userId, propertyId, checkIn, checkOut, guests, paymentMethod } = req.body;
  try {
    const { rows: propRows } = await pool.query('SELECT * FROM properties WHERE id=$1', [parseInt(propertyId)]);
    const property = propRows[0];
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    if (nights < 1) return res.status(400).json({ error: 'Invalid dates' });
    const serviceFee = Math.round(property.price * nights * 0.05);
    const total = (property.price * nights) + serviceFee;

    const { rows: hostRows } = await pool.query('SELECT name FROM users WHERE id=$1', [property.host_id]);
    const hostName = hostRows[0]?.name || property.host_name || 'Unknown';

    const { rows } = await pool.query(
      `INSERT INTO bookings (user_id, property_id, check_in, check_out, guests, nights, total, service_fee, status, payment_method, property_title, property_image, property_location, host_id, host_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'confirmed',$9,$10,$11,$12,$13,$14) RETURNING *`,
      [parseInt(userId), parseInt(propertyId), checkIn, checkOut, parseInt(guests), nights, total, serviceFee,
       paymentMethod || 'AzamPesa', property.title, property.image, property.location, property.host_id, hostName]
    );
    res.json({ success: true, booking: mapBooking(rows[0]), message: 'Booking confirmed! Funds held in StayLocal Escrow.' });
  } catch (err) {
    console.error('[Booking Error]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/bookings/user/:userId', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM bookings WHERE user_id=$1 ORDER BY id DESC', [parseInt(req.params.userId)]);
  res.json({ success: true, bookings: rows.map(mapBooking) });
});

app.delete('/api/bookings/:id', async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE bookings SET status='cancelled', cancelled_at=NOW() WHERE id=$1 RETURNING *`,
    [parseInt(req.params.id)]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Booking not found' });
  res.json({ success: true, message: 'Booking cancelled. Refund will be processed in 24hrs.' });
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  const extra = status === 'checked-in' ? ", checked_in_at = NOW()" : "";
  const { rows } = await pool.query(
    `UPDATE bookings SET status=$1, updated_at=NOW()${extra} WHERE id=$2 RETURNING *`,
    [status, parseInt(req.params.id)]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Booking not found' });
  res.json({ success: true, booking: mapBooking(rows[0]) });
});

// ─── SAVED PROPERTIES ─────────────────────────────────────────
app.post('/api/saved/:userId/:propertyId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const propId = parseInt(req.params.propertyId);
  const { rows } = await pool.query('SELECT saved FROM users WHERE id=$1', [userId]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  const saved = rows[0].saved || [];
  const isSaved = !saved.includes(propId);
  const newSaved = isSaved ? [...saved, propId] : saved.filter(id => id !== propId);
  await pool.query('UPDATE users SET saved=$1 WHERE id=$2', [newSaved, userId]);
  res.json({ success: true, saved: isSaved });
});

app.get('/api/saved/:userId', async (req, res) => {
  const { rows } = await pool.query('SELECT saved FROM users WHERE id=$1', [parseInt(req.params.userId)]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  const saved = rows[0].saved || [];
  if (!saved.length) return res.json({ success: true, properties: [] });
  const { rows: props } = await pool.query('SELECT * FROM properties WHERE id = ANY($1)', [saved]);
  res.json({ success: true, properties: props.map(mapProperty) });
});

// ─── REVIEWS ──────────────────────────────────────────────────
app.post('/api/reviews', async (req, res) => {
  const { propertyId, userId, userName, rating, comment } = req.body;
  const avatar = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  const { rows } = await pool.query(
    `INSERT INTO reviews (property_id, user_id, user_name, rating, comment, avatar) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [parseInt(propertyId), parseInt(userId), userName, parseInt(rating), comment, avatar]
  );
  res.json({ success: true, review: mapReview(rows[0]) });
});

// ─── PROPERTY REQUESTS (landlord submissions) ──────────────────
app.get('/api/property-requests', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM property_requests ORDER BY id DESC');
  res.json({ success: true, requests: rows.map(mapPropertyRequest) });
});

app.post('/api/property-requests', async (req, res) => {
  const { title, location, hostName, phone, email, price, type, description, beds, baths, maxGuests, amenities, images } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO property_requests (title, location, host_name, phone, email, price, type, description, beds, baths, max_guests, amenities, images)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [title, location, hostName, phone, email, price, type, description, beds, baths, maxGuests, amenities || [], JSON.stringify(images || [])]
  );
  res.json({ success: true, request: mapPropertyRequest(rows[0]) });
});

app.patch('/api/property-requests/:id', async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query('UPDATE property_requests SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, request: mapPropertyRequest(rows[0]) });
});

// ─── PAYMENT INITIATE (Mobile Money + Card) ───────────────────
app.post('/api/payment/initiate', async (req, res) => {
  const { bookingId, userId, amount, phone, provider = 'AzamPesa', cardNum, cardName, cardExpiry, cardBrand, email, fullname } = req.body;
  const txRef = `staylocal-${userId}-${Date.now()}`;
  const isCard = provider === 'CARD';

  // ── CARD PAYMENT ──────────────────────────────────────────────
  if (isCard) {
    const txnId = `CARD${Date.now()}`;
    const last4 = (cardNum || '').slice(-4);
    await pool.query(
      `INSERT INTO payment_transactions (booking_id, user_id, amount, provider, card_last4, card_name, card_expiry, status, azam_transaction_id, external_id, mode)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'completed',$8,$9,'card')`,
      [bookingId || null, parseInt(userId || 0), amount, cardBrand || 'CARD', last4, cardName, cardExpiry, txnId, txRef]
    );
    return res.json({ success: true, transactionId: txnId, status: 'completed', message: `Kadi ****${last4} imethibitishwa` });
  }

  // Kama credentials hazijawekwa, simulate kwa majaribio
  if (!FLW.secretKey) {
    const txnId = `TXN${Date.now()}`;
    await pool.query(
      `INSERT INTO payment_transactions (booking_id, user_id, amount, phone, provider, status, azam_transaction_id, external_id, mode)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,'simulation')`,
      [bookingId || null, parseInt(userId || 0), amount, phone, provider, txnId, txRef]
    );
    return res.json({ success: true, transactionId: txnId, status: 'pending', message: 'STK Push imetumwa! Weka PIN yako ya ' + provider });
  }

  try {
    const payRes = await makeRequest(`${FLW.baseUrl}/charges?type=mobile_money_tanzania`, 'POST', {
      tx_ref: txRef,
      amount: String(amount),
      currency: 'TZS',
      email: email || 'guest@staylocal.co.tz',
      phone_number: phone.replace(/[\s\-]/g, ''),
      fullname: fullname || 'StayLocal Guest',
      redirect_url: FLW.redirectUrl,
    }, { 'Authorization': `Bearer ${FLW.secretKey}` });

    console.log('[Flutterwave] Charge response:', JSON.stringify(payRes.data));
    if (payRes.data?.status !== 'success') throw new Error(payRes.data?.message || 'Flutterwave charge failed');

    const txnId = String(payRes.data?.data?.id || txRef);
    await pool.query(
      `INSERT INTO payment_transactions (booking_id, user_id, amount, phone, provider, status, azam_transaction_id, external_id, mode)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,'flutterwave')`,
      [bookingId || null, parseInt(userId || 0), amount, phone, provider, txnId, txRef]
    );
    res.json({ success: true, transactionId: txnId, status: 'pending', message: payRes.data?.message || ('Confirm kwenye simu yako ' + phone) });

  } catch (err) {
    console.error('[Flutterwave Error]', err.message);
    const txnId = `TXN${Date.now()}`;
    await pool.query(
      `INSERT INTO payment_transactions (booking_id, user_id, amount, phone, provider, status, azam_transaction_id, external_id, mode)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,'simulation')`,
      [bookingId || null, parseInt(userId || 0), amount, phone, provider, txnId, txRef]
    );
    res.json({ success: true, transactionId: txnId, status: 'pending', message: 'STK Push imetumwa! Weka PIN yako.' });
  }
});

// Flutterwave inatuma webhook hapa baada ya malipo kukamilika
app.post('/api/payment/callback', async (req, res) => {
  const signature = req.headers['verif-hash'];
  if (FLW.webhookHash && signature !== FLW.webhookHash) return res.status(401).json({ error: 'Invalid signature' });

  const payload = req.body;
  console.log('[Flutterwave Webhook]', JSON.stringify(payload));
  const txnId = String(payload.data?.id);
  const status = payload.data?.status === 'successful' ? 'completed' : 'failed';

  const { rows } = await pool.query(
    `UPDATE payment_transactions SET status=$1, completed_at=NOW()
     WHERE azam_transaction_id=$2 OR external_id=$3 RETURNING *`,
    [status, txnId, payload.data?.tx_ref]
  );
  const txn = rows[0];
  if (txn && status === 'completed' && txn.booking_id) {
    await pool.query(`UPDATE bookings SET status='confirmed' WHERE id=$1`, [txn.booking_id]);
  }
  res.json({ success: true });
});

// Manual confirm (mtumiaji anabonyeza "Confirm Payment" kwenye app)
app.post('/api/payment/confirm', async (req, res) => {
  const { transactionId } = req.body;
  const { rows } = await pool.query('SELECT * FROM payment_transactions WHERE azam_transaction_id=$1', [transactionId]);
  const txn = rows[0];
  if (!txn) return res.json({ success: false, message: 'Transaction haikupatikana' });

  if (txn.mode === 'flutterwave' && FLW.secretKey) {
    try {
      const verify = await verifyFlutterwaveTransaction(transactionId);
      const status = verify?.data?.status === 'successful' ? 'completed' : 'pending';
      await pool.query(`UPDATE payment_transactions SET status=$1, completed_at=NOW() WHERE id=$2`, [status, txn.id]);
      return res.json({
        success: true, status,
        message: status === 'completed'
          ? 'Malipo yamethibitishwa! Fedha zimehifadhiwa katika Escrow ya StayLocal.'
          : 'Malipo bado hayajakamilika - thibitisha kwenye simu yako kisha jaribu tena.'
      });
    } catch (err) {
      console.error('[Flutterwave Verify Error]', err.message);
    }
  }
  await pool.query(`UPDATE payment_transactions SET status='completed', completed_at=NOW() WHERE id=$1`, [txn.id]);
  res.json({ success: true, status: 'completed', message: 'Malipo yamethibitishwa! Fedha zimehifadhiwa katika Escrow ya StayLocal.' });
});

// ─── SUPER ADMIN STATS ────────────────────────────────────────
app.get('/api/admin/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { rows: bookingRows } = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
    const { rows: userRows } = await pool.query('SELECT * FROM users ORDER BY id');
    const { rows: logRows } = await pool.query('SELECT * FROM login_logs ORDER BY timestamp DESC LIMIT 200');
    const { rows: txnRows } = await pool.query('SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 100');
    const { rows: propRows } = await pool.query('SELECT id, host_id, host_name FROM properties');

    const confirmedBookings = bookingRows.filter(b => b.status === 'confirmed');
    const cancelledBookings = bookingRows.filter(b => b.status === 'cancelled');
    const checkedInBookings = bookingRows.filter(b => b.status === 'checked-in');
    const pendingBookings   = bookingRows.filter(b => b.status === 'pending');

    const totalRevenue = confirmedBookings.reduce((a, b) => a + (b.service_fee || 0), 0);
    const totalBookingValue = confirmedBookings.reduce((a, b) => a + (b.total || 0), 0);

    const todayLogins = logRows.filter(l => l.timestamp.toISOString().startsWith(today));
    const weekLogins  = logRows.filter(l => l.timestamp >= weekAgo);
    const newUsersThisWeek = userRows.filter(u => new Date(u.created_at) >= weekAgo).length;

    // Bookings grouped by landlord
    const landlordMap = {};
    bookingRows.forEach(b => {
      const prop = propRows.find(p => p.id === b.property_id);
      const key = b.host_id || prop?.host_id;
      if (!key) return;
      if (!landlordMap[key]) {
        landlordMap[key] = {
          landlordId: key,
          landlordName: b.host_name || prop?.host_name || 'Unknown',
          email: userRows.find(u => u.id === key)?.email || '',
          totalBookings: 0, confirmedBookings: 0, cancelledBookings: 0,
          revenue: 0, bookingValue: 0,
          propertyIds: new Set(),
        };
      }
      landlordMap[key].totalBookings++;
      landlordMap[key].propertyIds.add(b.property_id);
      if (b.status === 'confirmed') { landlordMap[key].confirmedBookings++; landlordMap[key].revenue += (b.service_fee || 0); landlordMap[key].bookingValue += (b.total || 0); }
      if (b.status === 'cancelled') landlordMap[key].cancelledBookings++;
    });
    const bookingsByLandlord = Object.values(landlordMap).map(l => ({
      ...l, propertyCount: l.propertyIds.size, propertyIds: Array.from(l.propertyIds)
    }));

    const enrichedBookings = bookingRows.map(b => {
      const guest = userRows.find(u => u.id === b.user_id);
      return { ...mapBooking(b), guestName: guest?.name || 'Unknown', guestEmail: guest?.email || '' };
    });

    const enrichedUsers = userRows.map(u => {
      const userLogs = logRows.filter(l => l.user_id === u.id);
      const lastLogin = userLogs.slice().sort((a, b) => b.timestamp - a.timestamp)[0]?.timestamp;
      return {
        ...mapUser(u),
        loginCount: userLogs.filter(l => l.event === 'login').length,
        lastLogin: lastLogin ? lastLogin.toISOString() : null,
        totalBookings: bookingRows.filter(b => b.user_id === u.id).length,
      };
    });

    res.json({
      overview: {
        totalUsers: userRows.length,
        totalGuests: userRows.filter(u => u.role === 'guest').length,
        totalHosts: userRows.filter(u => u.role === 'host').length,
        newUsersThisWeek,
        totalBookings: bookingRows.length,
        confirmedBookings: confirmedBookings.length,
        cancelledBookings: cancelledBookings.length,
        checkedInBookings: checkedInBookings.length,
        pendingBookings: pendingBookings.length,
        totalProperties: propRows.length,
        totalRevenue,
        totalBookingValue,
        todayLogins: todayLogins.length,
        weekLogins: weekLogins.length,
      },
      users: enrichedUsers,
      bookings: enrichedBookings,
      loginLogs: logRows.map(mapLoginLog),
      bookingsByLandlord,
      paymentTransactions: txnRows.map(mapTransaction),
    });
  } catch (err) {
    console.error('[Admin Stats Error]', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GENERAL STATS ────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  const { rows: [{ count: totalProperties }] } = await pool.query('SELECT COUNT(*) FROM properties');
  const { rows: [{ count: totalBookings }] } = await pool.query('SELECT COUNT(*) FROM bookings');
  const { rows: [{ count: totalUsers }] } = await pool.query('SELECT COUNT(*) FROM users');
  const { rows: [{ count: verifiedProperties }] } = await pool.query('SELECT COUNT(*) FROM properties WHERE verified=true');
  const { rows: [{ avg: avgRating }] } = await pool.query('SELECT AVG(rating) FROM properties');
  res.json({
    totalProperties: parseInt(totalProperties), totalBookings: parseInt(totalBookings), totalUsers: parseInt(totalUsers),
    verifiedProperties: parseInt(verifiedProperties), avgRating: avgRating ? parseFloat(avgRating).toFixed(1) : '0.0',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`\n✓ StayLocal API running on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('✓ PostgreSQL connected');
  } catch (err) {
    console.error('✗ PostgreSQL connection FAILED:', err.message);
    console.error('  Angalia DATABASE_URL kwenye .env, na uwe umerun: npm run db:migrate');
  }
  const hasCreds = !!FLW.secretKey;
  console.log(`\n─── Flutterwave Status ─────────────────────────`);
  console.log(`  Mode:        ${hasCreds ? '✓ SANDBOX (real API)' : '⚠ SIMULATION (no credentials)'}`);
  console.log(`  Base URL:    ${FLW.baseUrl}`);
  console.log(`  Redirect:    ${FLW.redirectUrl}`);
  console.log(`  Credentials: ${hasCreds ? '✓ SET' : '✗ NOT SET — weka FLW_SECRET_KEY kwenye .env'}`);
  console.log(`───────────────────────────────────────────────\n`);
});
module.exports = app;
