<script lang="ts">
	export let question: string;
	export let answer: string;
	export let showCardBack: boolean = false;
</script>

<div class="flip-box-front">
	<div>
		<h2>{question}</h2>
	</div>
</div>

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
		box-shadow: 0px 0.5px 3px grey;
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
