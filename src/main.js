import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
// import { Buffer } from 'buffer';  
// global.Buffer = Buffer;
// console.log('Buffer',Buffer);
const app = createApp(App)
// app.config.Buffer = Buffer
// app.use(Buffer).mount('#app')
app.mount('#app')
