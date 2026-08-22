import fs from 'fs';
import path from 'path';

// Playwright's default storageState output already lives under playwright/.auth,
// so the credentials file that seeds it lives alongside it.
const AUTH_DIR = path.join(process.cwd(), 'playwright', '.auth');

export const CREDENTIALS_PATH = path.join(AUTH_DIR, 'credentials.json');
export const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'login-data.json');

export interface StoredCredentials {
  email: string;
  password: string;
}

export function hasStoredCredentials(): boolean {
  return fs.existsSync(CREDENTIALS_PATH);
}

export function readCredentials(): StoredCredentials {
  const raw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(raw) as StoredCredentials;
}

export function saveCredentials(credentials: StoredCredentials): void {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(credentials, null, 2));
}
