<script>
	let size = 50;
	export { size as size };
</script>

<svg class="spinner" viewBox="25 25 50 50">
	<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
</svg>

<style>
	.spinner {
		animation: rotate 2s linear infinite;
		height: var(--size);
		width: var(--size);
	}

	.path {
		stroke: rgb(37, 99, 235);
		stroke-linecap: round;
		animation: dash 1.5s ease-in-out infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes dash {
		0% {
			stroke-dasharray: 1, 150;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -35;
		}
		100% {
			stroke-dasharray: 90, 150;
			stroke-dashoffset: -124;
		}
	}
</style>
