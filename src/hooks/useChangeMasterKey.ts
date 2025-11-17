import { useUser } from "@/providers/userContext";
import { decryptVault, EncryptedPayload, encryptVault } from "@/service/encrypt";
import { readVaultFile, writeVaultFile } from "@/service/storage";

export const useChangeMasterKey = () => {
  const { setMasterKey } = useUser();

  const changeKey = async (oldKey: string, newKey: string) => {
    console.log("🔐 Iniciando troca de Chave Mestra...");

    try {
      const content = await readVaultFile();

      if (!content) {
        setMasterKey(newKey);
        return true;
      }

      const payload: EncryptedPayload = JSON.parse(content);

      const currentVaultData = await decryptVault(oldKey, payload);

      console.log("🔓 Cofre aberto. Re-criptografando com nova chave...");

      const newPayload = await encryptVault(newKey, currentVaultData);

      const fileString = JSON.stringify(newPayload);
      await writeVaultFile(fileString);

      setMasterKey(newKey);

      console.log("Chave Mestra alterada e Contexto atualizado!");
      return true;
    } catch (error) {
      console.error("Falha ao alterar chave mestra:", error);
      throw error;
    }
  };

  return { changeKey };
};
