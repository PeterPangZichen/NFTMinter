async function main() {
    const contractFactory = await ethers.getContractFactory("NFronTier")
  
    // Start deployment, returning a promise that resolves to a contract object
    const NFronTier = await contractFactory.deploy()
    await NFronTier.deployed()
    console.log("Contract deployed to address:", NFronTier.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  