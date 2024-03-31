pragma circom 2.0.0;

include "./circomlib/circuits/poseidon.circom";

template Ownership() {
    signal input owner_secret;
    signal input sender_secret;
    signal input code;

    log("input owner_secret:", owner_secret);
    log("input sender secret:", sender_secret);
    log("input code:", code);

    component owner_secret_poseidon = Poseidon(1);
    owner_secret_poseidon.inputs <== [owner_secret];
    signal h <== owner_secret_poseidon.out;
    log("calculated owner_secret hash h:", h);

    component code_poseidon = Poseidon(2);
    code_poseidon.inputs <== [h, sender_secret];
    log("calculated code:", code_poseidon.out);

    code === code_poseidon.out;
}

component main {public [code]} = Ownership();
