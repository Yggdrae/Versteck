import { Buffer } from "buffer";
const { pbkdf2Sync, createHash } = require("react-native-quick-crypto");

const KEY_LENGTH = 32;
const ITERATIONS = 100000;
const KDF_ALGORITHM = "sha512";

export const deriveMasterKey = (password: string, saltBase64: string): Buffer => {
    const saltBuffer = Buffer.from(saltBase64, "base64");

    const derivedKey = pbkdf2Sync(
        password,
        saltBuffer,
        ITERATIONS,
        KEY_LENGTH,
        KDF_ALGORITHM
    );

    return derivedKey;
};

export const hashForLogin = (keyBuffer: Buffer): string => {
    return createHash("sha256").update(keyBuffer).digest("hex");
};