<template>
	<div>
		<TonConnectUIProvider :options="options">
			<div>
				<TonConnectButton />
			</div>
			<TheWelcomeVue></TheWelcomeVue>
		</TonConnectUIProvider>
		
	</div>

</template>

<script>
	import {
		TonConnectUIProvider,
		TonConnectButton,

	} from '@townsquarelabs/ui-vue';
	import TheWelcomeVue from './components/TheWelcome.vue';
	
	export default {
		components: {
			TonConnectUIProvider,
			TonConnectButton,
			TheWelcomeVue
		},
		setup() {
			const options = {
				manifestUrl: "https://slinadan.github.io/vueton/tonconnect-manifest.json",
			};

			return {
				options,

			}
		}
	}
</script>