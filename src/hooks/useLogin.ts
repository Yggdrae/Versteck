import { api } from "@/service/api";
import { decryptVault, EncryptedPayload } from "@/service/encrypt";
import { deriveMasterKey, hashForLogin } from "@/service/hash";
import { writeVaultFile } from "@/service/storage";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";

export const useLogin = () =>
  useMutation({
    mutationFn: async (input: { email: string; masterKeyInput: string }) => {
      const { data: saltData } = await api.get(`/auth/salt/${input.email}`);
      const serverSalt = saltData.salt;

      if (!serverSalt) {
        throw new Error("Usuário não encontrado ou dados corrompidos.");
      }

      const masterKeyBuffer = deriveMasterKey(input.masterKeyInput, serverSalt);
      const loginPassword = hashForLogin(masterKeyBuffer);
      const masterKeyString = masterKeyBuffer.toString("base64");

      const { data: loginResponse } = await api.post("/auth/login", {
        email: input.email,
        password: loginPassword,
      });

      const payload: EncryptedPayload = {
        encryptedData: loginResponse.vaultData,
        iv: loginResponse.vaultIv,
        salt: loginResponse.kdfSalt,
        tag: loginResponse.vaultTag,
      };

      await decryptVault(masterKeyString, payload);

      await SecureStore.setItemAsync("auth_token", loginResponse.token);
      await writeVaultFile(JSON.stringify(payload));

      return { masterKey: masterKeyString };
    },
  });
