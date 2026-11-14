const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'meowtel_db',
    password: 'Sugus1208',
    port: 5432,
});

pool.connect((err, client, release) => {
    if (err) return console.error('Error connecting to PostgreSQL', err.stack);
    console.log('Connected to PostgreSQL successfully! ✨');
    release();
});

// --- API ห้องพัก ---
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
        res.json({ success: true, rooms: result.rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/admin/rooms', async (req, res) => {
    try {
        const { name, price, desc, img, available } = req.body;
        const query = `INSERT INTO rooms (name, price, "desc", img, available) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [name, price, desc || "📐 ขนาดมาตรฐาน", img || "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=400&q=80", available || 0];
        const result = await pool.query(query, values);
        res.json({ success: true, message: 'เพิ่มห้องพักสำเร็จ', room: result.rows[0] });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/admin/rooms/:id/available', async (req, res) => {
    try {
        const roomId = Number(req.params.id);
        const { available } = req.body;
        const result = await pool.query('UPDATE rooms SET available = $1 WHERE id = $2 RETURNING *', [Math.max(0, available), roomId]);
        res.json({ success: true, room: result.rows[0] });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/admin/rooms/:id/price', async (req, res) => {
    try {
        const roomId = Number(req.params.id);
        const { price } = req.body;
        const result = await pool.query('UPDATE rooms SET price = $1 WHERE id = $2 RETURNING *', [price, roomId]);
        res.json({ success: true, room: result.rows[0] });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/admin/rooms/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM rooms WHERE id = $1', [Number(req.params.id)]);
        res.json({ success: true, message: 'ลบห้องพักสำเร็จ' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// --- API ระบบสมาชิก / ล็อกอินลูกค้า ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const cleanUser = username.trim();
        let userResult = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [cleanUser]);

        if (userResult.rows.length > 0) {
            let user = userResult.rows[0];
            if (user.password !== password) return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
            return res.json({ success: true, user: { id: user.id, username: user.username }, isNew: false });
        } else {
            let newResult = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [cleanUser, password]);
            let newUser = newResult.rows[0];
            return res.json({ success: true, user: { id: newUser.id, username: newUser.username }, isNew: true });
        }
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// --- API ประวัติการจอง ---
app.get('/api/bookings/user/:userId', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY id DESC', [Number(req.params.userId)]);
        res.json({ success: true, bookings: result.rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, roomId, ownerName, ownerPhone, checkIn, checkOut, pets, totalPrice, bank, accountNumber, slipUrl } = req.body;
        const roomCheck = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
        if (roomCheck.rows.length === 0 || roomCheck.rows[0].available <= 0) {
            return res.status(400).json({ success: false, message: 'ขออภัย ห้องพักนี้เต็มแล้ว' });
        }
        await pool.query('UPDATE rooms SET available = available - 1 WHERE id = $1', [roomId]);

        const roomName = roomCheck.rows[0].name;
        const query = `INSERT INTO bookings (user_id, room_id, room_name, owner_name, owner_phone, check_in, check_out, pets, total_price, bank, account_number, slip_url, status) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'รอดำเนินการ') RETURNING *`;
        const values = [userId, roomId, roomName, ownerName, ownerPhone, checkIn, checkOut, JSON.stringify(pets), totalPrice, bank, accountNumber, slipUrl];
        
        const result = await pool.query(query, values);
        res.json({ success: true, message: 'บันทึกการจองสำเร็จ', bookingId: result.rows[0].id });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
        const formatted = result.rows.map(b => ({
            id: b.id,
            userId: b.user_id,
            roomName: b.room_name,
            ownerName: b.owner_name,
            ownerPhone: b.owner_phone,
            checkIn: b.check_in ? b.check_in.toISOString().split('T')[0] : '',
            checkOut: b.check_out ? b.check_out.toISOString().split('T')[0] : '',
            pets: b.pets,
            totalPrice: b.total_price,
            bank: b.bank,
            status: b.status
        }));
        res.json({ success: true, bookings: formatted });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch('/api/admin/bookings/:id/status', async (req, res) => {
    try {
        await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [req.body.status, Number(req.params.id)]);
        res.json({ success: true, message: 'อัปเดตสถานะสำเร็จ' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/admin/bookings/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM bookings WHERE id = $1', [Number(req.params.id)]);
        res.json({ success: true, message: 'ลบรายการจองสำเร็จ' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.listen(3000, () => {
    console.log('Meowtel Server is running on http://localhost:3000');
});