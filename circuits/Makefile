compile:
	mkdir -p build
	circom ownership.circom --r1cs --wasm --sym -o build

wittness: compile
	node ./build/ownership_js/generate_witness.js ./build/ownership_js/ownership.wasm ./input.json ./build/witness.wtns

info:
	snarkjs r1cs info ./build/ownership.r1cs

constraints:
	snarkjs r1cs print ./build/ownership.r1cs ./build/ownership.sym
