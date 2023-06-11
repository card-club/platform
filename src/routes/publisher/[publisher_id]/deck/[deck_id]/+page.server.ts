import { error } from '@sveltejs/kit';
import decks from './highlighted-decks.json';
import redis from '$lib/server/db';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const addAd = await redis.get(`publisher:${params.publisher_id}:ad`);

	if (decks[params.deck_id]) {
		return {
			questions: addAd
				? decks[params.deck_id].concat([
						{
							question: 'Chainlink SmartCon 2023 - Visit us',
							answer: '',
							showCardBack: false,
							imgSrc: '/Chainlink-SmartCon-2023.png',
							adUrl: 'https://smartcon.chain.link/'
						}
				  ])
				: decks[params.deck_id].concat([
						{
							question: 'Well done, you have completed the deck!',
							answer: '',
							showCardBack: false,
							imgSrc: '/great-job.gif',
							adUrl: 'https://card.club/'
						}
				  ])
		};
	}

	throw error(404, 'Not found');
}
