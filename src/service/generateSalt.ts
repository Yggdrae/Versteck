import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";

const SALT_SIZE_BYTES = 32;

export const generateSalt = (): string => {
    const randomBytes = Crypto.getRandomBytes(SALT_SIZE_BYTES);

    return Buffer.from(randomBytes).toString("base64");
};