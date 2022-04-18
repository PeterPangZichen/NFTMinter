import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./scripts/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
 
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)
    addWalletListener()
  }, [])
  
  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  }

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description)
    setStatus(status)
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus("You can start to mint NFT.")
        } else {
          setWallet("")
          setStatus("Please connect to your metamask wallet first.")
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install MetaMask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      )
    }
  }

  return (
    <div className="Minter">
      <br></br>
      <h1 id="title">NFT Minter</h1>
      <p>
        Contract address: 0xE971e572d9618C81626770747E337820A3F0eB08
      </p>
      <form>
        <h2>Link of image: </h2>
        <input
          type="text"
          placeholder="URL"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>NFT Name: </h2>
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>NFT Description: </h2>
        <input
          type="text"
          placeholder="NFT Description"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
