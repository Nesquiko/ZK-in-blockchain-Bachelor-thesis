-include .env

deploy-anvil:
	forge script ./script/DeployContracts.s.sol --rpc-url 'http://127.0.0.1:8545' --broadcast -vvvv

deploy-sepolia: confirm
	forge script ./script/DeployContracts.s.sol --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

confirm:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]
