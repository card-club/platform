<script lang="ts">
	export let question: string;
	export let answer: string;
	export let showCardBack: boolean = false;
</script>

<div class="flip-box-front">
	<div id="image-cont">
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
		height: 280px;
		width: 400px;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		padding: 15px;
		border: 1px solid;
		border-radius: 25px;
		box-shadow: 0px 0.5px 3px grey;
	}

	/* Style the front side */
	.flip-box-front {
		background-color: #ddd;
		color: black;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.3rem;
		text-align: center;
	}

	@keyframes revealTextSlowly {
		to {
			color: darkgrey;
		}
	}

	.conceal-answer {
		animation: revealTextSlowly 0.6s forwards;
	}

	/* Style the back side */
	.flip-box-back {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		transform: rotateY(180deg);
		font-size: 1.3rem;
	}
</style>
