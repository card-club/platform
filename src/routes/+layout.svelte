<script lang="ts">
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { shortcut } from '$lib/utils/shortkey';
	import '../app.css';
	import Spinner from '$lib/components/Spinner.svelte';
	import { defaultEvmStores, signerAddress, signer } from 'ethers-svelte';
	import { authenticated } from '$lib/stores/auth';

	let isFocused = false;
	let loading = false;
	let searchText = '';
	const options = {
		reversed: false,
		intro: {
			y: '-20px',
			x: '20px',
		}
	};

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
		})

		console.log('searching for', response);
	}

	const connect = async () => {
        defaultEvmStores.setProvider().then(async () => {
			const now = new Date();
			const datetimenow = now.toUTCString();
			const weekInMilliseconds = 1000*60*60*24*7;
			const datetimefutureweek = new Date(now.getTime() + weekInMilliseconds).toUTCString();
			const signed = await $signer.signMessage(`You are logging in to Card.Club at UTC time: ${datetimenow}. \n\nThis session is valid until UTC time: ${datetimefutureweek}`);
			
			const response = await fetch(`/api/auth`, {
				method: 'POST',
				body: JSON.stringify({ address: $signerAddress, signed, datetimenow, datetimefutureweek }),
				headers: {
					'content-type': 'application/json'
				}
			})
			if (response.ok) {
				authenticated.set(true);
				toast.push('Connected Wallet');
			} else {
				defaultEvmStores.disconnect();
				toast.push('Failed to connect Wallet');
			}
		}).catch((e) => {
			defaultEvmStores.disconnect();
			toast.push('Failed to connect Wallet');
		})
    }

    const logout = async () => {
		const response = await fetch(`/api/auth`, {
			method: 'POST',
			body: JSON.stringify({ address: $signerAddress, logout: true }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			authenticated.set(false);
			defaultEvmStores.disconnect();
			toast.push('Disconnected Wallet');
		} else {
			toast.push('Failed to disconnect Wallet');
		}
    }
	
</script>

<header class="w-screen flex justify-between border-b">
	<a href="/" class="flex justify-center items-end">
		<img class="h-[22px] mb-[12px] -mr-0.5 ml-3" src="/cardclub-logo.svg" alt="CardClub Logo" />
		<h1 class="text-[26px]">ard.Club</h1>
	</a>	
	
	<!-- TODO: under 800 px width need to its own full-width -->
	<div class="relative my-1 -mb-0.5 flex items-center hidden lg:block">
		<div class="absolute -top-1.5 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
			<div class="absolute -top-1.5 inset-y-0 right-0 flex py-3 pr-1.5">
				<Spinner size={2} />
			</div>
		{:else if isFocused}
			<div class="absolute -top-1.5 inset-y-0 right-2 flex py-3 pr-1.5">
				<kbd
					class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
					>Enter ⏎</kbd
				>
			</div>
		{:else}
			<div class="absolute -top-1.5 inset-y-0 right-2 flex py-3 pr-1.5">
				<kbd
					class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
					>Shift ⇧ + S</kbd
				>
			</div>
		{/if}
	</div>
	
	
	<!-- Login -->
    {#if !$authenticated}
        <button class="flex justify-center items-center w-[170px] text-gray-800 text-base h-[38px] mr-2 border border-gray-200 my-1 pt-1 rounded" on:click={connect}>
			<svg class="mr-2 mb-1 fill-gray-600" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" viewBox="0 0 76.304 76.304"><path d="M72.325 33.234v-2.947c0-5.389-3.698-9.919-8.686-11.217l-.009-4.859c0-4.742-3.859-8.601-8.603-8.601h-.455L14.31 18.1a8.487 8.487 0 0 0-2.604.584h-.105C5.205 18.684 0 23.889 0 30.287v28.804c0 6.397 5.204 11.603 11.601 11.603h49.123c6.396 0 11.601-5.205 11.601-11.603V55.26c2.323-.899 3.979-3.151 3.979-5.789v-10.45c-.001-2.636-1.656-4.888-3.979-5.787zM70.303 49.47a.21.21 0 0 1-.211.211H53.851a.208.208 0 0 1-.21-.211V39.021a.21.21 0 0 1 .21-.209h16.241a.21.21 0 0 1 .211.209V49.47zM55.398 11.637a2.606 2.606 0 0 1 2.232 2.579l.008 4.469H32.679l22.719-7.048zm5.326 53.056H11.602a5.603 5.603 0 0 1-5.601-5.603V30.287a5.602 5.602 0 0 1 5.601-5.603h49.122a5.601 5.601 0 0 1 5.601 5.603v2.525H53.851a6.216 6.216 0 0 0-6.21 6.209V49.47a6.218 6.218 0 0 0 6.21 6.211h12.474v3.41a5.602 5.602 0 0 1-5.601 5.602z"/></svg>			
			Connect Wallet
			<div class="bg-red-500 animate-bounce w-2 h-2 ml-2 -mt-4 rounded-full"></div>
		</button>
    {:else}
		<button class="flex justify-center text-gray-600 items-center w-[170px] text-base h-[38px] mr-2 border border-gray-200 pl-2 pr-1 my-1 pt-1 rounded" on:click={logout}>
			<svg class="mr-2 mb-1 fill-gray-600" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="20" height="20" viewBox="0 0 76.304 76.304"><path d="M72.325 33.234v-2.947c0-5.389-3.698-9.919-8.686-11.217l-.009-4.859c0-4.742-3.859-8.601-8.603-8.601h-.455L14.31 18.1a8.487 8.487 0 0 0-2.604.584h-.105C5.205 18.684 0 23.889 0 30.287v28.804c0 6.397 5.204 11.603 11.601 11.603h49.123c6.396 0 11.601-5.205 11.601-11.603V55.26c2.323-.899 3.979-3.151 3.979-5.789v-10.45c-.001-2.636-1.656-4.888-3.979-5.787zM70.303 49.47a.21.21 0 0 1-.211.211H53.851a.208.208 0 0 1-.21-.211V39.021a.21.21 0 0 1 .21-.209h16.241a.21.21 0 0 1 .211.209V49.47zM55.398 11.637a2.606 2.606 0 0 1 2.232 2.579l.008 4.469H32.679l22.719-7.048zm5.326 53.056H11.602a5.603 5.603 0 0 1-5.601-5.603V30.287a5.602 5.602 0 0 1 5.601-5.603h49.122a5.601 5.601 0 0 1 5.601 5.603v2.525H53.851a6.216 6.216 0 0 0-6.21 6.209V49.47a6.218 6.218 0 0 0 6.21 6.211h12.474v3.41a5.602 5.602 0 0 1-5.601 5.602z"/></svg>			
			{$signerAddress.slice(0, 6)}...{$signerAddress.slice(-4)}
			<div class="bg-green-500 w-2 h-2 ml-2 -mt-4 rounded-full"></div>
		</button>
	{/if}
</header>
<slot />
<SvelteToast {options} />


<style>
	:root {
	  --toastContainerTop: auto;
	  --toastContainerRight: 2rem;
	  --toastContainerBottom: 2rem;
	  --toastContainerLeft: auto;
	}</style>
  