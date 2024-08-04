const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;

  const [encryptedData] = await encryptDataField(rpcLink, data);

  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x79eE405ac9fA0BA31fd745F7615023BA943023a2"; 
  const recipientAddress = "0xaEBEc987c76B09B32b7ff12Cd2763c0c2d7d1629"; 

  const [signer] = await hre.ethers.getSigners();

  const contractFactory = await hre.ethers.getContractFactory("Swisstronikerc721");
  const contract = contractFactory.attach(contractAddress);

  const functionName = "mint";
  const functionArgs = [recipientAddress]; 
  const txData = contract.interface.encodeFunctionData(functionName, functionArgs);

  try {
    console.log("Please wait");

    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      txData,
      0
    );

    await mintTx.wait();

    console.log("Done!");
    console.log("Txid: ", mintTx);
  } catch (error) {
    console.error("Failed: ", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});