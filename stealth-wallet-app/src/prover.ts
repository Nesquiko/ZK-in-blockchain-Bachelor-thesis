const WASM_CIRCUIT = "ownership.wasm";
const ZKEY = "ownership_final.zkey";

export async function createProof() {
  // TODO
  const { proof, _pub } = await snarkjs.groth16.fullProve(
    {},
    WASM_CIRCUIT,
    ZKEY,
  );

  console.log(proof);
}
