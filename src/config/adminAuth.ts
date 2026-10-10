const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim();
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

export const isAdminAuthConfigured = Boolean(adminEmail && adminPassword);

export function verifyAdminCredentials(email: string, password: string) {
  return isAdminAuthConfigured && email.trim() === adminEmail && password === adminPassword;
}
