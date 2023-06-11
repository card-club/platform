import { error, json } from '@sveltejs/kit';
import {
	BEARER_TOKEN,
	SXT_API_URL,
	SXT_TABLE_BISCUIT,
	SXT_TABLE_RESOURCE_NAME
} from '$env/static/private';
import redis from '$lib/server/db';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const bearer_token = request.headers.get('Authorization')?.split(' ')[1];

	if (bearer_token === BEARER_TOKEN) {
		const { publisherId, linkAmount } = await request.json();

		// For simulation run, so it can run endlessy and doesn't
		if (publisherId === '99999999999999999999') {
			return json({
				adMinutes: 1
			})
		}
		const existingAd = await redis.get(`publisher:${publisherId}:ad`);
		if (existingAd) {
			throw error(400, { message: 'Advertisment already exists' });
		};

		const sxt_access_token = await redis.get('sxt_access_token');
		let publisher_rate: number = (await redis.get(`publisher:${publisherId}:rate`)) || 0;

		// JS logic: if !0 than true and we need to set publisher_rate
		if (!publisher_rate) {
			// Send to SxT
			let queryResp = await fetch(`${SXT_API_URL}/v1/sql/dql`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sxt_access_token}`,
					Biscuit: SXT_TABLE_BISCUIT
				},
				body: JSON.stringify({
					resourceId: SXT_TABLE_RESOURCE_NAME,
					sqlText: `SELECT COUNT(*) as count FROM ${SXT_TABLE_RESOURCE_NAME} WHERE event_timestamp >= NOW() - INTERVAL '7 days' AND event_type = 'deck_end' AND publisher_id = ${publisherId}`
				})
			});

			const body = await queryResp.json();
			let count = body && body[0] ? body[0].count : undefined;
			// TODO: too high, but for beta it's ok. Need to change to more fair formula
			switch (true) {
				// Happens when publisher is new and has no views
				case count === undefined:
					publisher_rate = 1;
					await redis.set(`publisher:${publisherId}:rate`, 1);
					break;
				case count < 100:
					publisher_rate = 1;
					await redis.set(`publisher:${publisherId}:rate`, 1);
					break;
				case count < 1000:
					publisher_rate = 0.2;
					await redis.set(`publisher:${publisherId}:rate`, 0.2);
					break;
				case count < 10000:
					publisher_rate = 0.1;
					await redis.set(`publisher:${publisherId}:rate`, 0.1);
					break;
				case count < 100000:
					publisher_rate = 0.05;
					await redis.set(`publisher:${publisherId}:rate`, 0.05);
					break;
				default:
					publisher_rate = 0.01;
					await redis.set(`publisher:${publisherId}:rate`, 0.01);
					break;
			}
			// TODO: future set this to advertisement ID instead of hardcoded true
			await redis.set(`publisher:${publisherId}:ad`, 'true');
			await redis.expire(
				`publisher:${publisherId}:ad`,
				Math.ceil(publisher_rate * linkAmount * 60 * 60 * 24)
			);
			return json({
				adMinutes: Math.ceil(publisher_rate * linkAmount * 60 * 24)
			});
		} else {
			// TODO: future set this to advertisement ID instead of hardcoded true
			await redis.set(`publisher:${publisherId}:ad`, 'true');
			await redis.expire(
				`publisher:${publisherId}:ad`,
				Math.ceil(publisher_rate * linkAmount * 60 * 60 * 24)
			);
			return json({
				adMinutes: Math.ceil(publisher_rate * linkAmount * 60 * 24)
			});
		}
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
