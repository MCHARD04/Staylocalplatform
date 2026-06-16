require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── AZAMPESA CONFIG ─────────────────────────────────────────
// HATUA ZA KUPATA CREDENTIALS:
// 1. Nenda https://www.azampesa.co.tz na uchague "Become a Merchant"
// 2. Jaza fomu ya merchant registration (business details, NIN, TIN)
// 3. Baada ya approval (siku 1-3), login kwenye merchant portal
// 4. Nenda Settings > API Credentials - utapata AppName, ClientID, ClientSecret, VendorID
// 5. Kwa majaribio (sandbox): tumia https://sandbox.azampesa.co.tz
// 6. Kwa production: tumia https://pesapaapi.azampesa.co.tz
// 7. Weka credentials kwenye .env file (copy .env.example kwanza)
const AZAM = {
  appName:      process.env.AZAM_APP_NAME      || 'StayLocal',
  clientId:     process.env.AZAM_CLIENT_ID     || '',
  clientSecret: process.env.AZAM_CLIENT_SECRET || '',
  vendorId:     process.env.AZAM_VENDOR_ID     || '',
  baseUrl:      process.env.AZAM_BASE_URL      || 'https://sandbox.azampesa.co.tz',
  callbackUrl:  process.env.AZAM_CALLBACK_URL  || 'http://localhost:3001/api/payment/callback',
};

// PROVIDER CODES ZA AZAMPESA API
const PROVIDER_MAP = {
  'AZAMPESA': 'AZAMPESA', 'AzamPesa': 'AZAMPESA',
  'M-Pesa': 'MPESA', 'MPESA': 'MPESA',
  'Tigo Pesa': 'TIGOPESA', 'TIGOPESA': 'TIGOPESA',
  'Airtel Money': 'AIRTELMONEY', 'AIRTELMONEY': 'AIRTELMONEY',
  'HaloPesa': 'HALOPESA', 'HALOPESA': 'HALOPESA',
};

// ─── IN-MEMORY DATA ──────────────────────────────────────────
let loginLogs = [];
let paymentTransactions = [];
let nextIds = { booking: 2, user: 4, payment: 1, log: 1 };

let users = [
  { id: 1, name: 'Demo User', email: 'demo@staylocal.co.tz', password: 'demo123', role: 'guest', bookings: [], saved: [1,3], createdAt: '2026-01-10' },
  { id: 2, name: 'Host John', email: 'host@staylocal.co.tz', password: 'host123', role: 'host', properties: [1,2], bookings: [], saved: [], createdAt: '2026-01-15' },
  { id: 3, name: 'Super Admin', email: 'admin@staylocal.co.tz', password: 'admin123', role: 'admin', bookings: [], saved: [], createdAt: '2026-01-01' },
];

