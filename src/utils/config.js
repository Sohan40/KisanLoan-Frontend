const { PinataSDK } = require("pinata-web3");

const pinata = new PinataSDK({
  pinataJwt: process.env.VITE_PINATA_JWT,
  pinataGateway: process.env.VITE_GATEWAY_URL,
});

console.log(pinata)

module.exports = { pinata };
