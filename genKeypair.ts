import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

const publicKey = keypair.publicKey.toBase58();
const secretKey = bs58.encode(keypair.secretKey);

console.log(`The public key is: ${publicKey}`);
console.log(`The secret key is: ${secretKey}`);
console.log(`✅ Finished! Encoded KeyPair`);


