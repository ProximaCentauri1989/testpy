import * as dotenv from "dotenv";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";

dotenv.config(); /* This loads the variables in your .env file to process.env */

const deploy = async () => {
  const { TEZOS_RPC_URL, ORIGINATOR_PRIVATE_KEY } = process.env;
  const key = ORIGINATOR_PRIVATE_KEY ?? '';
  const url = TEZOS_RPC_URL ?? '';

  const signer = await InMemorySigner.fromSecretKey(key);
  const Tezos = new TezosToolkit(url);
  Tezos.setProvider({ signer: signer });

  try {
    const { hash, contractAddress } = await Tezos.contract.originate({
      code: require("../build/counter.json"),
      init: require("../build/counter_storage.json"),
    });

    console.log("Successfully deployed contract");
    console.log(`>> Transaction hash: ${hash}`);
    console.log(`>> Contract address: ${contractAddress}`);
  } catch (error) {
    console.log(error);
  }
};

deploy();