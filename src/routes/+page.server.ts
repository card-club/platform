import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
	submit: async ({ request }: any) => {
		const promptFormData = await request.formData();
		const textPrompt = promptFormData.get('search') as string;

		const configuration = new Configuration({
			apiKey: OPENAI_API_KEY
		});

		const openai = new OpenAIApi(configuration);

		const textResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: `${textPrompt} Can you setup 10 questions and answers about the previous question so I can learn about it. Can you return only the following JSON format: {"questions": [{"question": "How can I survive in a desert?", "answer": "Don't go there"}]}?`
				}
			]
		});
		if(textResponse?.data?.choices[0]?.message?.content) {
			return {
				response: textResponse.data.choices[0].message?.content
			};
		} else {
			return textResponse
		}
	}
};
