import { api } from "@/service/api";
import { decryptVault, EncryptedPayload } from "@/service/encrypt";
import { deriveMasterKey, hashForLogin } from "@/service/hash";
import { writeVaultFile } from "@/service/storage";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

export const useLogin = () =>
  useMutation({
    mutationFn: async (input: { email: string; masterKeyInput: string }) => {
      const { data: saltData } = await api.get(`/auth/kdfsalt/${input.email}`);
      const serverSalt = saltData.kdfSalt;

      console.log(serverSalt);

      if (!serverSalt) {
        throw new Error("Usuário não encontrado ou dados corrompidos.");
      }

      const masterKeyBuffer = deriveMasterKey(input.masterKeyInput, serverSalt);
      const loginPassword = hashForLogin(masterKeyBuffer);
      const masterKeyString = masterKeyBuffer.toString("base64");

      const { data: loginResponse } = await api.post("/auth/login", {
        email: input.email,
        senha: loginPassword,
      });

      const payload: EncryptedPayload = {
        encryptedData: loginResponse.vaultData.encryptedBlob,
        iv: loginResponse.vaultData.vaultIV,
        salt: serverSalt,
        tag: loginResponse.vaultData.vaultTag,
      };

      await decryptVault(masterKeyBuffer, payload);

      const token = loginResponse.access_token;

      if (!token) {
        throw new Error("Token de autenticação inválido ou ausente.");
      }

      await SecureStore.setItemAsync("auth_token", token);
      await writeVaultFile(JSON.stringify(payload));

      return { masterKey: masterKeyString };
    },
  });
