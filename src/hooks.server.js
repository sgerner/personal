// JS only; remove TS annotations
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith('/admin')) {
		if (event.url.pathname !== '/admin/login') {
			const session = event.cookies.get('session');
			if (session !== 'loggedin') {
				throw redirect(303, '/admin/login');
			}
		}
	}

	return resolve(event);
}
