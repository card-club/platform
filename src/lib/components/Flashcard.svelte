<script lang="ts">
	export let question: string;
	export let answer: string;
	export let imgSrc: string = '';
	export let adUrl: string = '';
	export let showCardBack: boolean = false;
</script>

{#if imgSrc}
	<div class="flex flex-wrap justify-center items-start">
		<a
			target="_blank"
			href={adUrl}
			class="card mb-10 mx-10 hover:-translate-y-0.5 cursor-pointer border-2 border-sky-300 flex-col justify-center items-center"
		>
			<img class="rounded-tl-3xl rounded-tr-3xl" src={imgSrc} alt="" />
			<h2 class="text-lg truncate w-[360px] break-normal text-center mt-2">
				{question}
			</h2>
		</a>
	</div>
{:else}
	<div class="flip-box-front">
		<div>
			<h2>{question}</h2>
		</div>
	</div>
{/if}

<div class="flip-box-back" class:conceal-answer={showCardBack}>
	<h2>{answer}</h2>
</div>

<style>
	/* Position the front and back side */
	.flip-box-front,
	.flip-box-back {
		position: absolute;
		height: 260px;
		width: 380px;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		padding: 15px;
		border-radius: 20px;
		border: 2px solid lightblue;
		box-shadow: 0px 2px 1px lightblue;
		background-color: #fff;
	}

	/* Style the front side */
	.flip-box-front {
		background-color: #fff;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
		text-align: center;
		transform: rotateY(0deg);
	}

	/* Style the back side */
	.flip-box-back {
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		transform: rotateY(180deg);
		font-size: 1.3rem;
	}
</style>
