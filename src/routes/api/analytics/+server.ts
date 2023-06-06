import { error, json } from '@sveltejs/kit';
import { verifyMessage } from 'ethers';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
    const {} = await request.json();
    const cookie = cookies.get('verifier-cookie');
    if (!cookie) {
		throw error(401, { message: 'Unauthorized' });
    }
    const { signed, address, datetimenow, datetimefutureweek } = JSON.parse(cookie);
    const addr = verifyMessage(`You are logging in to Card.Club at UTC time: ${datetimenow}. \n\nThis session is valid until UTC time: ${datetimefutureweek}`, signed);

	if (addr === address) {
        // Send to SxT
        return json({
			event_sent: true
		});
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
