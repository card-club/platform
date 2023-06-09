import { error, json } from '@sveltejs/kit';
import { verifyMessage } from 'ethers';
import redis from '$lib/server/db.js';
import { SXT_TABLE_BISCUIT, SXT_TABLE_RESOURCE_NAME, SXT_API_URL } from '$env/static/private';

// Hacky workaround to get random int instead of autoincrementing int from SxT
function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const cookie = cookies.get('verifier-cookie');
	if (!cookie) {
		throw error(401, { message: 'Unauthorized' });
	}
	const { signed, address, datetimenow, datetimefutureweek } = JSON.parse(cookie);
	const addr = verifyMessage(
		`You are logging in to Card.Club at UTC time: ${datetimenow}. \n\nThis session is valid until UTC time: ${datetimefutureweek}`,
		signed
	);

	// Check if address is in redis and if the datetimefutureweek is still valid (give 1 hour leeway)
	if (addr === address && new Date().getTime() < Date.parse(datetimefutureweek) + 3600 * 1000) {
		// Check if user has logged in on card.club before before
		const lastLogin = await redis.zscore('users', address);
		if (lastLogin) {
			const { event_type, deck_id, publisher_id } = await request.json();
			// Get SxT token
			const sxt_access_token = await redis.get('sxt_access_token');
			// Send to SxT
			console.log(datetimefutureweek);
			const resp = await fetch(`${SXT_API_URL}/v1/sql/dml`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sxt_access_token}`,
					Biscuit: SXT_TABLE_BISCUIT
				},
				body: JSON.stringify({
					resourceId: SXT_TABLE_RESOURCE_NAME,
					sqlText: `INSERT INTO ${SXT_TABLE_RESOURCE_NAME} (ID, PUBLISHER_ID, DECK_ID, EVENT_TYPE, PUBLIC_KEY_STRING, SIGNED_TIMESTAMP, TIMESTAMP_UTC_START_SESSION, TIMESTAMP_UTC_END_SESSION) VALUES (${getRandomInt(
						1,
						1000000000
					)}, ${publisher_id}, ${deck_id}, '${event_type}', '${address}', '${signed}', '${datetimenow}', '${datetimefutureweek}')`
				})
			});
			console.log(await resp.json());
			return json({
				event_received: true
			});
		} else {
			throw error(401, { message: 'Unauthorized' });
		}
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
