import { error, json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { promptText } = await request.json();

	const url = 'https://api.openai.com/v1/chat/completions';
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo-0613',
			messages: [
				{
					role: 'user',
					content: `${promptText} Can you setup 10 questions and answers about the previous question/sentence so I can learn about it.
             Can you return only the following JSON format: {"questions": [{"question": "question?", "answer": "Answer"}]}?`
				}
			],
			functions: [
				{
					name: 'generate_questions',
					parameters: {
						type: 'object',
						properties: {
							questions: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										question: {
											type: 'string'
										},
										answer: {
											type: 'string'
										}
									},
									required: ['question', 'answer']
								}
							}
						},
						required: ['questions']
					}
				}
			],
			function_call: { name: 'generate_questions' }
		})
	};
	const response = await fetch(url, requestOptions);
	const jsonData = await response.json();

	return json({
		result: JSON.parse(jsonData.choices[0].message?.function_call?.arguments)
	});
}
