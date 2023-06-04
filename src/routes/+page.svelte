<script lang="ts">
	import { enhance } from '$app/forms';
	import { shortcut } from '$lib/utils/shortkey';
	import Spinner from '$lib/components/Spinner.svelte';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { connected, signerAddress, defaultEvmStores } from 'ethers-svelte';
	
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
    let error = '';
	let isFocused = false;
	let loading = false;
	function onFocus() {
		isFocused = true;
	}
	function onBlur() {
		isFocused = false;
	}
	let showCardBack = false;
	const toggleShowBack = () => (showCardBack = !showCardBack);

    const login = () => {
        defaultEvmStores.setProvider();
    }

    const logout = () => {
        defaultEvmStores.disconnect();
    }

	const handleSubmit: SubmitFunction = () => {
        error='';
		loading = true;

		return async ({ action, result }: any) => {
            try {
                questions = JSON.parse(result.data).questions;
            } catch (e) {
                try {
                    JSON.parse(result.data.split('{')[1]).questions;
                } catch (e) {
                    error = result.data;
                }
            }
            loading = false;
		};
	};
</script>

<main class="w-screen h-screen flex flex-col justify-start mt-20 items-center">
	<div class="flex justify-center items-end">
		<img class="h-12 mb-4 -mr-1" src="/cardclub-logo.svg" alt="CardClub Logo" />
		<h1 class="text-[40px]">ard.Club</h1>
	</div>
	<form
		action="?/submit"
		method="POST"
		enctype="multipart/form-data"
		use:enhance={handleSubmit}
		id="upload"
		name="upload"
	>
		<div class="relative my-2 flex items-center">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				{#if isFocused}
					<p class="text-4xl text-gray-500 pt-1.5">⌨</p>
				{:else}
					<svg
						aria-hidden="true"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				{/if}
			</div>
			<input
				on:keydown={async (event) => {
					if (event.key === 'Escape') {
						event.target?.blur();
					}
				}}
				on:focus={onFocus}
				on:blur={onBlur}
				use:shortcut={{
					shift: true,
					code: 'KeyS',
					callback: () => document.getElementById('search')?.focus()
				}}
				autocomplete="off"
				type="text"
				name="search"
				id="search"
				placeholder="What do you want to learn today?"
				class={`${
					isFocused ? 'pr-20' : 'pr-24'
				} pl-10 block w-[400px] rounded-full border-0 pb-1.5 pt-2 pr-18 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6`}
			/>
			{#if loading}
				<div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
					<Spinner size={2} />
				</div>
			{:else if isFocused}
				<div class="absolute inset-y-0 right-2 flex py-1.5 pr-1.5">
					<kbd
						class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
						>Enter ⏎</kbd
					>
				</div>
			{:else}
				<div class="absolute inset-y-0 right-2 flex py-1.5 pr-1.5">
					<kbd
						class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
						>Shift ⇧ + S</kbd
					>
				</div>
			{/if}
		</div>
	</form>
    {#if !$connected}
        <button on:click={login}>Login</button>
    {:else}
    {$signerAddress}
        <button on:click={logout}>Logout</button>
    {/if}
	<button on:click={toggleShowBack}>Toggle</button>
    {#if error}
        <p>{error}</p>
    {:else}
        <div class="flex flex-wrap justify-center space-y-10 space-x-10 pb-10">
            <div />
            {#if questions}
                {#each questions as { question, answer }}
                    <div class="flip-box">
                        <div class="flip-box-inner" class:flip-it={showCardBack}>
                            <Flashcard {question} {answer} {showCardBack} />
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</main>

<style>
	/* The flip box container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
	.flip-box {
		background-color: transparent;
		height: 280px;
		width: 400px;
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

	button {
		background-color: hsl(65, 6%, 40%);
		padding: 10px 10px;
		color: white;
		cursor: pointer;
	}

	button:active {
		background-color: hsl(50, 65%, 25%);
	}
</style>
