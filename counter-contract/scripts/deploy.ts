import { Provider, Wallet } from "fuels";
import dotenv from "dotenv";
dotenv.config();

const contractAddress = "0x77d0af797046c6fa422581dc13d4536193392f54d4ade59b2de1f27c093daef7"
const address = "0x5CCDB6FA3192B0664cD53C42102720bbC711f8718cA18c995507ee2Ff32b8956"



async function main() {
    const provider = await Provider.create(process.env.LOCAL_NETWORK_URL!)


    const wallet = Wallet.fromAddress(address, provider)

    const { balances } = await wallet.getBalances()

    console.log(balances)

}



main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })