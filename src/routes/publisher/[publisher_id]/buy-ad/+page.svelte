<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { onMount } from 'svelte';
	import { defaultEvmStores as evm, contracts, signerAddress } from 'ethers-svelte';
	import { chainlink } from '$lib/abis/chainlink';
	import { cardclub } from '$lib/abis/cardclub';
	import { authenticated } from '$lib/stores/auth';
	import { parseEther, encodeBytes32String } from 'ethers';
	import { toast } from '@zerodevx/svelte-toast';

	const cardClubContractAddress = '0x13c685110A59fc8b287E5309c4702503aE822e5D';
	const subscriptionId = 42;
	const chainlinkContractAddress = '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846';
	const encSecretsString =
		'0xe5789700988a74550fd9e14ff292159c025dd3fbfa83c7ea8ed0d4cf1dc924941063eb62ed4ea2f34648b0ea8190af75b101ca8b01245deeb2376c8a3325d8205fda91383c714f72dd7b6d60050289e3feac9016b1e997dcd5926157d97d63395ce2f8cce2be7d681c251cfd8bbea2326c88cc8106e1e9d4c80c0b78f80c2254da';

	let question = 'Chainlink SmartCon 2023 - Visit us';
	let answer = '';
	let showCardBack = false;
	let imgSrc = '/Chainlink-SmartCon-2023.png';
	let adUrl = 'https://smartcon.chain.link/';
	let transacting = false;
	let successful = false;

	onMount(async () => {
		evm.setProvider();
		evm.attachContract('chainlink', chainlinkContractAddress, chainlink);
		evm.attachContract('cardclub', cardClubContractAddress, cardclub);
		if ($signerAddress) {
			authenticated.set(true);
		}
	});
	const scriptString = `const linkAmount = args[0];
const publisherId = args[1];

if (!linkAmount) {
  throw "Link amount is required";
}

if (!publisherId) {
  throw "Publisher ID is required";
}

// Max retries HTTP requests are 4 because total HTTP requests a Chainlink Function can do is 5 https://docs.chain.link/chainlink-functions/resources/service-limits
function httpRequest(url, headers, data, retries = 4) {
  return new Promise((resolve, reject) => {
    // Timeout 3000ms is because of the chainlink service limits
    Functions.makeHttpRequest({ url, headers, data, method: "POST" })
      .then((response) => {
        if (response.statusText === "OK") {
          resolve(response.data);
        } else if (retries > 0) {
          console.log(\`Retry attempts remaining: \${retries}\`);
          setTimeout(() => {
            httpRequest(url, headers, data, retries - 1)
              .then(resolve)
              .catch(reject);
          }, 1000); // retry after 1 second
        } else {
          reject(new Error("Failed after 5 attempts"));
        }
      })
      .catch((error) => {
        if (retries > 0) {
          console.log(\`Retry attempts remaining: \${retries}\`);
          setTimeout(() => {
            httpRequest(url, headers, data, retries - 1)
              .then(resolve)
              .catch(reject);
          }, 1000); // retry after 1 second
        } else {
          reject(error);
        }
      });
  });
}

const boughtAdMinutes = httpRequest(
  "https://card.club/api/ads",
  {
    Authorization: \`Bearer \${secrets.BEARER_TOKEN}\`,
    "Content-Type": "application/json",
  },
  { publisherId: publisherId, linkAmount: linkAmount }
)
  .then((data) => {
    return Functions.encodeUint256(data.adMinutes);
  })
  .catch((error) => console.error(error));

return boughtAdMinutes;
`;
</script>

<main
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex flex-col justify-start items-center bg-gray-100"
>
	<div>
		{#if successful}
			<div class="mt-10 bg-white shadow sm:rounded-lg w-[360px]">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-base text-center font-semibold leading-6 text-gray-900 mb-2">
						Transaction successful
					</h3>
					<div style="width:100%">
						<div style="height:0;padding-bottom:56.25%;position:relative;width:100%">
							<iframe
								allowfullscreen=""
								frameBorder="0"
								height="100%"
								src="https://giphy.com/embed/G96zgIcQn1L2xpmdxi/video"
								style="left:0;position:absolute;top:0;border-radius:10px"
								width="100%"
							/>
						</div>
					</div>
				</div>
			</div>
		{:else if transacting}
			<div class="mt-10 bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-base font-semibold leading-6 text-gray-900 animate-pulse">
						Transaction in progress
					</h3>
				</div>
			</div>
		{:else if $authenticated && $signerAddress}
			{#await $contracts.chainlink.allowance($signerAddress, cardClubContractAddress)}
				<div class="mt-10 bg-white shadow sm:rounded-lg">
					<div class="px-4 py-5 sm:p-6">
						<h3 class="text-base font-semibold leading-6 text-gray-900">waiting</h3>
					</div>
				</div>
			{:then value}
				{#if value.toString().length < 20}
					<div class="mt-10 bg-white shadow sm:rounded-lg">
						<div class="px-4 py-5 sm:p-6">
							<h3 class="text-base font-semibold leading-6 text-gray-900">
								Your allowance is too low
							</h3>
							<div class="mt-2 max-w-xl text-sm text-gray-500">
								<span>Your LINK allowance for Card.Club smart contract is: {value}</span>
							</div>
							<button
								on:click={async () => {
									await $contracts.chainlink.approve(cardClubContractAddress, parseEther('100.0'));
								}}
								class="mt-4 w-full rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>Set 100 link allowance</button
							>
						</div>
					</div>
				{:else}
					<div class="mt-10 bg-white shadow sm:rounded-lg">
						<div class="px-4 py-5 sm:p-6">
							<h3 class="text-base font-semibold leading-6 text-gray-900">Buy ad</h3>
							<div class="mt-2 max-w-xl text-sm text-gray-500">
								{#await $contracts.chainlink.balanceOf($signerAddress)}
									<span>waiting...</span>
								{:then value}
									<span
										>Your LINK balance is: {value.toString().length > 18
											? value.toString().slice(0, -17) / 10
											: 'not enough'}</span
									>
								{/await}
							</div>
							<button
								on:click={async () => {
									transacting = true;
									const publisherAddress = "0xF4E20531CD11Fb8b70896AA9710FeDbEb9be87c3";
									const tx = await $contracts.cardclub.purchaseAd(
										publisherAddress,
										parseEther('1.0'),
										scriptString,
										encSecretsString,
										['1', '1'],
										subscriptionId,
										300000,
										{ gasLimit: 1500000, gasPrice: undefined }
									);
									let receipt = await tx.wait(); // wait for transaction to be mined
									if (receipt.status === 0) {
										toast.push('Transaction has failed ⚠');
									} else if (receipt.status === 1) {
										successful = true;
										toast.push('Transaction was successful 🚀');
									} else {
										toast.push('Unknown transaction status ❓');
									}
									transacting = false;
								}}
								class="mt-4 w-full rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>Buy ad for 1 Link</button
							>
						</div>
					</div>
				{/if}
			{/await}
		{:else}
			<div class="mt-10 bg-white shadow sm:rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-base font-semibold leading-6 text-yellow-500">Connect your wallet</h3>
				</div>
			</div>
		{/if}
	</div>
	<div class="flex flex-col justify-center items-center mt-16">
		<div class="flip-box">
			<div class="flip-box-inner cursor-pointer" class:flip-it={false}>
				<Flashcard {adUrl} {imgSrc} {question} {answer} {showCardBack} />
			</div>
		</div>
	</div>
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
