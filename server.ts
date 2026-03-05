import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("webora.db");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image TEXT,
    category TEXT,
    link TEXT,
    plan TEXT
  );
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    features TEXT,
    tier TEXT
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    reply TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    is_super INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS user_aliases (
    email TEXT PRIMARY KEY,
    alias TEXT
  );
`);

// Seed initial data
const superEmail = "1singhsanskar11@gmail.com";
const superAdminExists = db.prepare("SELECT 1 FROM admins WHERE email = ?").get(superEmail);
if (!superAdminExists) {
  db.prepare("INSERT INTO admins (email, password, is_super) VALUES (?, ?, ?)").run(superEmail, "admin123", 1);
}

const requiredSettings = [
  { key: "admin_email", value: "1singhsanskar11@gmail.com" },
  { key: "whatsapp_link", value: "https://wa.me/yournumber" },
  { key: "instagram_link", value: "https://instagram.com/sanskar" },
  { key: "youtube_link", value: "https://youtube.com/sanskar" },
  { key: "footer_text", value: "© 2024 Webora. Built by Sanskar." },
  { key: "hero_title", value: "Crafting Industry-Level Digital Experiences" },
  { key: "hero_subtitle", value: "We build dynamic, responsive, and high-performance websites tailored for your business growth. Ready for deployment with custom integrations." },
  { key: "about_text", value: "I am Sanskar, a dedicated developer focused on building high-performance web applications. Webora is my vision of providing industry-standard digital solutions to businesses worldwide." }
];

for (const setting of requiredSettings) {
  const exists = db.prepare("SELECT 1 FROM settings WHERE key = ?").get(setting.key);
  if (!exists) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(setting.key, setting.value);
  }
}

// Seed Services if empty
const servicesCount = db.prepare("SELECT count(*) as count FROM services").get() as { count: number };
if (servicesCount.count === 0) {
  const insertService = db.prepare("INSERT INTO services (name, price, features, tier) VALUES (?, ?, ?, ?)");
  insertService.run("Elite", "499", "1 Week Delivery, AI Integration, Database, Vercel Hosting", "elite");
  insertService.run("Pro", "599", "6 Days Delivery, Source Code, Elite Features, Custom Domain", "pro");
  insertService.run("Premium", "999", "5 Days Delivery, All Pro Features, 1 Year Maintenance, 10% Off", "premium");
  insertService.run("Custom", "Contact", "Tailored Solutions, Enterprise Grade, Dedicated Support, Scalable Architecture", "custom");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.get("/api/data", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const projects = db.prepare("SELECT * FROM projects").all();
    const services = db.prepare("SELECT * FROM services").all();
    res.json({ settings, projects, services });
  });

  app.post("/api/messages", (req, res) => {
    const { name, email, message } = req.body;
    db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)").run(name, email, message);
    res.json({ success: true });
  });

  app.get("/api/messages/:email", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages WHERE email = ? ORDER BY created_at ASC").all(req.params.email);
    res.json(messages);
  });

  app.get("/api/admin/messages", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all();
    res.json(messages);
  });

  app.get("/api/admin/threads", (req, res) => {
    const threads = db.prepare(`
      SELECT m1.*, ua.alias 
      FROM messages m1
      JOIN (
        SELECT email, MAX(created_at) as max_created
        FROM messages
        GROUP BY email
      ) m2 ON m1.email = m2.email AND m1.created_at = m2.max_created
      LEFT JOIN user_aliases ua ON m1.email = ua.email
      ORDER BY m1.created_at DESC
    `).all();
    res.json(threads);
  });

  app.delete("/api/admin/threads/:email", (req, res) => {
    db.prepare("DELETE FROM messages WHERE email = ?").run(req.params.email);
    res.json({ success: true });
  });

  app.delete("/api/user/messages/:email", (req, res) => {
    db.prepare("DELETE FROM messages WHERE email = ?").run(req.params.email);
    res.json({ success: true });
  });

  app.post("/api/admin/threads/alias", (req, res) => {
    const { email, alias } = req.body;
    db.prepare("INSERT OR REPLACE INTO user_aliases (email, alias) VALUES (?, ?)").run(email, alias);
    res.json({ success: true });
  });

  app.get("/api/admin/messages/:email", (req, res) => {
    const messages = db.prepare("SELECT * FROM messages WHERE email = ? ORDER BY created_at ASC").all(req.params.email);
    res.json(messages);
  });

  app.post("/api/admin/messages/reply", (req, res) => {
    const { id, reply } = req.body;
    db.prepare("UPDATE messages SET reply = ? WHERE id = ?").run(reply, id);
    res.json({ success: true });
  });

  app.post("/api/admin/update-settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  app.post("/api/admin/projects", (req, res) => {
    const { title, description, image, category, link, plan } = req.body;
    db.prepare("INSERT INTO projects (title, description, image, category, link, plan) VALUES (?, ?, ?, ?, ?, ?)").run(title, description, image, category, link, plan);
    res.json({ success: true });
  });

  app.put("/api/admin/projects/:id", (req, res) => {
    const { title, description, image, category, link, plan } = req.body;
    db.prepare("UPDATE projects SET title = ?, description = ?, image = ?, category = ?, link = ?, plan = ? WHERE id = ?")
      .run(title, description, image, category, link, plan, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/upload", upload.single("image"), (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.delete("/api/admin/projects/:id", (req, res) => {
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/admin/services/update", (req, res) => {
    const { tier, price, features } = req.body;
    if (price !== undefined) {
      db.prepare("UPDATE services SET price = ? WHERE tier = ?").run(price, tier);
    }
    if (features !== undefined) {
      db.prepare("UPDATE services SET features = ? WHERE tier = ?").run(features, tier);
    }
    res.json({ success: true });
  });

  // Admin Auth & Management
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    const admin = db.prepare("SELECT * FROM admins WHERE email = ? AND password = ?").get(email, password) as any;
    if (admin) {
      res.json({ success: true, admin: { email: admin.email, is_super: admin.is_super === 1 } });
    } else {
      res.status(401).json({ error: "Invalid admin credentials" });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    const admins = db.prepare("SELECT id, email, is_super FROM admins").all();
    res.json(admins);
  });

  app.post("/api/admin/users", (req, res) => {
    const { email, password } = req.body;
    try {
      db.prepare("INSERT INTO admins (email, password) VALUES (?, ?)").run(email, password);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    const admin = db.prepare("SELECT is_super FROM admins WHERE id = ?").get(req.params.id) as any;
    if (admin && admin.is_super === 1) {
      return res.status(403).json({ error: "Cannot delete super admin" });
    }
    db.prepare("DELETE FROM admins WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webora Server is now active on port ${PORT}`);
    console.log(`Database initialized: webora.db`);
  });
}

startServer();
