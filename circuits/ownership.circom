pragma circom 2.0.0;

include "./circomlib/circuits/poseidon.circom";

template Ownership() {
    signal input owner_secret;
    signal input sender_secret;
    signal input code;
    signal input withdrawee_address;
    signal input msg_sender;

    log("input owner_secret:", owner_secret);
    log("input sender secret:", sender_secret);
    log("input code:", code);
    log("input withdrawee_address:", withdrawee_address);
    log("input msg_sender:", msg_sender);

    component owner_secret_poseidon = Poseidon(1);
    owner_secret_poseidon.inputs <== [owner_secret];
    log("calculated owner_secret hash:", owner_secret_poseidon.out);

    component code_poseidon = Poseidon(2);
    code_poseidon.inputs <== [owner_secret_poseidon.out, sender_secret];
    log("calculated code:", code_poseidon.out);

    code === code_poseidon.out;
    msg_sender === withdrawee_address;
}

component main {public [code, msg_sender]} = Ownership();
