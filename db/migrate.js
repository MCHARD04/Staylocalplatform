require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('✓ Schema applied');
  await seed();
  await pool.end();
  console.log('✓ Migration complete');
}

async function seed() {
  const { rows: [{ count: userCount }] } = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(userCount) === 0) {
    await pool.query(`
      INSERT INTO users (name, email, password, role, saved, created_at) VALUES
      ('Demo User','demo@staylocal.co.tz','demo123','guest','{1,3}','2026-01-10'),
      ('Host John','host@staylocal.co.tz','host123','host','{}','2026-01-15'),
      ('Super Admin','admin@staylocal.co.tz','admin123','admin','{}','2026-01-01')
    `);
    console.log('✓ Seeded users');
  }

  const { rows: [{ count: propCount }] } = await pool.query('SELECT COUNT(*) FROM properties');
  if (parseInt(propCount) === 0) {
    await pool.query(`
      INSERT INTO properties (title, location, price, type, rating, reviews, verified, available, image, amenities, beds, baths, guests, description, host_id, host_name) VALUES
      ('Sinza Deluxe Studio','Sinza, Dar es Salaam',75000,'Entire Home',4.8,24,true,true,'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', ARRAY['WiFi','AC','Kitchen','Security','Water'],1,1,2,'Modern studio in quiet Sinza neighborhood.',2,'Host John'),
      ('Masaki Executive Suite','Masaki, Dar es Salaam',150000,'Private Room',4.9,41,true,true,'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', ARRAY['Pool','Gym','Parking','WiFi','AC'],2,2,4,'Premium suite in upmarket Masaki.',2,'Host John'),
      ('Mikocheni Garden Apartment','Mikocheni, Dar es Salaam',95000,'Entire Home',4.7,18,true,true,'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', ARRAY['Garden','WiFi','Parking','Kitchen','Washer'],2,1,4,'Peaceful apartment with private garden.',2,'Host John'),
      ('Kariakoo Business Room','Kariakoo, Dar es Salaam',45000,'Private Room',4.5,33,true,true,'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=600&q=80', ARRAY['WiFi','AC','Security'],1,1,1,'Clean room in heart of Kariakoo.',2,'Host John'),
      ('Oyster Bay Beachfront Villa','Oyster Bay, Dar es Salaam',280000,'Entire Home',5.0,12,true,true,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', ARRAY['Beach Access','Pool','WiFi','AC','Kitchen','Parking','Security'],3,3,6,'Stunning beachfront villa with private pool.',2,'Host John'),
      ('Upanga City Apartment','Upanga, Dar es Salaam',60000,'Entire Home',4.6,29,true,true,'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', ARRAY['WiFi','Kitchen','AC','City View'],1,1,2,'Stylish city apartment with skyline views.',2,'Host John')
    `);
    console.log('✓ Seeded properties');
  }

  const { rows: [{ count: bookingCount }] } = await pool.query('SELECT COUNT(*) FROM bookings');
  if (parseInt(bookingCount) === 0) {
    await pool.query(`
      INSERT INTO bookings (user_id, property_id, check_in, check_out, guests, nights, total, service_fee, status, payment_method, property_title, property_image, host_id, host_name, created_at)
      VALUES (1, 1, '2026-06-20', '2026-06-23', 2, 3, 225000, 11250, 'confirmed', 'AzamPesa', 'Sinza Deluxe Studio', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', 2, 'Host John', '2026-06-10')
    `);
    console.log('✓ Seeded bookings');
  }

  const { rows: [{ count: reviewCount }] } = await pool.query('SELECT COUNT(*) FROM reviews');
  if (parseInt(reviewCount) === 0) {
    await pool.query(`
      INSERT INTO reviews (property_id, user_id, user_name, rating, comment, date, avatar) VALUES
      (1, 1, 'Amina M.', 5, 'Nilifika Dar es Salaam kwa kazi na niliogopa kupoteza pesa kwa madalali. StayLocal ilinisaidia sana!', '2026-05-15', 'AM'),
      (2, 1, 'James K.', 5, 'Pool and gym were amazing. Clean, modern and exactly as shown. Will book again!', '2026-05-20', 'JK'),
      (3, 1, 'Fatuma N.', 5, 'Perfect family stay near the hospital. Garden was great for the kids.', '2026-06-01', 'FN')
    `);
    console.log('✓ Seeded reviews');
  }
}

run().catch(err => { console.error('Migration failed:', err); process.exit(1); });
