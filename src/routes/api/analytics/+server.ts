import { error, json } from '@sveltejs/kit';
import { verifyMessage } from 'ethers';
import redis from '$lib/server/db.js';

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
	if (addr === address && new Date().getTime() < (Date.parse(datetimefutureweek) + 3600 * 1000)) {
        const lastLogin = await redis.zscore('users', address);
        // Check if user has logged in on card.club before before
        if (lastLogin) {
            const {event_type, deck_id, publisher_id} = await request.json();
            // Send to SxT
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
