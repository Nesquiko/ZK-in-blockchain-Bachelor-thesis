-include .env

ANVIL_DEPLOYER_PK=0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

deploy-anvil:
	forge script script/DeployMetaStealthAddressRegistry.s.sol --rpc-url http://localhost:8545 --private-key $(ANVIL_DEPLOYER_PK) --broadcast -vvvv

deploy-sepolia: confirm
	forge script script/DeployMetaStealthAddressRegistry.s.sol --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv

confirm:
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]
