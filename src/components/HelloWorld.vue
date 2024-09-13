<template>
  <div>
    <button @click="sendTransaction">Send transaction</button>
  </div>
</template>

<script>
import { useTonConnectUI } from '@townsquarelabs/ui-vue';
import { beginCell, toNano } from "@ton/ton";


export default {
  name: 'HelloWorld',
  setup() {
    const [tonConnectUI, setOptions] = useTonConnectUI();


    const myTransaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [
        {
          address: "UQDJX9zeFdKLhdLX1GTL24cAiaMMcl731i4OyypLCmxt7Q07",
          amount: "10000000",
          // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
        },
      
      ]
    }

    const sendTransaction = () => {
      tonConnectUI.sendTransaction(myTransaction);
    };

    return { sendTransaction };
  }
};
</script>