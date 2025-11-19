import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { api } from "@/service/api";
import { decryptVault, EncryptedPayload, encryptVault } from "@/service/encrypt";
import { readVaultFile, writeVaultFile } from "@/service/storage";
import { useQuery } from "@tanstack/react-query";

const syncVaultWithServer = async (payload: EncryptedPayload) => {
  try {
    await api.put("/vault", {
      vaultData: payload.encryptedData,
      vaultIv: payload.iv,
      vaultTag: payload.tag,
      kdfSalt: payload.salt,
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
        const vaultData = await decryptVault(masterKey, payload);
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

    if (content) {
      const payload: EncryptedPayload = JSON.parse(content);
      currentVault = await decryptVault(masterKey, payload);
    }

    currentVault.push(newPassword);

    const newPayload = await encryptVault(masterKey, currentVault);

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
    if (!content) throw new Error("Cofre vazio.");

    const payload: EncryptedPayload = JSON.parse(content);
    const currentVault = (await decryptVault(masterKey, payload)) as IPassword[];

    const newVault = currentVault.map((item) => (item.uuid === updatedItem.uuid ? updatedItem : item));

    const newPayload = await encryptVault(masterKey, newVault);

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
    if (!content) throw new Error("Cofre não encontrado.");

    const payload: EncryptedPayload = JSON.parse(content);
    const currentVault = (await decryptVault(masterKey, payload)) as IPassword[];

    const newVault = currentVault.filter((item) => item.uuid !== itemUuid);

    const newPayload = await encryptVault(masterKey, newVault);

    await writeVaultFile(JSON.stringify(newPayload));

    await syncVaultWithServer(newPayload);

    return true;
  } catch (error) {
    console.error("Erro ao excluir senha:", error);
    throw error;
  }
};
