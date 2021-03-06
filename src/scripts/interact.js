import { pinJSONToIPFS } from "./upload.js"
require("dotenv").config()
//const alchemyKey = process.env.API_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
// const web3 = createAlchemyWeb3(alchemyKey)
const web3 = createAlchemyWeb3("https://eth-ropsten.alchemyapi.io/v2/6fRm80f5P4oYtgn77qnk67Ro11ztrum8")

const contractABI = require("../contract-abi.json")
//const contractAddress = process.env.CONTRACT_ADDRESS
const contractAddress = "0xE971e572d9618C81626770747E337820A3F0eB08"

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        const obj = {
          status: "You have connected with your wallet.",
          address: addressArray[0],
        }
        return obj
      } catch (err) {
        return {
          address: "",
          status: "Error: " + err.message,
        }
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      }
    }
  }

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "You can start to mint NFT.",
          }
        } else {
          return {
            address: "",
            status: "Please connect to your metamask wallet first.",
          }
        }
      } catch (err) {
        return {
          address: "",
          status: "Error: " + err.message,
        }
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      }
    }
  }

  export const mintNFT = async (url, name, description) => {
    //error handling
    if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
      return {
        success: false,
        status: "Error: Please make sure all fields are completed before minting.",
      }
    }
  
    //make metadata
    const metadata = new Object()
    metadata.name = name
    metadata.image = url
    metadata.description = description
  
    //pinata pin request
    const pinataResponse = await pinJSONToIPFS(metadata)
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "Error: Something went wrong while uploading your tokenURI.",
      }
    }
    const tokenURI = pinataResponse.pinataUrl
  
    //load smart contract
    window.contract = await new web3.eth.Contract(contractABI, contractAddress) //loadContract();
  
    //set up your Ethereum transaction
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: window.contract.methods
        .mintNFT(window.ethereum.selectedAddress, tokenURI)
        .encodeABI(), //make call to NFT smart contract
    }
  
    //sign transaction via MetaMask
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })
      return {
        success: true,
        status:
          "Successful. Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
          txHash,
      }
    } catch (error) {
      return {
        success: false,
        status: "Error: " + error.message,
      }
    }
  }
  
  
  