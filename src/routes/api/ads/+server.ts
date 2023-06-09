import { error, json } from '@sveltejs/kit';
import { BEARER_TOKEN } from '$env/static/private';
import redis from '$lib/server/db';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const bearer_token = request.headers.get('Authorization')?.split(' ')[1];

	if (bearer_token === BEARER_TOKEN) {
		const { publisherId, linkAmount } = await request.json();
		// TODO: make publisherId configurable
		await redis.set('publisher:1', 'true')
		// 1 link for 1 day ad
		await redis.expire('publisher:1', 60 * 60 * 24 )
		return json({
			adViews: 1
		});
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}