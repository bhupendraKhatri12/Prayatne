// const context = {
//     stage: "youtube",
//     purpose: "youtube demo",
//     origin: "us-east-1"
// };

const AWS = require('aws-sdk');
const crypto = require('crypto');

AWS.config.update({ region: 'ap-south-1' });

const kms = new AWS.KMS();
const kekKeyId = 'arn:aws:kms:ap-south-1:660766815990:key/f3101f51-c4a4-4949-b88c-a9d9034b43d3'; // KEK key ID

// AES-256 encryption function
const encryptAES = (data, key, iv) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

// Generate a random initialization vector (IV)
const generateRandomIV = () => crypto.randomBytes(16).toString('base64');

// Generate a Data Encryption Key (DEK) using AWS KMS with encryption context
const generateDataKey = (keyId, encryptionContext) => {
    return new Promise((resolve, reject) => {
        const generateDataKeyParams = {
            KeyId: keyId,
            KeySpec: 'AES_256',
            EncryptionContext: encryptionContext, // Include encryption context here
        };

        kms.generateDataKey(generateDataKeyParams, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    plaintextKey: data.Plaintext,
                    ciphertextKey: data.CiphertextBlob,
                });
            }
        });
    });
};

// Example usage
(async () => {
    try {
        // Simulate known plaintext data (replace with actual data)
        const plaintextData = 'rajendra';
        console.log('plain Data:', plaintextData);

        // Generate Data Encryption Key (DEK) using AWS KMS with encryption context
        const dataKey = await generateDataKey(kekKeyId, context);

        const dek = dataKey.plaintextKey;
        const encryptedDataKey = dataKey.ciphertextKey;

        // Generate a random initialization vector (IV)
        const iv = generateRandomIV();

        // Encrypt data with DEK
        const encryptedData = encryptAES(plaintextData, dek, Buffer.from(iv, 'base64'));

        // Store encrypted data, DEK, and IV in your database or use them as needed
        console.log('Encrypted Data:', encryptedData);
        console.log('Encrypted DEK:', encryptedDataKey.toString('base64'));
        console.log('Initialization Vector:', iv);
    } catch (error) {
        console.error('Error:', error);
    }
})();