<template>
	<div>
		<div>User-friendly address: {{ userFriendlyAddress }}</div>
		<div>Raw address: {{ rawAddress }}</div>
		<div>Connected wallet: {{ wallet && wallet.name }}</div>
		<div>Device: {{ wallet && wallet.device.appName }}</div>
		<div>Modal state: {{ state?.status }}</div>
		<button v-if="userFriendlyAddress" @click="logout">{{userFriendlyAddress}}</button>
		<button v-else @click="open">连接钱包</button>
		<button @click="close">Close modal</button>
		<div>
			<button @click="sendTransaction">Send transaction</button>
		</div>
		<div v-if="!connectionRestored">Please wait...</div>
		<div>{{count}}</div>
	</div>
</template>

<script>
	import {
		useTonAddress,
		useTonWallet,
		useTonConnectModal,
		useTonConnectUI,
		useIsConnectionRestored
	} from '@townsquarelabs/ui-vue';
	import {
		toUserFriendlyAddress
	} from '@tonconnect/sdk'
	import TonWeb from 'tonweb';
	
	import {
		beginCell,
		toNano,
		Address,
		storeStateInit,
		TonClient,
		StateInit
	} from '@ton/ton'
	export default {
		setup() {
			let userFriendlyAddress = useTonAddress();
			console.log('xxxxxxxxxx', userFriendlyAddress);
			const rawAddress = useTonAddress(false);
			const wallet = useTonWallet();
			let count = 1230
			const {
				state,
				open,
				close
			} = useTonConnectModal();
			const [tonConnectUI] = useTonConnectUI();
			// setTimeout(()=>{
			console.log('钱包信息', tonConnectUI.account);
			// },1000)
			// TON转帐
			const myTransaction = {
				validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
				messages: [{
					address: "EQCLn7XiZU3tFYBMMwmvzhwRbQGj_FKaYNwXsUX5SnkeI882",
					amount: "100000000",
					payload: 'te6cckEBAQEAWQAArg+KfqUAAAAAAAAAAEHc1lAIAYr3Tsx0uk7Fb64bX0q3ybbFBluQwjwLDvcWzGU0olwrADFe6dmOl0nYrfXDa+lW+TbYoMtyGEeBYd7i2YymlEuFRh6EgO/pWuw='
					// stateInit: "TEST" // just for instance. Replace with your transaction initState or remove
				}]
			}

			const sendTransaction = () => {
				tonConnectUI.sendTransaction(myTransaction);
			};
			const logout = () => {
				// 钱包断开连接
				tonConnectUI.disconnect();
			};
			const connectionRestored = useIsConnectionRestored();
			const body = beginCell()
				.storeUint(0xf8a7ea5, 32) // jetton 转账操作码
				.storeUint(0, 64) // query_id:uint64
				.storeCoins(toNano(0.05)) // amount:(VarUInteger 16) -  转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
				.storeAddress(Address.parse('UQAAXR8CSAMKXgudoWOzcius5v9wIpQa3qFj41hQLPRHfJCF')) // destination:MsgAddress
				.storeAddress(Address.parse(
					'UQAAXR8CSAMKXgudoWOzcius5v9wIpQa3qFj41hQLPRHfJCF')) // response_destination:MsgAddress
				.storeUint(0, 1) // custom_payload:(Maybe ^Cell)
				.storeCoins(toNano(0.001)) // forward_ton_amount:(VarUInteger 16)
				.storeUint(0, 1)
				.endCell();
			console.log('body', body.toBoc().toString("base64"));
			const getWalletAddress = async () => {
				userFriendlyAddress = await useTonAddress();
				setTimeout(() => { //延迟获取地址
					console.log('--------------', userFriendlyAddress._value);
				}, 1000)
				let tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
					apiKey: '682589248b2c93bda9856a97cca0179ed0d0f3a0c7a8829e671b049fdf408754'
				}));

				let usdtAddress = 'EQDHAXwU8edT_uUA-2xBydIhMOfbnnOyxwr_ydCdpXKP5pgV'
				let myAddress = 'UQB18PPOHM1cVR0Tcg5OmqYtFa88xJym4_5koho29nwMqLuf'
				const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
					address: usdtAddress
				});
				console.log('jettonMinter', jettonMinter);
				const jettonAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(
					myAddress));
				let jettonWalletAddress = jettonAddress.toString(true, true, true)
				console.log('jettonWalletAddress', jettonWalletAddress);
			}
			getWalletAddress()
			window.addEventListener('ton-connect-connection-completed', (event) => {
				console.log('Transaction init==============', event, event.detail.wallet_address);
				let address = event.detail.wallet_address
				console.log(4444, address);
				const bouncableUserFriendlyAddress = toUserFriendlyAddress(address);
				// const testnetOnlyBouncableUserFriendlyAddress = toUserFriendlyAddress(rawAddress, true);
				console.log('=========', bouncableUserFriendlyAddress);
			});
			return {
				userFriendlyAddress,
				rawAddress,
				wallet,
				state,
				open, // 连接钱包
				close,
				sendTransaction,
				connectionRestored,
				logout,
				count
			}
		}
	}
</script>