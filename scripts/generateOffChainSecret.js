import EthCrypto from 'eth-crypto';

// FUJI DON PUBLIC KEY, make this configurable in the future
const DON_PUBLIC_KEY =
	'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c';

async function generateOffChainSecrets() {
	const message = { BEARER_TOKEN: process.env.BEARER_TOKEN };
	const signature = EthCrypto.sign(
		process.env.PRIVATE_KEY,
		EthCrypto.hash.keccak256(JSON.stringify(message))
	);
	const payload = { message, signature };
	const encrypted = await EthCrypto.encryptWithPublicKey(DON_PUBLIC_KEY, JSON.stringify(payload));

	console.log({
		'0x0': Buffer.from(EthCrypto.cipher.stringify(encrypted), 'hex').toString('base64')
	});
}

generateOffChainSecrets();
