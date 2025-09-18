import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret';
const rid = (p='') => p + Math.random().toString(36).slice(2,10);

// Admin store with all data
const store = {
  courses: new Map(),
  promotions: new Map(),
  tournaments: new Map(),
  players: new Map(),
  wallets: new Map(),
  claims: new Map(),
  staff: new Map(),
  notifications: new Map()
};

// Seed admin user and demo data
(() => {
  const adminId = rid('adm_');
  store.staff.set(adminId, {
    id: adminId,
    email: 'admin@par3challenge.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  });
  
  // Demo course
  const courseId = rid('crs_');
  store.courses.set(courseId, {
    id: courseId,
    name: 'Wentworth Golf Club',
    location: { lat: 42.123, lng: -71.456 },
    holes: [
      { number: 1, par: 3, yardage: 145, gps: {lat: 42.123, lng: -71.456} },
      { number: 2, par: 3, yardage: 165, gps: {lat: 42.124, lng: -71.457} }
    ]
  });
})();

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'No token'});
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({error: 'Invalid token'});
  }
};

// AUTH ROUTES
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = [...store.staff.values()].find(s => s.email === email);
  if (!admin || !await bcrypt.compare(password, admin.password)) {
    return res.status(401).json({error: 'Invalid credentials'});
  }
  const token = jwt.sign({id: admin.id, role: admin.role}, JWT_SECRET, {expiresIn: '8h'});
  res.json({token, user: {id: admin.id, email: admin.email, role: admin.role}});
});

// COURSE MANAGEMENT
app.get('/api/courses', auth, (req, res) => {
  res.json([...store.courses.values()]);
});

app.post('/api/courses', auth, (req, res) => {
  const course = { id: rid('crs_'), ...req.body, created_at: Date.now() };
  store.courses.set(course.id, course);
  res.json(course);
});

app.put('/api/courses/:id', auth, (req, res) => {
  const course = store.courses.get(req.params.id);
  if (!course) return res.status(404).json({error: 'Course not found'});
  Object.assign(course, req.body);
  store.courses.set(course.id, course);
  res.json(course);
});

// PROMOTIONS
app.get('/api/promotions', auth, (req, res) => {
  res.json([...store.promotions.values()]);
});

app.post('/api/promotions', auth, (req, res) => {
  const promo = { id: rid('prm_'), ...req.body, created_at: Date.now() };
  store.promotions.set(promo.id, promo);
  res.json(promo);
});

// WALLET MANAGEMENT (from wallet service)
app.get('/api/admin/claims', auth, (req, res) => {
  const claims = [...store.claims.values()].sort((a,b) => b.created_at - a.created_at);
  res.json({claims});
});

app.post('/api/claims/webhook', (req, res) => {
  const { first_name, last_name, phone, email, course_id, hole, claim_type, payout_method, prize_amount } = req.body || {};
  if (!first_name || !last_name || !course_id) return res.status(400).json({error: 'Missing fields'});
  const claim = { 
    claim_id: rid('clm_'), 
    player_first: first_name, 
    player_last: last_name, 
    phone, email, course_id, hole, 
    status: 'pending', 
    created_at: Date.now() 
  };
  store.claims.set(claim.claim_id, claim);
  res.json({ok: true, claim_id: claim.claim_id});
});

app.post('/api/claims/:id/verify', auth, async (req, res) => {
  const claim = store.claims.get(req.params.id);
  if (!claim) return res.status(404).json({error: 'Claim not found'});
  claim.status = 'verified';
  
  // Create/update player
  let player = [...store.players.values()].find(p => p.phone === claim.phone || p.email === claim.email);
  if (!player) {
    player = {
      player_id: rid('usr_'),
      first_name: claim.player_first,
      last_name: claim.player_last,
      phone: claim.phone,
      email: claim.email
    };
    store.players.set(player.player_id, player);
  }
  
  // Create/update wallet
  let wallet = store.wallets.get(player.wallet_id);
  if (!wallet) {
    wallet = {
      wallet_id: rid('wal_'),
      player_id: player.player_id,
      course_lock: claim.course_id,
      balance_cents: 0,
      status: 'active'
    };
    player.wallet_id = wallet.wallet_id;
    store.wallets.set(wallet.wallet_id, wallet);
    store.players.set(player.player_id, player);
  }
  
  let payoutAmount = 0;
  let message = '';
  let qrCodeUrl = null;
  if (claim.claim_type === 'birdie') {
    payoutAmount = 6500;
    message = `You scored a birdie! Use this QR code at your club to redeem your $65 award. Enjoy!`;
    // Generate QR code for this club/award
    const qrData = JSON.stringify({
      club: claim.course_id,
      player: `${claim.player_first} ${claim.player_last}`,
      claim_id: claim.claim_id,
      type: claim.claim_type,
      amount: payoutAmount
    });
    qrCodeUrl = await QRCode.toDataURL(qrData);
    claim.qr_code = qrCodeUrl;
    wallet.balance_cents += payoutAmount;
    store.wallets.set(wallet.wallet_id, wallet);
  } else if (claim.claim_type === 'hole-in-one') {
    payoutAmount = 100000;
    message = `Great Job! $1000.00 has been sent back to the method of payment you used to enter the challenge.`;
    // No QR code needed for direct payout
    claim.qr_code = null;
    // Here you would trigger the real payout logic
  }

  // Send notification to player (in-app/email)
  const notification = {
    id: rid('ntf_'),
    player: claim.email || claim.phone,
    title: 'Great Job!',
    message,
    qr_code: qrCodeUrl,
    claim_id: claim.claim_id,
    sent_at: Date.now(),
    status: 'sent'
  };
  store.notifications.set(notification.id, notification);

  res.json({ok: true, wallet_id: wallet?.wallet_id, qr_code: qrCodeUrl});
});

