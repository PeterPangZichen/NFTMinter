require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/NFronTier.sol/NFronTier.json")
const contractAddress = "0xe971e572d9618c81626770747e337820a3f0eb08"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)


async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
  
    //the transaction
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    }
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              console.log(
                "The hash of your transaction is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
              )
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              )
            }
          }
        )
      })
      .catch((err) => {
        console.log("Promise failed:", err)
      })
  }
  
  mintNFT("ipfs://QmRXc1pXk6AAPgwNgKCyFMYc6x9pqkKfBGvwidNP99VCNY")