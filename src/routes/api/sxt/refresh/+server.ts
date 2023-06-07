import { error, json } from '@sveltejs/kit';
import { BEARER_TOKEN } from '$env/static/private';
import redis from '$lib/server/db.js';
import {SXT_PRIVATE_KEY, SXT_API_URL, SXT_USER_ID, SXT_PUBLIC_KEY} from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const bearer_token = request.headers.get('Authorization')?.split(' ')[1];

	if (bearer_token === BEARER_TOKEN) {
		const authCodeResponse = await fetch(
			`${SXT_API_URL}/v1/auth/code`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId: SXT_USER_ID })
			}
		);
	
		const authCodeData = await authCodeResponse.json();
		const authCode = authCodeData.authCode;
		let message = new TextEncoder().encode(authCode); 

		const jwk = {
			kty: 'OKP',
			crv: 'Ed25519',
			d: SXT_PRIVATE_KEY,
			x: SXT_PUBLIC_KEY,
		  };
		const privkey = await crypto.subtle.importKey("jwk", jwk, {name: "Ed25519"}, true, ["sign"]);

		const myDigest = await crypto.subtle.sign(
			{ name: "Ed25519" },
			privkey,
			message 
		  );

		const authTokenResponse = await fetch(
			`${SXT_API_URL}/v1/auth/token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: SXT_USER_ID,
					authCode: authCode,
					signature: Buffer.from(myDigest).toString('hex').slice(0, 128),
					key: SXT_PUBLIC_KEY,
					scheme: 'ed25519'
				})
			}
		);
		const authTokenData = await authTokenResponse.json();
		const accessToken = authTokenData.accessToken;
		await redis.set('sxt_access_token', accessToken);
		// probably is already refreshed, but just in case
		await redis.expire('sxt_access_token', 1800);
	return json({});
	} else {
		throw error(401, { message: 'Unauthorized' });
	}
}
