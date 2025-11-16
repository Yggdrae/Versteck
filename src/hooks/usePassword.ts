import { IPassword } from "@/interface/password";
import { useUser } from "@/providers/userContext";
import { useQuery } from "@tanstack/react-query";

export const usePasswords = () => {
  const { user } = useUser();

  return useQuery<IPassword[], Error>({
    queryKey: ["passwords", user],
    queryFn: async () => {
      if (!user) {
        throw new Error("User not available in context");
      }

      /* const response = await api.get(`/api/${user}/passwords`);

      return response.data as IPassword[]; */

      return [
        {
            account: "github",
            encryptedPass: "AAAA"
        }
    ];
    },
  });
};
