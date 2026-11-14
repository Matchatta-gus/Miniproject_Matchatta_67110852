Meowtel - Cat Hotel Booking System
ระบบเว็บแอปพลิเคชันสำหรับการจองห้องพักโรงแรมแมวและบริหารจัดการหลังบ้าน (Full-Stack Web Application) พัฒนาขึ้นเพื่อใช้สำหรับโครงงานและการนำเสนอโปรเจกต์

# Tech Stack (เทคโนโลยีที่ใช้)
Frontend: HTML5, CSS3, JavaScript (Vanilla JS - SPA Design)
Backend: Node.js, Express.js (RESTful API)
Database: PostgreSQL (บริหารจัดการผ่าน pgAdmin 4)
Tools: Visual Studio Code, Git / GitHub, GoLive Server

## ฟังก์ชันหลักของระบบ 
1. ระบบสมาชิก & เข้าสู่ระบบ: บันทึกบัญชีด้วย Username และ Password พร้อมระบบจดจำบัญชีผู้ใช้
2. ระบบประวัติการจองส่วนตัว: ลูกค้าสามารถตรวจสอบประวัติการจองและสถานะห้องพักล่าสุดได้ทันทีหลังเข้าสู่ระบบ
3. ระบบเลือกห้องพัก & เช็กสต็อก: แสดงรายละเอียดขนาดห้อง ราคา และจำนวนห้องว่างแบบเรียลไทม์
4. ฟอร์มกรอกข้อมูลสัตว์เลี้ยงแบบไดนามิก: รองรับการจองให้น้องแมวหลายตัวพร้อมระบุชื่อและสายพันธุ์
5. ระบบชำระเงินผ่านพร้อมเพย์: จำลองการโอนเงินผ่าน QR Code พร้อมเพย์และแนบสลิปยืนยัน
6. ระบบหลังบ้าน (Admin Dashboard):
   - ตรวจสอบรายการจองและยอดเงินเข้าแบบเรียลไทม์
   - อัปเดตสถานะการจอง (รอดำเนินการ / เข้าพักแล้ว / ออกแล้ว)
   - ปรับเปลี่ยนราคาและควบคุมสต็อกห้องว่าง (+ / -) ได้ทันที

# วิธีการติดตั้งและตั้งค่าระบบ 
1. โคลนโปรเจกต์หรือดาวน์โหลดซอร์สโค้ด
ดาวน์โหลดไฟล์โปรเจกต์ทั้งหมดมาไว้ในคอมพิวเตอร์ของคุณ

2. การตั้งค่าฐานข้อมูลใน PostgreSQL / pgAdmin
    1. เปิดโปรแกรม pgAdmin 4 และสร้าง Database ใหม่ขึ้นมาชื่อว่า `meowtel_db`
    2. เปิด Query Tool ในฐานข้อมูลดังกล่าว แล้วรันคำสั่ง SQL สร้างตารางด้านล่างนี้:

sql
-- 1. ตารางเก็บข้อมูลห้องพัก
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL,
    "desc" TEXT,
    img TEXT,
    available INT NOT NULL
);

-- ข้อมูลห้องพักเริ่มต้น
INSERT INTO rooms (name, price, "desc", img, available) VALUES
('Room 101 - Cozy Room', 300, '📐 ขนาด: 1.0 x 1.2 เมตร (สูง 1.2 ม.)<br>📦 ความจุ: รองรับ 1 ตัว', '[https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=400&q=80)', 3),
('Room 102 - Warm Classic', 600, '📐 ขนาด: 1.5 x 1.5 เมตร (สูง 1.5 ม.)<br>📦 ความจุ: รองรับ 1-2 ตัว', '[https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=400&q=80)', 1),
('Room 103 - Superior View', 800, '📐 ขนาด: 1.8 x 1.8 เมตร (สูง 1.8 ม.)<br>📦 ความจุ: รองรับ 2 ตัว', '[https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80)', 2),
('Room 104 - Deluxe Condo', 1200, '📐 ขนาด: 2.0 x 2.2 เมตร (สูง 2.0 ม.)<br>📦 ความจุ: รองรับ 2-3 ตัว', '[https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80)', 1),
('Room 105 - Executive Suite', 1400, '📐 ขนาด: 2.5 x 2.5 เมตร (สูง 2.2 ม.)<br>📦 ความจุ: รองรับ 3-4 ตัว', '[https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80)', 1),
('Room 106 - Royal Villa', 1600, '📐 ขนาด: 3.0 x 3.0 เมตร (สูง 2.5 ม.)<br>📦 ความจุ: รองรับ 4-6 ตัว', '[https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80)', 2);

-- 2. ตารางเก็บข้อมูลสมาชิกผู้ใช้งาน
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 3. ตารางเก็บประวัติการจองห้องพัก
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT,
    room_id INT,
    room_name VARCHAR(255),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    check_in DATE,
    check_out DATE,
    pets JSONB,
    total_price NUMERIC,
    bank VARCHAR(100),
    account_number VARCHAR(100),
    slip_url TEXT,
    status VARCHAR(50) DEFAULT 'รอดำเนินการ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# ติดตั้งไลบรารีของ Node.js
เปิด Terminal ในโฟลเดอร์โปรเจกต์ แล้วรันคำสั่งเพื่อติดตั้งแพ็กเกจ express, cors และ pg: 
 npm install express cors pg

# ตั้งค่าการเชื่อมต่อฐานข้อมูลใน server.js
เปิดไฟล์ server.js แล้วแก้ไขข้อมูลการเชื่อมต่อ PostgreSQL ให้ตรงกับเครื่อง:
const pool = new Pool({
    user: 'postgres',         // Username ของ PostgreSQL คุณ
    host: 'localhost',
    database: 'meowtel_db',   // ชื่อ Database ที่สร้าง
    password: 'your_password', // รหัสผ่าน PostgreSQL ของคุณ
    port: 5432,
});

# วิธีการรันโปรเจกต์
เปิดไฟล์ที่ชื่อว่า stsrt แล้วจะขึ้นใน Terminal ว่า 
"Meowtel Server with PostgreSQL & Live Chat is running on http://localhost:3000
Connected to PostgreSQL successfully! ✨" แปลว่ารัน Backend ได้แล้ว

ฝั่งลูกค้า (Customer): เปิดไฟล์ index.html ผ่าน GoLive Server (หรือเปิดเบราว์เซอร์ไปที่ http://localhost:3000/index.html) แล้วใช้งานได้ปกติ

ฝั่งแอดมิน (Admin): เปิดไฟล์ admin.html ผ่านเบราว์เซอร์
รหัสผ่านเข้าสู่ระบบหลังบ้าน: Meowtel

# ฟังก์ชันการทำงานหลัก 
ระบบลูกค้า: เข้าสู่ระบบด้วย Username & Password (สร้างบัญชีให้อัตโนมัติหากเข้าครั้งแรก), เลือกห้องพัก, กรอกข้อมูลสัตว์เลี้ยงหลายตัว, ชำระเงินผ่านพร้อมเพย์, ดูประวัติการจองส่วนตัว, และสแกน QR Code Line เพื่อติดตามความเป็นอยู่ของน้องแมว

ระบบแอดมิน: ตรวจสอบรายการจองและหลักฐานการโอนเงิน, อัปเดตสถานะการจอง (รอดำเนินการ / เข้าพักแล้ว / ออกแล้ว), และจัดการปรับราคาหรือสต็อกห้องว่างแบบเรียลไทม์