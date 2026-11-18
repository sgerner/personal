import { env } from '$env/dynamic/private';
import { ADMIN_SESSION_COOKIE, isAdminSession } from '$lib/server/admin-session';

export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;
	if (pathname !== '/admin' && !pathname.startsWith('/admin/')) return resolve(event);

	const robots = { 'X-Robots-Tag': 'noindex, nofollow' };
	if (
		pathname !== '/admin/login' &&
		!isAdminSession(event.cookies.get(ADMIN_SESSION_COOKIE), env.ADMIN_PASSWORD)
	) {
		return new Response(null, {
			status: 303,
			headers: { ...robots, location: '/admin/login' }
		});
	}

	event.setHeaders(robots);
	return resolve(event);
}
