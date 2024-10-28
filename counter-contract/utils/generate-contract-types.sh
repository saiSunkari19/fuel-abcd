#!/bin/bash

# Generate contract types
pnpm fuels typegen -i $(find ./out -name '*-abi.json' | grep -v '/scripts') -o ./types