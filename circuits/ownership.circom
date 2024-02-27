pragma circom 2.0.0;

include "./circomlib/circuits/poseidon.circom";

template Ownership() {
    signal input owner_secret;
    signal input sender_secret;
    signal input code;

    component owner_secret_poseidon = Poseidon(1);
    owner_secret_poseidon.inputs <== [owner_secret];
    signal h <== owner_secret_poseidon.out;
    log("owner_secret:", owner_secret);
    log("output:", h);

    component sender_secret_poseidon = Poseidon(2);
    sender_secret_poseidon.inputs <== [h, sender_secret];
    log("h:", h);
    log("sender secret:", sender_secret);
    log("output:", sender_secret_poseidon.out);

    code === sender_secret_poseidon.out;
}

component main {public [code]} = Ownership();
