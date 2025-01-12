import '../styles/global.css';
import '../popup/init.js';

import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'popup',
  },
});

export default app;
