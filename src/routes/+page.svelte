<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	let questions: any = [
		{
			question: 'What should I do immediately if my boat sinks?',
			answer: 'Try to stay calm and get out of the boat as quickly as possible.'
		},
		{
			question: 'What should I do if I cannot get out of the sinking boat?',
			answer: 'Stay with the boat. It can provide some flotation and shelter from the elements.'
		},
		{
			question: 'What should I do if I am in the water?',
			answer:
				'Try to find something that floats, like a piece of wreckage, or use your body to float.'
		},
		{
			question: 'What should I do if I am alone?',
			answer:
				'Try to stay calm and conserve your energy. It is important to stay hydrated and try to find a source of food if possible.'
		},
		{
			question: 'What should I do if I am with other people?',
			answer:
				'Try to keep everyone together if possible. Support each other mentally and physically.'
		},
		{
			question: 'What should I do if I see a rescue plane or ship?',
			answer:
				'Use any means possible to signal for help, such as waving brightly colored clothing or using a mirror to reflect sunlight.'
		},
		{
			question: 'How can I stay alive in the ocean?',
			answer:
				'Try to stay hydrated by drinking small amounts of seawater and rainwater. Find a source of food, such as fish or seaweed.'
		},
		{
			question: 'What are the dangers of being in the ocean for an extended period of time?',
			answer:
				'Exposure to the sun and saltwater can cause dehydration, hypothermia, and physical stress. There is also the risk of encountering dangerous marine animals or storms.'
		},
		{
			question: 'What should I do if it starts raining?',
			answer: 'Try to collect rainwater using a tarpaulin, plastic bag, or any other container.'
		},
		{
			question: 'What should I do if I am losing hope?',
			answer:
				'Try to focus on survival tasks and take it one day at a time. Keep your mind and body active to maintain your physical and mental health.'
		}
	];
	let questionIndex = 0;
	let question = questions[questionIndex].question;
	let answer = questions[questionIndex].answer;
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
			showCardBack = false;
		}
	};
	const nextCard = () => {
		if (questionIndex === questions.length - 1) {
			toast.push('You are already on the last card.');
		} else {
			questionIndex++;
			question = questions[questionIndex].question;
			answer = questions[questionIndex].answer;
			showCardBack = false;
		}
	};
</script>

<main style="height: calc(100vh - 47px)" class="w-screen h-screen flex flex-col justify-start items-center bg-gray-100">
    {#if error}
        <p>{error}</p>
    {:else}
        <div class="flex flex-col justify-center items-center mt-16">
			<div class="flip-box">
				<div on:click={toggleShowBack} class="flip-box-inner cursor-pointer" class:flip-it={showCardBack}>
					<Flashcard {question} {answer} {showCardBack} />
				</div>
			</div>
			<div class="flex justify-center items-center space-x-4 pt-4">
				<button class="text-xl cursor-pointer text-gray-800 bg-white w-10 h-10 rounded-full flex justify-center items-center pr-1 border" on:click={previousCard}>
					<svg class="flip-it" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" viewBox="0 0 124.512 124.512">
						<path d="m113.956 57.006-97.4-56.2c-4-2.3-9 .6-9 5.2v112.5c0 4.6 5 7.5 9 5.2l97.4-56.2c4-2.401 4-8.2 0-10.5z"/>
					</svg>
				</button>
				<p class="text-lg cursor-pointer text-gray-700">{questionIndex + 1 }/{questions.length}</p>
				<button class="text-xl cursor-pointer text-gray-800 bg-white w-10 h-10 rounded-full flex justify-center items-center pl-1 border" on:click={nextCard}>
					<svg  xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" viewBox="0 0 124.512 124.512">
						<path d="m113.956 57.006-97.4-56.2c-4-2.3-9 .6-9 5.2v112.5c0 4.6 5 7.5 9 5.2l97.4-56.2c4-2.401 4-8.2 0-10.5z"/>
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
