import { BN, Contract, Provider, Wallet, WalletUnlocked } from "fuels";
import { CounterContractFactory, CounterContract } from "../types"
import abi from "./../out/debug/counter-contract-abi.json"
import dotenv from "dotenv";
import { waitForDebugger } from "node:inspector";
dotenv.config();

const contractAddress = "0x77d0af797046c6fa422581dc13d4536193392f54d4ade59b2de1f27c093daef7"
const address = "0x5CCDB6FA3192B0664cD53C42102720bbC711f8718cA18c995507ee2Ff32b8956"



async function main() {
    const provider = await Provider.create(process.env.LOCAL_NETWORK_URL!)
    const wallet = WalletUnlocked.fromMnemonic(process.env.MNEMONIC!)
    // (address, provider).
    wallet.connect(provider)

    wallet.getBalances().then((data) => {
        console.log(data.balances[0].assetId)
        console.log(new BN(data.balances[0].amount).toNumber())
    })

    const { balances } = await wallet.getBalances()


    // // Counter contract deploy
    // const deploy = await CounterContractFactory.deploy(wallet)
    // const { contract } = await deploy.waitForResult()
    // console.log(contract)


    // Contract interactions to read the data
    const counterContract = new CounterContract(contractAddress, wallet)
    const getCounter = await counterContract.functions.counter().get()
    const valueBefore  = new BN(getCounter.value).toNumber()
    console.log(valueBefore)

    // Contract interaction to simulate the tx 
    const {callResult} = await counterContract.functions.increment().simulate()
    console.log(callResult.dryRunStatus)

    // Contract interaction to sign the tx 

    const { transactionId, waitForResult} = await counterContract.functions.increment().call()
    const {value :inc} = await waitForResult();
    console.log(inc, transactionId)


    // Counter value atter 
    const getCounterAfter = await counterContract.functions.counter().get()
    const valueAfter  = new BN(getCounterAfter.value).toNumber()
    console.log(valueAfter)

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })