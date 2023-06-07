<script lang="ts">
	import { shortcut } from '$lib/utils/shortkey';
	import Spinner from '$lib/components/Spinner.svelte';

	let isFocused = false;
	let loading = false;
	let searchText = '';
	function onFocus() {
		isFocused = true;
	}
	function onBlur() {
		isFocused = false;
	}

	const search = async (searchText: String) => {
		const response = await fetch(`/api/search`, {
			method: 'POST',
			body: JSON.stringify({ searchText }),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log('searching for', response);
	};
</script>

<main
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex-col justify-center items-start bg-sky-950 overflow-y-auto"
>
	<div class="relative isolate overflow-hidden bg-gray-900 border-b-2 border-sky-950">
		<div class="px-6 py-32">
			<div class="mx-auto max-w-2xl text-center">
				<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
					Easy learning with our <span class="underline">decks</span>
				</h1>
				<p class="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-300">
					Find many high quality flashcard decks or<br /> generate one yourself with the power of AI
				</p>
				<div class="mt-6 -mb-20 flex items-center justify-center">
					<div class="relative my-1 -mb-0.5 flex items-center">
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
								if (event.key === 'Enter') {
									loading = true;
									if (searchText) await search(searchText);
									loading = false;
								}
							}}
							on:focus={onFocus}
							on:blur={onBlur}
							use:shortcut={{
								shift: true,
								code: 'KeyS',
								callback: () => document.getElementById('search')?.focus()
							}}
							bind:value={searchText}
							autocomplete="off"
							type="text"
							name="search"
							id="search"
							placeholder="What do you want to learn today?"
							class={`${
								isFocused ? 'pr-20' : 'pr-24'
							} pl-12 block w-[400px] rounded-full border-0 pb-1.5 pt-2 pr-18 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6`}
						/>
						{#if loading}
							<div class="absolute inset-y-0 right-0 flex py-2 pr-1.5">
								<Spinner size={2} />
							</div>
						{:else if isFocused}
							<div class="absolute inset-y-0 right-2 flex py-2 pr-1.5">
								<kbd
									class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
									>Enter ⏎</kbd
								>
							</div>
						{:else}
							<div class="absolute inset-y-0 right-2 flex py-2 pr-1.5">
								<kbd
									class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
									>Shift ⇧ + S</kbd
								>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<svg
			viewBox="0 0 1024 1024"
			class="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
			aria-hidden="true"
		>
			<circle
				cx="512"
				cy="512"
				r="512"
				fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
				fill-opacity="0.7"
			/>
			<defs>
				<radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
					<stop stop-color="#EF4444" />
					<stop offset="1" stop-color="#38bdf8" />
				</radialGradient>
			</defs>
		</svg>
	</div>

	<h1
		class="border-b-2 border-r border-t border-l border-sky-300 text-center text-lg mt-10 mb-12 text-white bg-sky-800 w-[220px] mx-auto px-2 pb-1 pt-1.5 font-light rounded-br-md rounded-tl-md"
	>
		Highlighted Flashcards
	</h1>
	<div class="flex flex-wrap justify-center items-start">
		{#each [1, 2, 3, 4, 5, 6] as card}
			<a
				href="/publisher/1/deck/1"
				class="card mb-10 mx-10 hover:-translate-y-0.5 cursor-pointer border-2 border-sky-300 flex-col justify-center items-center"
			>
				<img class="rounded-tl-3xl rounded-tr-3xl" src="https://loremflickr.com/640/360" alt="" />
				<h2 class="text-lg truncate w-[360px] break-normal text-center mt-2">
					How do you survive a hurricane?
				</h2>
			</a>
		{/each}
	</div>
</main>
