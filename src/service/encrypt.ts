import { Buffer } from "buffer";
const { pbkdf2Sync, createCipheriv, createDecipheriv, randomBytes } = require("react-native-quick-crypto");

const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;
const HASH_ALGORITHM = "sha512";
const GCM_TAG_LENGTH = 16;
const ALGORITHM = "aes-256-gcm";

export interface EncryptedPayload {
  encryptedData: string;
  salt: string;
  iv: string;
  tag: string;
}

export async function encryptVault(
  keyOrPassword: string | Buffer,
  data: any,
  providedSaltBase64?: string
): Promise<EncryptedPayload> {
  try {
    const dataString = JSON.stringify(data);
    const iv = randomBytes(IV_LENGTH);

    let derivedKey: Buffer;
    let saltBase64: string;

    if (Buffer.isBuffer(keyOrPassword)) {
      if (!providedSaltBase64) {
        throw new Error("Ao usar uma chave pré-derivada (Buffer), o Salt é obrigatório.");
      }
      derivedKey = keyOrPassword;
      saltBase64 = providedSaltBase64;
    } else {
      const salt = providedSaltBase64 ? Buffer.from(providedSaltBase64, "base64") : randomBytes(SALT_LENGTH);

      saltBase64 = salt.toString("base64");

      derivedKey = pbkdf2Sync(keyOrPassword, salt, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
    }

    const cipher = createCipheriv(ALGORITHM, derivedKey, iv);

    let encrypted = cipher.update(dataString, "utf8", "base64");
    encrypted += cipher.final("base64");

    const tag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      salt: saltBase64,
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
    };
  } catch (error) {
    console.error("Erro ao criptografar:", error);
    throw new Error("Falha ao criptografar o cofre.");
  }
}

export async function decryptVault(keyOrPassword: string | Buffer, payload: EncryptedPayload): Promise<any> {
  try {
    const { encryptedData, salt, iv, tag } = payload;

    const saltBytes = Buffer.from(salt, "base64");
    const ivBytes = Buffer.from(iv, "base64");
    const tagBytes = Buffer.from(tag, "base64");

    let derivedKey: Buffer;

    if (Buffer.isBuffer(keyOrPassword)) {
      derivedKey = keyOrPassword;
    } else {
      derivedKey = pbkdf2Sync(keyOrPassword, saltBytes, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
    }

    const decipher = createDecipheriv(ALGORITHM, derivedKey, ivBytes);

    decipher.setAuthTag(tagBytes);

    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Erro ao descriptografar:", error);
    throw new Error("Falha ao descriptografar o cofre. Chave mestra incorreta?");
  }
}
