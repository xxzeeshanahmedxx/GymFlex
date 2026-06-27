import crypto from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const email = process.env.ADMIN_EMAIL || 'admin@example.com';
const name = process.env.ADMIN_NAME || 'Admin';
const password = process.env.ADMIN_PASSWORD || 'ChangeMeAdmin2026!';
const salt = crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
const passwordHash = `pbkdf2$${100000}$${salt.toString('base64')}$${hash.toString('base64')}`;

const sql = `INSERT INTO admin_users (id, email, name, password_hash, is_active)
VALUES ('admin-user', '${email.replace(/'/g, "''")}', '${name.replace(/'/g, "''")}', '${passwordHash}', 1)
ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, password_hash = excluded.password_hash, is_active = 1, updated_at = CURRENT_TIMESTAMP;\n`;

const outputPath = path.resolve('migrations/0003_bootstrap_admin.sql');
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, sql);
console.log(`Wrote ${outputPath}`);
