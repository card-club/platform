<script lang="ts">
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { onMount } from 'svelte';
    import { defaultEvmStores as evm, contracts, signerAddress } from "ethers-svelte"
    import { chainlink } from '$lib/abis/chainlink'
    import { cardclub } from '$lib/abis/cardclub';
	import { authenticated } from '$lib/stores/auth';
    import { parseEther, encodeBytes32String } from 'ethers';
    let question = 'Chainlink SmartCon 2023 - Visit us';
    let answer = '';
    let showCardBack = false;
    let imgSrc = "/Chainlink-SmartCon-2023.png";
    let adUrl = "https://smartcon.chain.link/";

    onMount(async () => {
        console.log(encodeBytes32String("secretsauce"))
        evm.setProvider();
        evm.attachContract("chainlink", "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846", chainlink)
        evm.attachContract("cardclub", "0xC1d8469d6CfE4C3e842a9A9E76959aC6D7f51f58", cardclub)
        if($signerAddress){
            authenticated.set(true);
        } 
    })
</script>

<main
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex flex-col justify-start items-center bg-gray-100">
		<div>
        {#if $authenticated && $signerAddress}
        {#await $contracts.chainlink.allowance($signerAddress, "0x16a0AE76e5A6A409aFc97f93bCb7B9Ec3E4de7A2")}
        <!-- {#await $contracts.chainlink.decimals()} -->
        <span>waiting...</span>
            {:then value}
                {#if value.toString().length < 20}
                    <div class="mt-10 bg-white shadow sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-base font-semibold leading-6 text-gray-900">Your allowance is too low</h3>
                            <div class="mt-2 max-w-xl text-sm text-gray-500">
                                <span>Your LINK allowance for Card.Club smart contract is: {value}</span>
                            </div>
                            <button on:click={async() => {
                                console.log(value.toString().length);
                                await $contracts.chainlink.approve("0x16a0AE76e5A6A409aFc97f93bCb7B9Ec3E4de7A2", "100000000000000000000")
                            }}  class="mt-4 w-full rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Set 100 link allowance</button>
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
                                    <span>Your LINK balance is: {value.toString().length > 18 ? value.toString().slice(0, -17)/10 : "not enough"}</span>
                                {/await}
                            </div>
                            <button on:click={async() => {
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

const boughtAdViews = httpRequest(
  "https://card.club/api/ads",
  {
    "Authorization": \`Bearer \${secrets.BEARER_TOKEN}\`,
    "Content-Type": "application/json",
  },
  { publisherId: publisherId, linkAmount: linkAmount }
)
  .then((data) => {
    return Functions.encodeUint256(data.adViews);
  })
  .catch((error) => console.error(error));

return boughtAdViews;
`;


                                const tx = await $contracts.cardclub.purchaseAd(parseEther("1.0"), scriptString, "0x68747470733a2f2f6578616d706c655365637265747355524c2e636f6d2f66303966613064623864316338666162383836316563393762316437666466312f7261772f643439626264323064633536326630333562646638383332333939383836626165666139373063392f656e637279707465642d66756e6374696f6e732d726571756573742d646174612d313637393934313538303837352e6a736f6e", [ "1", "12" ], 34, 300000, { gasLimit: 1500000, gasPrice: undefined })
                            }}  class="mt-4 w-full rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Buy ad for 1 link</button>
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
				<div
					class="flip-box-inner cursor-pointer"
					class:flip-it={false}
				>
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
