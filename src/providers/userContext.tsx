import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type UserContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
  masterKey: string;
  setMasterKey: Dispatch<SetStateAction<string>>;
};

export const UserInfoContext = createContext<UserContextType | undefined>(undefined);

type UserInfoProviderProps = {
  children: ReactNode;
};

export const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [masterKey, setMasterKey] = useState<string>("");

  const contextValue: UserContextType = {
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    masterKey,
    setMasterKey,
  };

  return <UserInfoContext.Provider value={contextValue}>{children}</UserInfoContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserInfoContext);

  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um userProvider");
  }

  return context;
};
