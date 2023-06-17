<script lang="ts">
	import { shortcut } from '$lib/utils/shortkey';
	import Spinner from '$lib/components/Spinner.svelte';

	let isFocused = false;
	let loading = false;
	let promptText = '';
	function onFocus() {
		isFocused = true;
	}
	function onBlur() {
		isFocused = false;
	}

	let deck: any[] = [];

	const prompt = async (promptText: String) => {
		const response = await fetch(`/api/prompt`, {
			method: 'POST',
			body: JSON.stringify({ promptText }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const {
			result: { questions }
		} = await response.json();
		deck = questions;
	};
</script>

<main
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex-col justify-center items-start bg-sky-950 overflow-y-auto"
>
	<div class="h-48 relative overflow-hidden isolate bg-gray-900 border-b-2 border-sky-950">
		<div class="px-6 pt-8">
			<div class="mx-auto max-w-2xl text-center">
				<h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Deck Generator</h1>
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
									console.log('promptText', promptText);
									if (promptText) await prompt(promptText);
									loading = false;
								}
							}}
							on:focus={onFocus}
							on:blur={onBlur}
							use:shortcut={{
								shift: true,
								code: 'KeyS',
								callback: () => document.getElementById('prompt')?.focus()
							}}
							bind:value={promptText}
							autocomplete="off"
							type="text"
							name="prompt"
							id="prompt"
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

	{#if deck.length > 0}
		<div class="flex flex-wrap justify-center items-start">
			<div class="bg-white">
				<div class="mx-auto max-w-7xl divide-y divide-gray-900/10 px-6 py-8 lg:px-8">
					<h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">
						Generated Deck for question: {promptText}
					</h2>
					<dl class="mt-10 space-y-8 divide-y divide-gray-900/10">
						{#each deck as card}
							<div class="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
								<dt class="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
									{card.question}
								</dt>
								<dd class="mt-4 lg:col-span-7 lg:mt-0">
									<p class="text-base leading-7 text-gray-600">{card.answer}</p>
								</dd>
							</div>
						{/each}
					</dl>
				</div>
			</div>
		</div>
	{/if}
</main>
