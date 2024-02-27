compile-wittness:
	mkdir -p build
	circom ownership.circom --r1cs --wasm -o build
	bun ./build/ownership_js/generate_witness.js ./build/ownership_js/ownership.wasm ./input.json ./build/witness.wtns

proof:
	snarkjs groth16 prove ./pot/ownership_0001.zkey ./build/witness.wtns proof.json public.json

verify:
	snarkjs groth16 verify verification_key.json public.json proof.json

setup:
	mkdir -p pot
	snarkjs powersoftau new bn128 12 ./pot/pot12_0000.ptau -v
	snarkjs powersoftau contribute ./pot/pot12_0000.ptau ./pot/pot12_0001.ptau --name="First contribution" -v
	snarkjs powersoftau prepare phase2 ./pot/pot12_0001.ptau ./pot/pot12_final.ptau -v
	snarkjs groth16 setup ./build/ownership.r1cs ./pot/pot12_final.ptau ./pot/ownership_0000.zkey
	snarkjs zkey contribute ./pot/ownership_0000.zkey ./pot/ownership_0001.zkey --name="1st Contributor Name" -v
	snarkjs zkey export verificationkey ./pot/ownership_0001.zkey verification_key.json

clean:
	rm -rf ./build/*
	rm -rf ./pot/*

	
