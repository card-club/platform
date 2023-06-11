export const cardclub = [
	{
		inputs: [
			{ internalType: 'address', name: 'oracle', type: 'address' },
			{ internalType: 'address', name: 'linkTokenAddress', type: 'address' },
			{ internalType: 'address', name: 'linkBillingRegistryProxyAddress', type: 'address' },
			{ internalType: 'bytes32', name: 'sourceHashValue', type: 'bytes32' }
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{ inputs: [], name: 'CardClub_LinkAmountToLow', type: 'error' },
	{ inputs: [], name: 'CardClub_invalidSource', type: 'error' },
	{ inputs: [], name: 'CardClub_payLinkForAdFailed', type: 'error' },
	{ inputs: [], name: 'CardClub_payLinkForRegistryFailed', type: 'error' },
	{ inputs: [], name: 'CardClub_refundFailedContactUs', type: 'error' },
	{ inputs: [], name: 'EmptyArgs', type: 'error' },
	{ inputs: [], name: 'EmptySecrets', type: 'error' },
	{ inputs: [], name: 'EmptySource', type: 'error' },
	{ inputs: [], name: 'NoInlineSecrets', type: 'error' },
	{ inputs: [], name: 'RequestIsAlreadyPending', type: 'error' },
	{ inputs: [], name: 'RequestIsNotPending', type: 'error' },
	{ inputs: [], name: 'SenderIsNotRegistry', type: 'error' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'bytes32', name: 'requestId', type: 'bytes32' },
			{ indexed: false, internalType: 'bytes', name: 'result', type: 'bytes' },
			{ indexed: false, internalType: 'bytes', name: 'err', type: 'bytes' }
		],
		name: 'OCRResponse',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' }
		],
		name: 'OwnershipTransferRequested',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' }
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }],
		name: 'RequestFulfilled',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }],
		name: 'RequestSent',
		type: 'event'
	},
	{
		inputs: [],
		name: 'acceptOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'oracleAddress', type: 'address' },
			{ internalType: 'bytes32', name: 'requestId', type: 'bytes32' }
		],
		name: 'addSimulatedRequestId',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{ internalType: 'enum Functions.Location', name: 'codeLocation', type: 'uint8' },
					{ internalType: 'enum Functions.Location', name: 'secretsLocation', type: 'uint8' },
					{ internalType: 'enum Functions.CodeLanguage', name: 'language', type: 'uint8' },
					{ internalType: 'string', name: 'source', type: 'string' },
					{ internalType: 'bytes', name: 'secrets', type: 'bytes' },
					{ internalType: 'string[]', name: 'args', type: 'string[]' }
				],
				internalType: 'struct Functions.Request',
				name: 'req',
				type: 'tuple'
			},
			{ internalType: 'uint64', name: 'subscriptionId', type: 'uint64' },
			{ internalType: 'uint32', name: 'gasLimit', type: 'uint32' },
			{ internalType: 'uint256', name: 'gasPrice', type: 'uint256' }
		],
		name: 'estimateCost',
		outputs: [{ internalType: 'uint96', name: '', type: 'uint96' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getDONPublicKey',
		outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'bytes32', name: 'requestId', type: 'bytes32' },
			{ internalType: 'bytes', name: 'response', type: 'bytes' },
			{ internalType: 'bytes', name: 'err', type: 'bytes' }
		],
		name: 'handleOracleFulfillment',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{ internalType: 'address', name: 'publisherAddress', type: 'address' },
			{ internalType: 'uint256', name: 'linkAmount', type: 'uint256' },
			{ internalType: 'string', name: 'source', type: 'string' },
			{ internalType: 'bytes', name: 'secrets', type: 'bytes' },
			{ internalType: 'string[]', name: 'args', type: 'string[]' },
			{ internalType: 'uint64', name: 'subscriptionId', type: 'uint64' },
			{ internalType: 'uint32', name: 'gasLimit', type: 'uint32' }
		],
		name: 'purchaseAd',
		outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'requestLinkAmount',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'requestPublisherAddress',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'requestPublisherBalance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
		name: 'requestWalletAddress',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'address', name: 'oracle', type: 'address' }],
		name: 'updateOracleAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ internalType: 'bytes32', name: 'newSourceHash', type: 'bytes32' }],
		name: 'updateSourceHash',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'withdrawLinkOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'withdrawLinkPublisher',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
];
