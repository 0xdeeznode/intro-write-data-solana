import { Connection, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

async function airdropIfRequired(connection, publicKey, threshold, airdropAmount) {
  // Get the current balance
  const balance = await connection.getBalance(publicKey);

  // Check if the balance is below the threshold
  if (balance < threshold) {
    console.log(`Balance is below ${threshold / LAMPORTS_PER_SOL} SOL, requesting airdrop...`);

    // Request airdrop
    const airdropSignature = await connection.requestAirdrop(publicKey, airdropAmount);

    // Confirm the transaction
    console.log('Confirming airdrop transaction...')
    try {
      await connection.confirmTransaction(airdropSignature);
    } catch (error) {
      console.error(error)
    }
    

    console.log(`Airdrop of ${airdropAmount / LAMPORTS_PER_SOL} SOL completed.`)
  } else {
    console.log(`Balance is sufficient: ${balance / LAMPORTS_PER_SOL} SOL.`)
  }
}

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
  console.log(`Please provide a public key to send to`);
  process.exit(1);
}

const toPubkey = new PublicKey(suppliedToPubkey);
const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
const fromPubkey = senderKeypair.publicKey;

console.log(`supplied ToPubkey: ${suppliedToPubkey}`);


const connection = new Connection("https://api.devnet.solana.com", "confirmed");
console.log('Stablishing connection with SOL dev...');
await airdropIfRequired(
  connection,
  fromPubkey,
  1.7 * LAMPORTS_PER_SOL,
  2 * LAMPORTS_PER_SOL,
);

console.log(
  `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);


//========== Until here we've confirmed connection and keypairs required -> PT2



const transaction = new Transaction();

const LAMPORTS_TO_SEND = 1000000000;

const sendSolInstruction = SystemProgram.transfer({
  fromPubkey: fromPubkey,
  toPubkey: toPubkey,
  lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

// Measure time taken to send the transaction
const startTime = Date.now();

const signature = await sendAndConfirmTransaction(connection, transaction, [
  senderKeypair,
]);

const endTime = Date.now();

const timeTaken = endTime - startTime;

console.log(
  `💸 Finished! Sent ${LAMPORTS_TO_SEND / LAMPORTS_PER_SOL} to the address ${toPubkey}. `
);
console.log(`Transaction signature is ${signature}!`);
console.log(`Time taken to send the transaction: ${timeTaken} ms`);