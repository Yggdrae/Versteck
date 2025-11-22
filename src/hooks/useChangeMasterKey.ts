import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { api } from "@/service/api";
import { decryptVault, EncryptedPayload, encryptVault } from "@/service/encrypt";
import { deriveMasterKey, hashForLogin } from "@/service/hash";
import { readVaultFile, writeVaultFile } from "@/service/storage";
import { Buffer } from "buffer";

export const useChangeMasterKey = () => {
  const { setMasterKey } = useUser();

  const changeKey = async (oldKey: string, newKey: string) => {
    console.log("Iniciando troca de Chave Mestra...");

    try {
      const content = await readVaultFile();
      let currentPayload: EncryptedPayload;
      let currentVault: IPassword[] = [];
      let currentSalt: string | undefined;

      if (content) {
        currentPayload = JSON.parse(content);
        currentSalt = currentPayload.salt;
      } else {
        throw new Error("Cofre não inicializado. Faça login novamente.");
      }

      const derivedMasterKey = deriveMasterKey(oldKey, currentSalt);
      const masterKeyString = derivedMasterKey.toString("base64");
      const masterKeyBuffer = Buffer.from(masterKeyString, "base64");

      currentVault = await decryptVault(masterKeyBuffer, currentPayload);

      console.log("Criptografando com nova chave...");

      const newMasterKeyBuffer = deriveMasterKey(newKey, currentSalt);
      const newLoginHash = hashForLogin(newMasterKeyBuffer);
      const newMasterKeyString = newMasterKeyBuffer.toString("base64");

      const newPayload = await encryptVault(newMasterKeyBuffer, currentVault, currentSalt);

      await writeVaultFile(JSON.stringify(newPayload));

      await api.put("/usuarios/update", {
        novoEncryptedBlob: newPayload.encryptedData,
        novoVaultIV: newPayload.iv,
        novoVaultTag: newPayload.tag,
        novoKdfSalt: newPayload.salt,
        novaSenha: newLoginHash,
      });

      setMasterKey(newMasterKeyString);

      console.log("Chave Mestra e Senha de Login alteradas e sincronizadas!");
      return true;
    } catch (error) {
      console.error("Falha ao alterar chave mestra:", error);
      throw error;
    }
  };

  return { changeKey };
};
