import { error } from '@sveltejs/kit';
import decks from './highlighted-decks.json'
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    
    if(decks[params.deck_id]) {
        return {
            questions: decks[params.deck_id],
        };
    }

    throw error(404, 'Not found');
}