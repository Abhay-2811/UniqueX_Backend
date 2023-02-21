require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const axios = require('axios')
const url = require('url')

// Application configurations
const PORT = process.env.PORT
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


app.use(cors())
app.use(express.json())

DISCORD_OAUTH_CLIENT_ID = process.env.DISCORD_CLIENT_ID
DISCORD_OAUTH_SECRET = process.env.DISCORD_SECRET_KEY

app.get('/auth/', async (req, res) => {
  const { code } = req.query
  if (code) {
    try {
      const formData = new URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID,
        client_secret: DISCORD_OAUTH_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: 'https://rich-teal-frog-boot.cyclic.app/auth/' //change here
      })
      const response = await axios.post(
        'https://discord.com/api/v10/oauth2/token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      const { access_token } = response.data
      const { data: userResponse } = await axios.get(
        'https://discord.com/api/v10/users/@me',
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      var D_id = userResponse.username+'#'+userResponse.discriminator;
      await createHash(D_id);
    } catch (error) {
      console.log(error)
    }
    await checkIfUserExists(userHash);
    if(!Exists){
      await createUser(D_id);
      res.redirect('https://unique-x-frontend.vercel.app/disc_verified.html');
    }
    else{
      res.redirect('https://unique-x-frontend.vercel.app/exists.html'); //change to already exists page
    }
    

  }
})

const bootstrap = async () => {
  try {
    app.listen(PORT, async () => {
      console.log('Listening at ', PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

let Exists;
const checkIfUserExists = async (hash) => {
	var axios = require('axios')
	var data = JSON.stringify({
	  query: `{
	  hashedIDs(where :{_hash: "${hash.toString()}"}) {
		  _hash
	  }
	  }`,
	  variables: {}
	})
  
	var config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://api.thegraph.com/subgraphs/name/abhay-2811/verifyx',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  data: data
	}
  
	await axios(config)
	  .then(async function (response) {
		var data = await response['data']['data']['hashedIDs']
        console.log(data);
		if (data.length == 0) {
			Exists = false;
		} else {
		  	Exists = true;
		}
	  })
	  .catch(function (error) {
		console.log(error)
	  });
	  
}

let userHash;
const createHash = async D_id => {
  const Web3 = require('web3')

  //connecting infura rpc
  var provider =
    'https://broken-multi-energy.matic-testnet.discover.quiknode.pro/5f9ef2ede0937a1db42ddf7e82588aa5c956e302/'
  var web3Provider = new Web3.providers.HttpProvider(provider)
  var web3 = new Web3(web3Provider)
  const Vcontract = new web3.eth.Contract(Vabi, Vadd)
  const hash = await Vcontract.methods.createHash(D_id).call();
  userHash = hash;
}

const createUser = async (D_id) =>{
  const Web3 = require('web3')

  //connecting infura rpc
  var provider =
    'https://broken-multi-energy.matic-testnet.discover.quiknode.pro/5f9ef2ede0937a1db42ddf7e82588aa5c956e302/'
  var web3Provider = new Web3.providers.HttpProvider(provider)
  var web3 = new Web3(web3Provider)
  const Vcontract = new web3.eth.Contract(Vabi, Vadd);
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
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
bootstrap()
