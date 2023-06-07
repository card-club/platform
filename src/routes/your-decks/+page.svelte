<main
	style="height: calc(100vh - 47px)"
	class="bg-gradient-to-r from-gray-900 via-sky-950 to-gray-900 w-screen h-screen flex-col justify-center items-start bg-sky-950 overflow-y-auto"
>
	<h1
		class="border-b-2 border-r border-t border-l border-sky-300 text-center text-lg mt-10 mb-12 text-white bg-sky-800 w-[220px] mx-auto px-2 pb-1 pt-1.5 font-light rounded-br-md rounded-tl-md"
	>
		Your created decks
	</h1>
	<div class="flex flex-wrap justify-center items-start">
		{#each [1, 2, 3, 4, 5, 6] as card}
			<a
				href="/"
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
