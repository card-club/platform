import { error, json } from '@sveltejs/kit';
import { BEARER_TOKEN } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	console.log("happens");
	const bearer_token = request.headers.get('Authorization')?.split(' ')[1];
	console.log("should work");

	if (bearer_token === BEARER_TOKEN) {
		const { publisherId, linkAmount } = await request.json();
		console.log("returns adBought true");
		return json({
			adBought: true
		});
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
