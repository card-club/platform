import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { publisherId, linkAmount } = await request.json();
    console.log(publisherId, linkAmount)
    return json({
        adViews: 50000
    });
}