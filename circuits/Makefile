compile:
	mkdir -p build
	circom ownership.circom --r1cs --wasm -o build

wittness: compile
	bun ./build/ownership_js/generate_witness.js ./build/ownership_js/ownership.wasm ./input.json ./build/witness.wtns
