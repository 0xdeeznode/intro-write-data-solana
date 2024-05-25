import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
  } from "@solana/web3.js";

  const suppliedToPubkey = process.argv[2] || null;
  console.log('Verifying Public Key...');
  if (!suppliedToPubkey){
    console.error('You must provide a Public Key..');
    process.exit(1);
  }
  const toPubkey = new PublicKey(suppliedToPubkey);
  console.log('Public Key Received: ', toPubkey);
  console.log('Stablishing connection...')
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  console.log('Processing Airdrop...');
  const airdropSignature = await connection.requestAirdrop(
    toPubkey,
    LAMPORTS_PER_SOL * 0.8
  );
  
  
  
  