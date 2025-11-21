import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { api } from "@/service/api";
import { decryptVault, EncryptedPayload, encryptVault } from "@/service/encrypt";
import { readVaultFile, writeVaultFile } from "@/service/storage";
import { useQuery } from "@tanstack/react-query";
import { Buffer } from "buffer";

export const syncVaultWithServer = async (payload: EncryptedPayload) => {
  try {
    await api.put("/vaultdata", {
      encryptedBlob: payload.encryptedData,
      vaultIV: payload.iv,
      vaultTag: payload.tag,
      //kdfSalt: payload.salt,
    });
    console.log("Cofre sincronizado com a nuvem!");
  } catch (error) {
    console.error("Falha ao sincronizar com a nuvem (dados salvos apenas localmente)", error);
    // Aqui posso adicionar lógica de "fila de sync" para tentar novamente, talvez...
  }
};

export const useLoadPasswords = () => {
  const { masterKey } = useUser();

  return useQuery<IPassword[], Error>({
    queryKey: ["passwords", masterKey],
    queryFn: async () => {
      if (!masterKey) return [];

      const content = await readVaultFile();
      if (!content) return [];

      try {
        const payload: EncryptedPayload = JSON.parse(content);

        const masterKeyBuffer = Buffer.from(masterKey, "base64");

        const vaultData = await decryptVault(masterKeyBuffer, payload);
        return vaultData as IPassword[];
      } catch (error) {
        console.error("Falha ao carregar senhas:", error);
        throw error;
      }
    },
    enabled: !!masterKey,
  });
};

export const useSavePassword = async (masterKey: string, newPassword: IPassword) => {
  try {
    const content = await readVaultFile();
    let currentVault: IPassword[] = [];
    let currentSalt: string | undefined;

    const masterKeyBuffer = Buffer.from(masterKey, "base64");

    if (content) {
      const payload: EncryptedPayload = JSON.parse(content);
      currentSalt = payload.salt;
      currentVault = await decryptVault(masterKeyBuffer, payload);
    } else {
      throw new Error("Cofre não inicializado. Faça login novamente.");
    }

    currentVault.push(newPassword);

    const newPayload = await encryptVault(masterKeyBuffer, currentVault, currentSalt);

    await writeVaultFile(JSON.stringify(newPayload));
    await syncVaultWithServer(newPayload);

    return true;
  } catch (error) {
    console.error("Erro no processo de salvar senha:", error);
    throw error;
  }
};

export const useEditPassword = async (masterKey: string, updatedItem: IPassword) => {
  try {
    const content = await readVaultFile();
    let currentVault: IPassword[] = [];
    let currentSalt: string | undefined;

    const masterKeyBuffer = Buffer.from(masterKey, "base64");

    if (content) {
      const payload: EncryptedPayload = JSON.parse(content);
      currentSalt = payload.salt;
      currentVault = await decryptVault(masterKeyBuffer, payload);
    } else {
      throw new Error("Cofre não inicializado. Faça login novamente.");
    }

    const newVault = currentVault.map((item) => (item.uuid === updatedItem.uuid ? updatedItem : item));

    const newPayload = await encryptVault(masterKeyBuffer, newVault, currentSalt);

    await writeVaultFile(JSON.stringify(newPayload));
    await syncVaultWithServer(newPayload);

    return true;
  } catch (error) {
    console.error("Erro ao editar senha:", error);
    throw error;
  }
};

export const useDeletePassword = async (masterKey: string, itemUuid: string) => {
  try {
    const content = await readVaultFile();
    let currentVault: IPassword[] = [];
    let currentSalt: string | undefined;

    const masterKeyBuffer = Buffer.from(masterKey, "base64");

    if (content) {
      const payload: EncryptedPayload = JSON.parse(content);
      currentSalt = payload.salt;
      currentVault = await decryptVault(masterKeyBuffer, payload);
    } else {
      throw new Error("Cofre não inicializado. Faça login novamente.");
    }

    const newVault = currentVault.filter((item) => item.uuid !== itemUuid);

    const newPayload = await encryptVault(masterKeyBuffer, newVault, currentSalt);

    await writeVaultFile(JSON.stringify(newPayload));
    await syncVaultWithServer(newPayload);

    return true;
  } catch (error) {
    console.error("Erro ao excluir senha:", error);
    throw error;
  }
};
