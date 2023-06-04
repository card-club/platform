import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { Actions } from './$types';
import fetchAdapter from "@vespaiach/axios-fetch-adapter";

export const actions: Actions = {
	submit: async ({ request }: any) => {
		const promptFormData = await request.formData();
		const textPrompt = promptFormData.get('search') as string;
		console.log("start configuration");
		const configuration = new Configuration({
			apiKey: OPENAI_API_KEY,
			baseOptions: {
				adapter: fetchAdapter
			  }		  
		});
		console.log("config init");

		const openai = new OpenAIApi(configuration);
		console.log("start createChatCompletion");

		try {
			const textResponse = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `${textPrompt} Can you setup 10 questions and answers about the previous question so I can learn about it. Can you return only the following JSON format: {"questions": [{"question": "How can I survive in a desert?", "answer": "Don't go there"}]}?`
					}
				]
			});
			console.log(textResponse);
			if(textResponse?.data?.choices[0]?.message?.content) {
				return {
					response: textResponse.data.choices[0].message?.content
				};
			} else {
				return textResponse
			}
		} catch (e) {
			console.log(e);
		}
	}
};
