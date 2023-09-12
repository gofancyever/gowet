const crypto = require('crypto-js');
const sm4 = require("sm-crypto").sm4;
const sm2 = require("sm-crypto").sm2;
const encryptModule = {
    key: 'sxlkkjoefncxmggg',
    iv: '0682036802830600',
    clearEncoding: 'utf8',
    cipherEncoding: 'base64',
    algorithm: 'aes-128-cbc',
    publicKey: '0357ec8913637b97ec578430ae384c3cbb5be35db89674384f75ca66682b174dfb',
    privateKey: '9935ea2c2cb01d27cf320e2e1ac005930a671f9bb4121ac2cc5e67e9066e40b3',
    resPrivateKey:"180b634d908ca010707a3b145d49230c6591532385670c25cfd7faf884dc7aad",
    j_img666555_d_m(params) {
        var akey = crypto.enc.Utf8.parse(encryptModule.key);
        var decrypt = crypto.AES.decrypt(params, akey, { iv: crypto.enc.Utf8.parse(encryptModule.iv), mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
        var decryptedStr = decrypt.toString(crypto.enc.Utf8);
        return decryptedStr.toString();
    },
    j_img666555_e_m(params) {
        var word = params
        if (typeof params != 'string') {
            word = JSON.stringify(params)
        }
        var srcs = crypto.enc.Utf8.parse(word);
        var akey = crypto.enc.Utf8.parse(encryptModule.key);
        var encrypted = crypto.AES.encrypt(srcs, akey, {
            iv: crypto.enc.Utf8.parse(encryptModule.iv), mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7});
        return encrypted.toString()
    },
    sm4Encrypt(data, sm4Key) {
        return sm4.encrypt(data, sm4Key = "X2E10EJTMCTV58VJI76LN050CEBEW5N5")
    },
    sm4Decrypt(data, sm4Key) {
        return sm4.decrypt(data, sm4Key = "X2E10EJTMCTV58VJI76LN050CEBEW5N5")
    },
    sm2Encrypt(data) {

        const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
        const encryptData = sm2.doEncrypt(data, encryptModule.publicKey, cipherMode) // 加密结果
        return encryptData;
    },
    sm2Decrypt(data) {
        const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
        const decryptData = sm2.doDecrypt(data, encryptModule.privateKey, cipherMode) // 解密结果
        return decryptData;
    },
    sm2ResDecrypt(data) {
        const cipherMode = 1 // 1 - C1C3C2，0 - C1C2C3，默认为1
        const decryptData = sm2.doDecrypt(data, encryptModule.resPrivateKey, cipherMode) // 解密结果
        return decryptData;
    },
    objToBase64(obj) {
        return encodeURIComponent(Buffer.from(JSON.stringify(obj)).toString('base64'));
    },
    base64ToObj(base64) {
        return JSON.parse(Buffer.from(decodeURIComponent(base64), 'base64').toString());
    }
};
// const result = encryptModule.j_img666555_d_m("YOiRqu+mXLvpqfuJNN+qli1x4EKZYZNhFVhwuX02q3lLgtW5yxKujTuBJ0Mkg/YC+cH/kkGSwzJoVNl/4nLLvMF9GNdgEyA9ACh92Bgy3vP9zGPDH/0F7A6fLBZBQnFYQg86WNLoqiRmeBxgzmp44BSH3H6ybodrPVb0uN245tH4DdSQ+03N/fnFzREq66vqRSXhNzmY7sv5IYNtsFOeMGr8bu3WPCK6rISEaL6hyx5vJe6EUWuCLoLSJSKOUX0r")
// console.log(result)
export default encryptModule