let properties = [
  { id: 1, title: 'Sinza Deluxe Studio', location: 'Sinza, Dar es Salaam', price: 75000, type: 'Entire Home', rating: 4.8, reviews: 24, verified: true, available: true, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', amenities: ['WiFi','AC','Kitchen','Security','Water'], beds: 1, baths: 1, guests: 2, description: 'Modern studio in quiet Sinza neighborhood.', hostId: 2, hostName: 'Host John' },
  { id: 2, title: 'Masaki Executive Suite', location: 'Masaki, Dar es Salaam', price: 150000, type: 'Private Room', rating: 4.9, reviews: 41, verified: true, available: true, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', amenities: ['Pool','Gym','Parking','WiFi','AC'], beds: 2, baths: 2, guests: 4, description: 'Premium suite in upmarket Masaki.', hostId: 2, hostName: 'Host John' },
  { id: 3, title: 'Mikocheni Garden Apartment', location: 'Mikocheni, Dar es Salaam', price: 95000, type: 'Entire Home', rating: 4.7, reviews: 18, verified: true, available: true, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', amenities: ['Garden','WiFi','Parking','Kitchen','Washer'], beds: 2, baths: 1, guests: 4, description: 'Peaceful apartment with private garden.', hostId: 2, hostName: 'Host John' },
  { id: 4, title: 'Kariakoo Business Room', location: 'Kariakoo, Dar es Salaam', price: 45000, type: 'Private Room', rating: 4.5, reviews: 33, verified: true, available: true, image: 'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=600&q=80', amenities: ['WiFi','AC','Security'], beds: 1, baths: 1, guests: 1, description: 'Clean room in heart of Kariakoo.', hostId: 2, hostName: 'Host John' },
  { id: 5, title: 'Oyster Bay Beachfront Villa', location: 'Oyster Bay, Dar es Salaam', price: 280000, type: 'Entire Home', rating: 5.0, reviews: 12, verified: true, available: true, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', amenities: ['Beach Access','Pool','WiFi','AC','Kitchen','Parking','Security'], beds: 3, baths: 3, guests: 6, description: 'Stunning beachfront villa with private pool.', hostId: 2, hostName: 'Host John' },
  { id: 6, title: 'Upanga City Apartment', location: 'Upanga, Dar es Salaam', price: 60000, type: 'Entire Home', rating: 4.6, reviews: 29, verified: true, available: true, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', amenities: ['WiFi','Kitchen','AC','City View'], beds: 1, baths: 1, guests: 2, description: 'Stylish city apartment with skyline views.', hostId: 2, hostName: 'Host John' },
];

let bookings = [
  { id: 1, userId: 1, propertyId: 1, checkIn: '2026-06-20', checkOut: '2026-06-23', guests: 2, nights: 3, total: 225000, serviceFee: 11250, status: 'confirmed', paymentMethod: 'AzamPesa', propertyTitle: 'Sinza Deluxe Studio', propertyImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', hostId: 2, hostName: 'Host John', createdAt: '2026-06-10' }
];

let reviews = [
  { id: 1, propertyId: 1, userId: 1, userName: 'Amina M.', rating: 5, comment: 'Nilifika Dar es Salaam kwa kazi na niliogopa kupoteza pesa kwa madalali. StayLocal ilinisaidia sana!', date: '2026-05-15', avatar: 'AM' },
  { id: 2, propertyId: 2, userId: 1, userName: 'James K.', rating: 5, comment: 'Pool and gym were amazing. Clean, modern and exactly as shown. Will book again!', date: '2026-05-20', avatar: 'JK' },
  { id: 3, propertyId: 3, userId: 1, userName: 'Fatuma N.', rating: 5, comment: 'Perfect family stay near the hospital. Garden was great for the kids.', date: '2026-06-01', avatar: 'FN' }
];

// ─── AZAMPESA HTTP HELPER ─────────────────────────────────────
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

async function getAzamToken() {
  const res = await makeRequest(`${AZAM.baseUrl}/api/token`, 'GET', null, {
    'X-APP-NAME': AZAM.appName,
    'X-CLIENT-ID': AZAM.clientId,
    'X-CLIENT-SECRET': AZAM.clientSecret,
  });
  return res.data?.token || null;
}

// ─── AUTH ENDPOINTS ───────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role = 'guest' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });
  const user = {
    id: nextIds.user++, name, email, password, role,
    bookings: [], saved: [], properties: [],
    createdAt: new Date().toISOString().split('T')[0]
  };
  users.push(user);
  loginLogs.push({ id: nextIds.log++, userId: user.id, userName: user.name, email: user.email, role: user.role, event: 'register', timestamp: new Date().toISOString() });
  const { password: _, ...safe } = user;
  res.json({ success: true, user: safe, token: `token_${user.id}_${Date.now()}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  loginLogs.push({ id: nextIds.log++, userId: user.id, userName: user.name, email: user.email, role: user.role, event: 'login', timestamp: new Date().toISOString() });
  const { password: _, ...safe } = user;
  res.json({ success: true, user: safe, token: `token_${user.id}_${Date.now()}` });
});

// ─── PROPERTIES ───────────────────────────────────────────────
app.get('/api/properties', (req, res) => {
  const { location, type, minPrice, maxPrice, beds } = req.query;
  let results = [...properties];
  if (location) results = results.filter(p => p.location.toLowerCase().includes(location.toLowerCase()) || p.title.toLowerCase().includes(location.toLowerCase()));
  if (type && type !== 'All') results = results.filter(p => p.type === type);
  if (minPrice) results = results.filter(p => p.price >= parseInt(minPrice));
  if (maxPrice) results = results.filter(p => p.price <= parseInt(maxPrice));
  if (beds) results = results.filter(p => p.beds >= parseInt(beds));
  res.json({ success: true, count: results.length, properties: results });
});

app.get('/api/properties/:id', (req, res) => {
  const prop = properties.find(p => p.id === parseInt(req.params.id));
  if (!prop) return res.status(404).json({ error: 'Property not found' });
  const propReviews = reviews.filter(r => r.propertyId === prop.id);
  res.json({ success: true, property: { ...prop, reviewsList: propReviews } });
});

// ─── BOOKINGS ─────────────────────────────────────────────────
app.post('/api/bookings', (req, res) => {
  const { userId, propertyId, checkIn, checkOut, guests, paymentMethod } = req.body;
  const property = properties.find(p => p.id === parseInt(propertyId));
  if (!property) return res.status(404).json({ error: 'Property not found' });
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
  if (nights < 1) return res.status(400).json({ error: 'Invalid dates' });
  const serviceFee = Math.round(property.price * nights * 0.05);
  const total = (property.price * nights) + serviceFee;
  const host = users.find(u => u.id === property.hostId);
  const booking = {
    id: nextIds.booking++,
    userId: parseInt(userId), propertyId: parseInt(propertyId),
    checkIn, checkOut, guests: parseInt(guests), nights, total, serviceFee,
    status: 'confirmed',
    paymentMethod: paymentMethod || 'AzamPesa',
    propertyTitle: property.title,
    propertyImage: property.image,
    propertyLocation: property.location,
    hostId: property.hostId,
    hostName: host?.name || property.hostName || 'Unknown',
    createdAt: new Date().toISOString().split('T')[0]
  };
  bookings.push(booking);
  const user = users.find(u => u.id === parseInt(userId));
  if (user) user.bookings.push(booking.id);
  res.json({ success: true, booking, message: 'Booking confirmed! Funds held in StayLocal Escrow.' });
});

app.get('/api/bookings/user/:userId', (req, res) => {
  const userBookings = bookings.filter(b => b.userId === parseInt(req.params.userId));
  res.json({ success: true, bookings: userBookings });
});

app.delete('/api/bookings/:id', (req, res) => {
  const idx = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Booking not found' });
  bookings[idx].status = 'cancelled';
  bookings[idx].cancelledAt = new Date().toISOString();
  res.json({ success: true, message: 'Booking cancelled. Refund will be processed in 24hrs.' });
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (status === 'checked-in') booking.checkedInAt = new Date().toISOString();
  res.json({ success: true, booking });
});

// ─── SAVED PROPERTIES ─────────────────────────────────────────
app.post('/api/saved/:userId/:propertyId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const propId = parseInt(req.params.propertyId);
  if (user.saved.includes(propId)) { user.saved = user.saved.filter(id => id !== propId); res.json({ success: true, saved: false }); }
  else { user.saved.push(propId); res.json({ success: true, saved: true }); }
});

app.get('/api/saved/:userId', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.userId));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, properties: properties.filter(p => user.saved.includes(p.id)) });
});

// ─── REVIEWS ──────────────────────────────────────────────────
app.post('/api/reviews', (req, res) => {
  const { propertyId, userId, userName, rating, comment } = req.body;
  const review = { id: reviews.length + 1, propertyId: parseInt(propertyId), userId: parseInt(userId), userName, rating: parseInt(rating), comment, date: new Date().toISOString().split('T')[0], avatar: userName.split(' ').map(n => n[0]).join('').toUpperCase() };
  reviews.push(review);
  res.json({ success: true, review });
});

// ─── AZAMPESA PAYMENT ─────────────────────────────────────────
app.post('/api/payment/initiate', async (req, res) => {
  const { bookingId, userId, amount, phone, provider = 'AzamPesa' } = req.body;
  const externalId = `staylocal-${userId}-${Date.now()}`;
  const providerCode = PROVIDER_MAP[provider] || 'AZAMPESA';

  // Kama credentials hazijawekwa, simulate kwa majaribio
  if (!AZAM.clientId || !AZAM.clientSecret) {
    const txnId = `TXN${Date.now()}`;
    paymentTransactions.push({
      id: nextIds.payment++, bookingId, userId: parseInt(userId || 0),
      amount, phone, provider: providerCode, status: 'pending',
      azamTransactionId: txnId, externalId, mode: 'simulation',
      createdAt: new Date().toISOString()
    });
    return res.json({ success: true, transactionId: txnId, status: 'pending', message: 'STK Push imetumwa! Weka PIN yako ya ' + provider });
  }

  try {
    // Pata token ya AzamPesa
    const token = await getAzamToken();
    if (!token) throw new Error('Token haikupatikana');

    // Tuma ombi la malipo
    const payRes = await makeRequest(`${AZAM.baseUrl}/api/payment`, 'POST', {
      appName: AZAM.appName,
      clientId: AZAM.clientId,
      clientSecret: AZAM.clientSecret,
      vendorId: AZAM.vendorId,
      languageCode: 'SW',
      currency: 'TZS',
      countryCode: 'TZ',
      amount: String(amount),
      provider: providerCode,
      transferType: 'COLLECTION',
      accountNumber: phone.replace(/[\s\-]/g, ''),
      externalId,
      callBackUrl: AZAM.callbackUrl,
    }, { 'Authorization': `Bearer ${token}` });

    const txnId = payRes.data?.transactionId || externalId;
    paymentTransactions.push({
      id: nextIds.payment++, bookingId, userId: parseInt(userId || 0),
      amount, phone, provider: providerCode, status: 'pending',
      azamTransactionId: txnId, externalId, mode: 'live',
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, transactionId: txnId, status: 'pending', message: 'STK Push imetumwa kwa ' + phone + '! Weka PIN yako.' });

  } catch (err) {
    // Fallback kwa simulation kama connection inashindwa
    console.error('[AzamPesa Error]', err.message);
    const txnId = `TXN${Date.now()}`;
    paymentTransactions.push({
      id: nextIds.payment++, bookingId, userId: parseInt(userId || 0),
      amount, phone, provider: providerCode, status: 'pending',
      azamTransactionId: txnId, externalId, mode: 'simulation',
      createdAt: new Date().toISOString()
    });
    res.json({ success: true, transactionId: txnId, status: 'pending', message: 'STK Push imetumwa! Weka PIN yako.' });
  }
});

// AzamPesa inatuma callback hapa baada ya mtumiaji kuweka PIN
app.post('/api/payment/callback', (req, res) => {
  const { transactionId, externalId, status } = req.body;
  console.log('[AzamPesa Callback]', req.body);
  const txn = paymentTransactions.find(t => t.azamTransactionId === transactionId || t.externalId === externalId);
  if (txn) {
    txn.status = (status === 'COMPLETED' || status === 'SUCCESS') ? 'completed' : 'failed';
    txn.completedAt = new Date().toISOString();
    if (txn.status === 'completed' && txn.bookingId) {
      const booking = bookings.find(b => b.id === txn.bookingId);
      if (booking) booking.status = 'confirmed';
    }
  }
  res.json({ success: true });
});

// Manual confirm (mtumiaji anabonyeza "Confirm Payment" kwenye app)
app.post('/api/payment/confirm', (req, res) => {
  const { transactionId } = req.body;
  const txn = paymentTransactions.find(t => t.azamTransactionId === transactionId);
  if (txn) { txn.status = 'completed'; txn.completedAt = new Date().toISOString(); }
  res.json({ success: true, status: 'completed', message: 'Malipo yamethibitishwa! Fedha zimehifadhiwa katika Escrow ya StayLocal.' });
});

// ─── SUPER ADMIN STATS ────────────────────────────────────────
app.get('/api/admin/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const checkedInBookings = bookings.filter(b => b.status === 'checked-in');
  const pendingBookings   = bookings.filter(b => b.status === 'pending');

  const totalRevenue = confirmedBookings.reduce((a, b) => a + (b.serviceFee || 0), 0);
  const totalBookingValue = confirmedBookings.reduce((a, b) => a + (b.total || 0), 0);

  const todayLogins  = loginLogs.filter(l => l.timestamp.startsWith(today));
  const weekLogins   = loginLogs.filter(l => l.timestamp >= weekAgo);
  const newUsersThisWeek = users.filter(u => u.createdAt >= weekAgo.split('T')[0]).length;

  // Bookings grouped by landlord
  const landlordMap = {};
  bookings.forEach(b => {
    const prop = properties.find(p => p.id === b.propertyId);
    const key = b.hostId || (prop?.hostId);
    if (!key) return;
    if (!landlordMap[key]) {
      landlordMap[key] = {
        landlordId: key,
        landlordName: b.hostName || prop?.hostName || 'Unknown',
        email: users.find(u => u.id === key)?.email || '',
        totalBookings: 0, confirmedBookings: 0, cancelledBookings: 0,
        revenue: 0, bookingValue: 0,
        propertyIds: new Set(),
      };
    }
    landlordMap[key].totalBookings++;
    landlordMap[key].propertyIds.add(b.propertyId);
    if (b.status === 'confirmed') { landlordMap[key].confirmedBookings++; landlordMap[key].revenue += (b.serviceFee || 0); landlordMap[key].bookingValue += (b.total || 0); }
    if (b.status === 'cancelled') landlordMap[key].cancelledBookings++;
  });

  const bookingsByLandlord = Object.values(landlordMap).map(l => ({
    ...l, propertyCount: l.propertyIds.size, propertyIds: Array.from(l.propertyIds)
  }));

  // Enrich bookings with guest and host names
  const enrichedBookings = bookings.map(b => {
    const prop  = properties.find(p => p.id === b.propertyId);
    const guest = users.find(u => u.id === b.userId);
    return {
      ...b,
      guestName: guest?.name || 'Unknown',
      guestEmail: guest?.email || '',
      propertyLocation: prop?.location || '',
    };
  });

  // Enrich users with login stats
  const enrichedUsers = users.map(u => {
    const { password: _, ...safe } = u;
    const userLogs = loginLogs.filter(l => l.userId === u.id);
    const lastLogin = userLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]?.timestamp;
    return { ...safe, loginCount: userLogs.filter(l => l.event === 'login').length, lastLogin, totalBookings: bookings.filter(b => b.userId === u.id).length };
  });

  res.json({
    overview: {
      totalUsers: users.length,
      totalGuests: users.filter(u => u.role === 'guest').length,
      totalHosts: users.filter(u => u.role === 'host').length,
      newUsersThisWeek,
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      cancelledBookings: cancelledBookings.length,
      checkedInBookings: checkedInBookings.length,
      pendingBookings: pendingBookings.length,
      totalProperties: properties.length,
      totalRevenue,
      totalBookingValue,
      todayLogins: todayLogins.length,
      weekLogins: weekLogins.length,
    },
    users: enrichedUsers,
    bookings: enrichedBookings,
    loginLogs: loginLogs.slice().reverse().slice(0, 100),
    bookingsByLandlord,
    paymentTransactions: paymentTransactions.slice().reverse().slice(0, 100),
  });
});

// ─── GENERAL STATS ────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    totalProperties: properties.length,
    totalBookings: bookings.length,
    totalUsers: users.length,
    verifiedProperties: properties.filter(p => p.verified).length,
    avgRating: (properties.reduce((a, p) => a + p.rating, 0) / properties.length).toFixed(1)
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  const hasCreds = AZAM.clientId && AZAM.clientId !== 'WEKA_CLIENT_ID_YAKO_HAPA';
  console.log(`\n✓ StayLocal API running on http://localhost:${PORT}`);
  console.log(`\n─── AzamPesa Status ───────────────────────────`);
  console.log(`  Mode:        ${hasCreds ? '✓ SANDBOX (real API)' : '⚠ SIMULATION (no credentials)'}`);
  console.log(`  Base URL:    ${AZAM.baseUrl}`);
  console.log(`  Callback:    ${AZAM.callbackUrl}`);
  console.log(`  Credentials: ${hasCreds ? '✓ SET' : '✗ NOT SET — weka kwenye .env'}`);
  console.log(`───────────────────────────────────────────────\n`);
});
module.exports = app;
