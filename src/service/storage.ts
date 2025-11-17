import { File, Paths } from "expo-file-system";

const vaultFile = new File(Paths.document, "versteck_vault.json");

export async function writeVaultFile(content: string): Promise<void> {
  try {
    await vaultFile.write(content);
  } catch (error) {
    console.error("Erro ao escrever no arquivo:", error);
    throw error;
  }
}

export async function readVaultFile(): Promise<string | null> {
  try {
    if (!vaultFile.exists) {
      return null;
    }

    return await vaultFile.text();
  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
    throw error;
  }
}
