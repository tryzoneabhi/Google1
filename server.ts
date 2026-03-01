import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("webora.db");

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
    link TEXT
  );
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price TEXT,
    features TEXT,
    tier TEXT
  );
`);

// Seed initial data if empty
const settingsCount = db.prepare("SELECT count(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("admin_email", "1singhsanskar11@gmail.com");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("whatsapp_link", "https://wa.me/yournumber");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("instagram_link", "https://instagram.com/sanskar");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("youtube_link", "https://youtube.com/sanskar");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("footer_text", "© 2024 Webora. Built by Sanskar.");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("hero_title", "Crafting Industry-Level Digital Experiences");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("hero_subtitle", "We build dynamic, responsive, and high-performance websites tailored for your business growth. Ready for deployment with custom integrations.");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("about_text", "I am Sanskar, a dedicated developer focused on building high-performance web applications. Webora is my vision of providing industry-standard digital solutions to businesses worldwide.");
  
  // Seed Services
  const insertService = db.prepare("INSERT INTO services (name, price, features, tier) VALUES (?, ?, ?, ?)");
  insertService.run("Elite", "499", "1 Week Delivery, AI Integration, Database, Vercel Hosting", "elite");
  insertService.run("Pro", "599", "6 Days Delivery, Source Code, Elite Features, Custom Domain", "pro");
  insertService.run("Premium", "999", "5 Days Delivery, All Pro Features, 1 Year Maintenance, 10% Off", "premium");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/data", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const projects = db.prepare("SELECT * FROM projects").all();
    const services = db.prepare("SELECT * FROM services").all();
    res.json({ settings, projects, services });
  });

  app.post("/api/admin/update-settings", (req, res) => {
    const { key, value } = req.body;
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  app.post("/api/admin/projects", (req, res) => {
    const { title, description, image, category, link } = req.body;
    db.prepare("INSERT INTO projects (title, description, image, category, link) VALUES (?, ?, ?, ?, ?)").run(title, description, image, category, link);
    res.json({ success: true });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
