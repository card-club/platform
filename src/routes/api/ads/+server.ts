import { error, json } from '@sveltejs/kit';
import { BEARER_TOKEN } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const bearer_token = request.headers.get('Authorization')?.split(' ')[1];

	if (bearer_token === BEARER_TOKEN) {
		const { publisherId, linkAmount } = await request.json();
		return json({
			adViews: 50000
		});
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
