import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function matchesSecret(provided, expected) {
	if (typeof provided !== 'string' || !expected) return false;

	const actualBytes = Buffer.from(provided);
	const expectedBytes = Buffer.from(expected);
	return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function signExpiry(expiry, password) {
	return createHmac('sha256', password)
		.update(`personal-admin-session:${expiry}`)
		.digest('base64url');
}

export function createAdminSession(password) {
	const expiry = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
	return `${expiry}.${signExpiry(expiry, password)}`;
}

export function isAdminSession(session, password) {
	if (!session || !password) return false;

	const [expiry, signature, extra] = session.split('.');
	return (
		extra === undefined &&
		/^\d+$/.test(expiry) &&
		Number(expiry) > Math.floor(Date.now() / 1000) &&
		matchesSecret(signature, signExpiry(expiry, password))
	);
}
