require("dotenv").config()
// const key = process.env.PINATA_KEY
// const secret = process.env.PINATA_SECRET
const key = "8c2f1152699317d4d21d"
const secret = "53488b31ee073db31f01bef57c4db1e3e0eeeac0e3924191cbc9849045b289fd"

const axios = require("axios")

export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      }
    })
    .catch(function (error) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      }
    })
}