// TOURNAMENTS
app.get('/api/tournaments', auth, (req, res) => {
  res.json([...store.tournaments.values()]);
});

app.post('/api/tournaments', auth, (req, res) => {
  const tournament = { id: rid('trn_'), ...req.body, created_at: Date.now() };
  store.tournaments.set(tournament.id, tournament);
  res.json(tournament);
});

// Add registrants to tournament object for demo
app.post('/api/tournaments/:id/register', (req, res) => {
  const t = store.tournaments.get(req.params.id);
  if (!t) return res.status(404).json({error: 'Tournament not found'});
  const { name, email, course } = req.body;
  if (!t.registrants) t.registrants = [];
  t.registrants.push({ id: rid('reg_'), name, email, course });
  res.json({ok: true});
});

// NOTIFICATIONS
app.post('/api/notifications/send', auth, (req, res) => {
  const { title, message, target } = req.body;
  const notification = {
    id: rid('ntf_'),
    title, message, target,
    sent_at: Date.now(),
    status: 'sent'
  };
  store.notifications.set(notification.id, notification);
  res.json({ok: true, sent: notification});
});

// CAMPAIGNS
app.post('/api/campaigns', auth, (req, res) => {
  const { course_id, title, message, type } = req.body;
  const id = rid('cmp_');
  const campaign = {
    id,
    course_id,
    title,
    message,
    type,
    status: 'draft',
    created_at: Date.now()
  };
  if (!store.campaigns) store.campaigns = new Map();
  store.campaigns.set(id, campaign);
  res.json(campaign);
});

app.post('/api/campaigns/:id/send-for-approval', auth, (req, res) => {
  const campaign = store.campaigns?.get(req.params.id);
  if (!campaign) return res.status(404).json({error: 'Campaign not found'});
  campaign.status = 'pending-approval';
  // Simulate sending email/push to CRM contact
  campaign.last_action = 'Sent for approval (demo)';
  res.json({ok: true, campaign});
});

app.post('/api/campaigns/:id/approve', auth, (req, res) => {
  const campaign = store.campaigns?.get(req.params.id);
  if (!campaign) return res.status(404).json({error: 'Campaign not found'});
  campaign.status = 'approved';
  campaign.last_action = 'Approved by CRM (demo)';
  res.json({ok: true, campaign});
});

app.post('/api/campaigns/:id/launch', auth, (req, res) => {
  const campaign = store.campaigns?.get(req.params.id);
  if (!campaign) return res.status(404).json({error: 'Campaign not found'});
  campaign.status = 'launched';
  campaign.last_action = 'Launched to players (demo)';
  // Simulate sending push/email to players
  res.json({ok: true, campaign});
});

// DASHBOARD DATA
app.get('/api/dashboard/stats', auth, (req, res) => {
  res.json({
    courses: store.courses.size,
    players: store.players.size,
    claims_pending: [...store.claims.values()].filter(c => c.status === 'pending').length,
    total_payouts: [...store.wallets.values()].reduce((sum, w) => sum + w.balance_cents, 0),
    tournaments: store.tournaments.size
  });
});

// PLAYER NOTIFICATIONS (fetch by email or phone)
app.get('/api/player/notifications', (req, res) => {
  const { email, phone } = req.query;
  if (!email && !phone) return res.status(400).json({error: 'Missing email or phone'});
  const notifs = [...store.notifications.values()].filter(n =>
    (email && n.player === email) || (phone && n.player === phone)
  );
  res.json({notifications: notifs});
});

// Static routes
app.get('/', (req, res) => res.redirect('/login.html'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`P3C Admin Portal running at http://localhost:${PORT}`));
