<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { swipe } from 'svelte-gestures';

	onMount(async () => {
		await fetch(`/api/analytics`, {
			method: 'POST',
			body: JSON.stringify({
				event_type: 'deck_start',
				publisher_id: '1',
				deck_id: '1'
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
	});
	export let data;
	// TODO: get questions from database
	let questions: any = data.questions;
	let questionIndex = 0;
	let question = questions[questionIndex].question;
	let answer = questions[questionIndex].answer;
	let imgSrc = '';
	let adUrl = '';
	let error = '';
	let showCardBack = false;

	const toggleShowBack = () => (showCardBack = !showCardBack);
	const previousCard = () => {
		if (questionIndex === 0) {
			toast.push('You are already on the first card.');
		} else {
			questionIndex--;
			question = questions[questionIndex].question;
			answer = questions[questionIndex].answer;
			imgSrc = questions[questionIndex].imgSrc;
			adUrl = questions[questionIndex].adUrl;
			showCardBack = false;
		}
	};
	const nextCard = async () => {
		if (questionIndex === questions.length - 1) {
			toast.push('You are already on the last card.');
		} else {
			questionIndex++;
			question = questions[questionIndex].question;
			answer = questions[questionIndex].answer;
			imgSrc = questions[questionIndex].imgSrc;
			adUrl = questions[questionIndex].adUrl;
			showCardBack = false;
			if (questionIndex === questions.length - 2) {
				await fetch(`/api/analytics`, {
					method: 'POST',
					body: JSON.stringify({
						event_type: 'deck_end',
						publisher_id: '1',
						deck_id: '1'
					}),
					headers: {
						'content-type': 'application/json'
					}
				});
			}
			if (adUrl && questionIndex === questions.length - 1) {
				await fetch(`/api/analytics`, {
					method: 'POST',
					body: JSON.stringify({
						event_type: 'ad_view',
						publisher_id: '1',
						deck_id: '1'
					}),
					headers: {
						'content-type': 'application/json'
					}
				});
			}
		}
	};

	function swipeHandler(event: { detail: { direction: string } }) {
		if (event.detail.direction === 'left') nextCard();
		if (event.detail.direction === 'right') previousCard();
	}
</script>

<main
	use:swipe={{ timeframe: 300, minSwipeDistance: 60 }}
	on:swipe={swipeHandler}
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex flex-col justify-start items-center bg-gray-100"
>
	{#if error}
		<p>{error}</p>
	{:else}
		<div class="flex flex-col justify-center items-center mt-16">
			<div class="flip-box">
				<div
					on:click={!adUrl && toggleShowBack}
					class="flip-box-inner cursor-pointer"
					class:flip-it={showCardBack}
				>
					<Flashcard {imgSrc} {adUrl} {question} {answer} {showCardBack} />
				</div>
			</div>
			<div class="flex justify-center items-center space-x-4 pt-4">
				<button
					class="text-xl cursor-pointer text-gray-800 bg-white w-10 h-10 rounded-full flex justify-center items-center pr-1 border-[3.5px] border-sky-300"
					on:click={previousCard}
					disabled={questionIndex === 0}
					class:opacity-20={questionIndex === 0}
					class:cursor-default={questionIndex === 0}
				>
					<svg
						class="flip-it"
						xmlns="http://www.w3.org/2000/svg"
						xml:space="preserve"
						width="16"
						height="16"
						viewBox="0 0 124.512 124.512"
					>
						<path
							d="m113.956 57.006-97.4-56.2c-4-2.3-9 .6-9 5.2v112.5c0 4.6 5 7.5 9 5.2l97.4-56.2c4-2.401 4-8.2 0-10.5z"
						/>
					</svg>
				</button>
				<p class="text-lg cursor-pointer text-sky-100">{questionIndex + 1}/{questions.length}</p>
				<button
					class="text-xl cursor-pointer text-gray-800 bg-white w-10 h-10 rounded-full flex justify-center items-center pl-1 border-[3.5px] border-sky-300"
					on:click={nextCard}
					disabled={questionIndex === questions.length - 1}
					class:opacity-20={questionIndex === questions.length - 1}
					class:cursor-default={questionIndex === questions.length - 1}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xml:space="preserve"
						width="16"
						height="16"
						viewBox="0 0 124.512 124.512"
					>
						<path
							d="m113.956 57.006-97.4-56.2c-4-2.3-9 .6-9 5.2v112.5c0 4.6 5 7.5 9 5.2l97.4-56.2c4-2.401 4-8.2 0-10.5z"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	/* The flip box container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
	.flip-box {
		background-color: transparent;
		height: 260px;
		width: 380px;
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
		backface-visibility: hidden;
		transform-style: preserve-3d;
	}

	/* This container is needed to position the front and back side */
	.flip-box-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.4s;
		transform-style: preserve-3d;
	}

	/* Do an horizontal flip on button click */
	.flip-it {
		transform: rotateY(180deg);
	}
</style>
