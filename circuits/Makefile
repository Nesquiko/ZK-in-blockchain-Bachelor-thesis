BUILD_DIR=./build
CIRCUIT=$(BUILD_DIR)/ownership.r1cs
PTAU=./powersOfTau28_hez_final_09.ptau
BEACON=b7df22ce15bdf139ebec45992e1053f2d3bbdf32da14a77c0912533aa2662638 # Eth block 19410538
ZKEY=./ownership_final.zkey
VERIFICATION_KEY=./verification_key.json

compile:
	mkdir -p $(BUILD_DIR)
	circom ownership.circom --r1cs --wasm --sym -o $(BUILD_DIR)

wittness: compile
	node ./build/ownership_js/generate_witness.js ./build/ownership_js/ownership.wasm ./input.json ./build/witness.wtns

info:
	snarkjs r1cs info $(CIRCUIT)

constraints:
	snarkjs r1cs print $(CIRCUIT) ./build/ownership.sym

zkey:
	snarkjs groth16 setup $(CIRCUIT) $(PTAU) ownership_0000.zkey
	snarkjs zkey contribute ./ownership_0000.zkey ownership_0001.zkey --name="nesquiko" -v -e="ea0499fbf25679ffd779e6d10075b8ee568111298ab15ac7c05060edbc9d02e8b4bf40916f921fcb62e6296ecb197ac861b3d0b0dd73fb2bb2a950fdfa678202"
	snarkjs zkey verify $(CIRCUIT) $(PTAU) ownership_0001.zkey
	snarkjs zkey beacon ownership_0001.zkey $(ZKEY) $(BEACON) 10 -n="Final Beacon phase2"
	snarkjs zkey verify $(CIRCUIT) $(PTAU) $(ZKEY)
	snarkjs zkey export verificationkey $(ZKEY) $(VERIFICATION_KEY)
	rm ownership_0000.zkey ownership_0001.zkey

solidity:
	snarkjs zkey export solidityverifier $(ZKEY) Verifier.sol
	cp Verifier.sol ../stealth-wallet/src/
	rm ./Verifier.sol

prover: compile zkey
	cp $(BUILD_DIR)/ownership_js/ownership.wasm ../stealth-wallet-app/public
	cp $(ZKEY) ../stealth-wallet-app/public
