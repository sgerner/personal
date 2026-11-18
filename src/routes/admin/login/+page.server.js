import { env } from '$env/dynamic/private';
import {
	ADMIN_SESSION_COOKIE,
	ADMIN_SESSION_MAX_AGE,
	createAdminSession,
	matchesSecret
} from '$lib/server/admin-session';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		if (!env.ADMIN_PASSWORD) {
			return fail(503, { error: 'Admin login is unavailable' });
		}

		const data = await request.formData();
		if (!matchesSecret(data.get('password'), env.ADMIN_PASSWORD)) {
			return fail(400, { error: 'Invalid password' });
		}

		cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(env.ADMIN_PASSWORD), {
			path: '/admin',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: ADMIN_SESSION_MAX_AGE
		});
		redirect(303, '/admin');
	},
	logout: async ({ cookies }) => {
		cookies.delete(ADMIN_SESSION_COOKIE, { path: '/admin' });
		redirect(303, '/admin/login');
	}
};
