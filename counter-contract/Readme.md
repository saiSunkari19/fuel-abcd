## Couter Contract 


### Generate types for frontend using fuels 

```
pnpm install fuels -g

fuels typegen -i out/debug/counter-contract-abi.json -o ./types
```


### Testnet deployed contract 
```
forc build 

forc deploy --testnet

> account: 0x5CCDB6FA3192B0664cD53C42102720bbC711f8718cA18c995507ee2Ff32b8956

counter contract : 0x77d0af797046c6fa422581dc13d4536193392f54d4ade59b2de1f27c093daef7
```
