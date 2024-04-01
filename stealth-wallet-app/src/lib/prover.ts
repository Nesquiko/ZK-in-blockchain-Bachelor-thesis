import { groth16 } from "snarkjs";

const WASM_CIRCUIT = "ownership.wasm";
const ZKEY = "ownership_final.zkey";

export interface OwnershipProof {
  piA: bigint[];
  piB: bigint[][];
  piC: bigint[];
  pubSignals: bigint[];
}

export async function calculateProof(
  withdrawee: string,
  ownersSecret: bigint,
  sendersSecret: bigint,
  code: bigint,
): Promise<OwnershipProof> {
  const input = {
    owner_secret: ownersSecret.toString(10),
    sender_secret: sendersSecret.toString(10),
    code: code.toString(10),
    withdrawee_address: withdrawee,
    msg_sender: withdrawee,
  };

  const { proof, publicSignals } = await groth16.fullProve(
    input,
    WASM_CIRCUIT,
    ZKEY,
  );
  const calldataProof = await groth16.exportSolidityCallData(
    proof,
    publicSignals,
  );
  return parseProof(calldataProof);
}

function parseProof(calldataProof: string): OwnershipProof {
  const parsed = JSON.parse(`[${calldataProof}]`) as [
    string[],
    string[][],
    string[],
    string[],
  ];
  return {
    piA: parsed[0].map((hexString) => BigInt(hexString)),
    piB: parsed[1].map((innerArray) =>
      innerArray.map((hexString) => BigInt(hexString)),
    ),
    piC: parsed[2].map((hexString) => BigInt(hexString)),
    pubSignals: parsed[3].map((hexString) => BigInt(hexString)),
  };
}
