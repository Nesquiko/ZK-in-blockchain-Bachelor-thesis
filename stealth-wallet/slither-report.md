**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [arbitrary-send-eth](#arbitrary-send-eth) (1 results) (High)
 - [incorrect-return](#incorrect-return) (3 results) (High)
 - [missing-zero-check](#missing-zero-check) (1 results) (Low)
 - [assembly](#assembly) (4 results) (Informational)
 - [pragma](#pragma) (1 results) (Informational)
 - [solc-version](#solc-version) (2 results) (Informational)
 - [low-level-calls](#low-level-calls) (1 results) (Informational)
 - [naming-convention](#naming-convention) (40 results) (Informational)
 - [unused-state](#unused-state) (1 results) (Informational)
 - [immutable-states](#immutable-states) (2 results) (Optimization)
## arbitrary-send-eth
Impact: High
Confidence: Medium
 - [ ] ID-0
[StealthWallet.withdraw(address,uint256,StealthWallet.OwnershipProof)](src/StealthWallet.sol#L33-L49) sends eth to arbitrary user
	Dangerous calls:
	- [(success,None) = to.call{value: amount}()](src/StealthWallet.sol#L44)

src/StealthWallet.sol#L33-L49


## incorrect-return
Impact: High
Confidence: Medium
 - [ ] ID-1
[Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])](src/Verifier.sol#L60-L175) calls [Groth16Verifier.verifyProof.asm_0.checkField()](src/Verifier.sol#L67-L72) which halt the execution [return(uint256,uint256)(0,0x20)](src/Verifier.sol#L70)

src/Verifier.sol#L60-L175


 - [ ] ID-2
[Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])](src/Verifier.sol#L60-L175) calls [Groth16Verifier.verifyProof.asm_0.checkPairing()](src/Verifier.sol#L100-L156) which halt the execution [return(uint256,uint256)(0,0x20)](src/Verifier.sol#L86)

src/Verifier.sol#L60-L175


 - [ ] ID-3
[Groth16Verifier.verifyProof.asm_0.checkPairing()](src/Verifier.sol#L100-L156) calls [Groth16Verifier.verifyProof.asm_0.g1_mulAccC()](src/Verifier.sol#L75-L98) which halt the execution [return(uint256,uint256)(0,0x20)](src/Verifier.sol#L96)

src/Verifier.sol#L100-L156


## missing-zero-check
Impact: Low
Confidence: Medium
 - [ ] ID-4
[StealthWallet.withdraw(address,uint256,StealthWallet.OwnershipProof).to](src/StealthWallet.sol#L33) lacks a zero-check on :
		- [(success,None) = to.call{value: amount}()](src/StealthWallet.sol#L44)

src/StealthWallet.sol#L33


## assembly
Impact: Informational
Confidence: High
 - [ ] ID-5
[Groth16Verifier.verifyProof.asm_0.checkPairing()](src/Verifier.sol#L100-L156) uses assembly
	- [INLINE ASM](src/Verifier.sol#L100-L156)

src/Verifier.sol#L100-L156


 - [ ] ID-6
[Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])](src/Verifier.sol#L60-L175) uses assembly
	- [INLINE ASM](src/Verifier.sol#L66-L174)

src/Verifier.sol#L60-L175


 - [ ] ID-7
[Groth16Verifier.verifyProof.asm_0.checkField()](src/Verifier.sol#L67-L72) uses assembly
	- [INLINE ASM](src/Verifier.sol#L67-L72)

src/Verifier.sol#L67-L72


 - [ ] ID-8
[Groth16Verifier.verifyProof.asm_0.g1_mulAccC()](src/Verifier.sol#L75-L98) uses assembly
	- [INLINE ASM](src/Verifier.sol#L75-L98)

src/Verifier.sol#L75-L98


## pragma
Impact: Informational
Confidence: High
 - [ ] ID-9
2 different versions of Solidity are used:
	- Version constraint ^0.8.20 is used by:
 		- lib/openzeppelin-contracts/contracts/utils/Strings.sol#4
		- lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol#4
		- lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol#4
		- lib/openzeppelin-contracts/contracts/utils/math/Math.sol#4
		- lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol#4
	- Version constraint 0.8.20 is used by:
 		- src/EphemeralKeyRegistry.sol#2
		- src/MetaStealthAddressRegistry.sol#2
		- src/StealthWallet.sol#2
		- src/Verifier.sol#21

## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-10
Version constraint 0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- VerbatimInvalidDeduplication
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess.
 It is used by:
	- src/EphemeralKeyRegistry.sol#2
	- src/MetaStealthAddressRegistry.sol#2
	- src/StealthWallet.sol#2
	- src/Verifier.sol#21

 - [ ] ID-11
Version constraint ^0.8.20 contains known severe issues (https://solidity.readthedocs.io/en/latest/bugs.html)
	- VerbatimInvalidDeduplication
	- FullInlinerNonExpressionSplitArgumentEvaluationOrder
	- MissingSideEffectsOnSelectorAccess.
 It is used by:
	- lib/openzeppelin-contracts/contracts/utils/Strings.sol#4
	- lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol#4
	- lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol#4
	- lib/openzeppelin-contracts/contracts/utils/math/Math.sol#4
	- lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol#4

## low-level-calls
Impact: Informational
Confidence: High
 - [ ] ID-12
Low level call in [StealthWallet.withdraw(address,uint256,StealthWallet.OwnershipProof)](src/StealthWallet.sol#L33-L49):
	- [(success,None) = to.call{value: amount}()](src/StealthWallet.sol#L44)

src/StealthWallet.sol#L33-L49


## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-13
Parameter [Groth16Verifier.verifyProof.asm_0.checkPairing().pB_verifyProof_asm_0_checkPairing](src/Verifier.sol#L100) is not in mixedCase

src/Verifier.sol#L100


 - [ ] ID-14
Constant [Groth16Verifier.alphay](src/Verifier.sol#L31) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L31


 - [ ] ID-15
Constant [Groth16Verifier.IC0x](src/Verifier.sol#L45) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L45


 - [ ] ID-16
Parameter [Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])._pB](src/Verifier.sol#L62) is not in mixedCase

src/Verifier.sol#L62


 - [ ] ID-17
Constant [Groth16Verifier.betax1](src/Verifier.sol#L32) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L32


 - [ ] ID-18
Constant [Groth16Verifier.gammay1](src/Verifier.sol#L38) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L38


 - [ ] ID-19
Constant [Groth16Verifier.deltay1](src/Verifier.sol#L42) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L42


 - [ ] ID-20
Constant [Groth16Verifier.gammay2](src/Verifier.sol#L39) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L39


 - [ ] ID-21
Constant [Groth16Verifier.IC2y](src/Verifier.sol#L52) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L52


 - [ ] ID-22
Constant [Groth16Verifier.pLastMem](src/Verifier.sol#L58) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L58


 - [ ] ID-23
Constant [Groth16Verifier.pPairing](src/Verifier.sol#L56) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L56


 - [ ] ID-24
Constant [Groth16Verifier.IC0y](src/Verifier.sol#L46) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L46


 - [ ] ID-25
Parameter [Groth16Verifier.verifyProof.asm_0.checkPairing().pA_verifyProof_asm_0_checkPairing](src/Verifier.sol#L100) is not in mixedCase

src/Verifier.sol#L100


 - [ ] ID-26
Parameter [Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])._pA](src/Verifier.sol#L61) is not in mixedCase

src/Verifier.sol#L61


 - [ ] ID-27
Parameter [Groth16Verifier.verifyProof.asm_0.checkField().v_verifyProof_asm_0_checkField](src/Verifier.sol#L67) is not in mixedCase

src/Verifier.sol#L67


 - [ ] ID-28
Parameter [Groth16Verifier.verifyProof.asm_0.checkPairing().pubSignals_verifyProof_asm_0_checkPairing](src/Verifier.sol#L100) is not in mixedCase

src/Verifier.sol#L100


 - [ ] ID-29
Constant [Groth16Verifier.deltax2](src/Verifier.sol#L41) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L41


 - [ ] ID-30
Parameter [Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])._pubSignals](src/Verifier.sol#L64) is not in mixedCase

src/Verifier.sol#L64


 - [ ] ID-31
Constant [Groth16Verifier.IC1x](src/Verifier.sol#L48) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L48


 - [ ] ID-32
Constant [Groth16Verifier.IC2x](src/Verifier.sol#L51) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L51


 - [ ] ID-33
Constant [Groth16Verifier.deltay2](src/Verifier.sol#L43) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L43


 - [ ] ID-34
Constant [Groth16Verifier.r](src/Verifier.sol#L25) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L25


 - [ ] ID-35
Parameter [Groth16Verifier.verifyProof.asm_0.checkPairing().pMem_verifyProof_asm_0_checkPairing](src/Verifier.sol#L100) is not in mixedCase

src/Verifier.sol#L100


 - [ ] ID-36
Constant [Groth16Verifier.betax2](src/Verifier.sol#L33) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L33


 - [ ] ID-37
Constant [Groth16Verifier.gammax1](src/Verifier.sol#L36) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L36


 - [ ] ID-38
Constant [Groth16Verifier.pVk](src/Verifier.sol#L55) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L55


 - [ ] ID-39
Function [Groth16Verifier.verifyProof.asm_0.g1_mulAccC()](src/Verifier.sol#L75-L98) is not in mixedCase

src/Verifier.sol#L75-L98


 - [ ] ID-40
Parameter [Groth16Verifier.verifyProof.asm_0.g1_mulAccC().x_verifyProof_asm_0_g1_mulAccC](src/Verifier.sol#L75) is not in mixedCase

src/Verifier.sol#L75


 - [ ] ID-41
Parameter [Groth16Verifier.verifyProof.asm_0.g1_mulAccC().y_verifyProof_asm_0_g1_mulAccC](src/Verifier.sol#L75) is not in mixedCase

src/Verifier.sol#L75


 - [ ] ID-42
Constant [Groth16Verifier.deltax1](src/Verifier.sol#L40) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L40


 - [ ] ID-43
Parameter [Groth16Verifier.verifyProof.asm_0.g1_mulAccC().pR_verifyProof_asm_0_g1_mulAccC](src/Verifier.sol#L75) is not in mixedCase

src/Verifier.sol#L75


 - [ ] ID-44
Parameter [Groth16Verifier.verifyProof.asm_0.g1_mulAccC().s_verifyProof_asm_0_g1_mulAccC](src/Verifier.sol#L75) is not in mixedCase

src/Verifier.sol#L75


 - [ ] ID-45
Constant [Groth16Verifier.gammax2](src/Verifier.sol#L37) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L37


 - [ ] ID-46
Constant [Groth16Verifier.betay2](src/Verifier.sol#L35) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L35


 - [ ] ID-47
Constant [Groth16Verifier.IC1y](src/Verifier.sol#L49) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L49


 - [ ] ID-48
Constant [Groth16Verifier.q](src/Verifier.sol#L27) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L27


 - [ ] ID-49
Parameter [Groth16Verifier.verifyProof.asm_0.checkPairing().pC_verifyProof_asm_0_checkPairing](src/Verifier.sol#L100) is not in mixedCase

src/Verifier.sol#L100


 - [ ] ID-50
Constant [Groth16Verifier.alphax](src/Verifier.sol#L30) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L30


 - [ ] ID-51
Constant [Groth16Verifier.betay1](src/Verifier.sol#L34) is not in UPPER_CASE_WITH_UNDERSCORES

src/Verifier.sol#L34


 - [ ] ID-52
Parameter [Groth16Verifier.verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[2])._pC](src/Verifier.sol#L63) is not in mixedCase

src/Verifier.sol#L63


## unused-state
Impact: Informational
Confidence: High
 - [ ] ID-53
[Groth16Verifier.r](src/Verifier.sol#L25) is never used in [Groth16Verifier](src/Verifier.sol#L23-L176)

src/Verifier.sol#L25


## immutable-states
Impact: Optimization
Confidence: High
 - [ ] ID-54
[StealthWallet.verifier](src/StealthWallet.sol#L19) should be immutable 

src/StealthWallet.sol#L19


 - [ ] ID-55
[StealthWallet.code](src/StealthWallet.sol#L18) should be immutable 

src/StealthWallet.sol#L18


