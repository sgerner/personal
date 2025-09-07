import { ADMIN_PASSWORD } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (password === ADMIN_PASSWORD) {
			cookies.set('session', 'loggedin', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
			throw redirect(303, '/admin');
		} else {
			return fail(400, { error: 'Invalid password' });
		}
	},
	logout: async ({ cookies }) => {
		cookies.delete('session', { path: '/' });
		throw redirect(303, '/admin/login');
	}
};
