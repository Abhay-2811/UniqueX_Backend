const Vadd = "0x58453e850E62979960ebA94eD78877ab36F551B8";
const Vabi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "DiscordID",
				"type": "string"
			}
		],
		"name": "createHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
    {
		"inputs": [
			{
				"internalType": "string",
				"name": "DiscordID",
				"type": "string"
			}
		],
		"name": "HashId",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const createUser = async (D_id) =>{
    const Web3 = require('web3')
  
    //connecting infura rpc
    var provider =
      'https://broken-multi-energy.matic-testnet.discover.quiknode.pro/5f9ef2ede0937a1db42ddf7e82588aa5c956e302/'
    var web3Provider = new Web3.providers.HttpProvider(provider)
    var web3 = new Web3(web3Provider)
    const Vcontract = new web3.eth.Contract(Vabi, Vadd);
    const signer = web3.eth.accounts.privateKeyToAccount(
      '0xd8f0bd0d2d9f638d123e8991df564c208866da35657026d8bb75a7961d269865'
    )
    web3.eth.accounts.wallet.add(signer)
    
    const tx = await Vcontract.methods.HashId(D_id)
    const reciept = await tx.send({
      from: signer.address,
      gas: await tx.estimateGas()
    })
    .once('transactionHash', (txhash) => {
      console.log(`Adding User ...`)
    })
    // The transaction is now on chain!
    console.log(`User added.`);
  }

createUser('Abhadya_1332');