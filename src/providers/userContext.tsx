import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type UserContextType = {
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
  masterKey: string;
  setMasterKey: Dispatch<SetStateAction<string>>;
};

export const UserInfoContext = createContext<UserContextType | undefined>(
  undefined
);

type UserInfoProviderProps = {
  children: ReactNode;
};

export const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [user, setUser] = useState<string>("");
  const [masterKey, setMasterKey] = useState<string>("");

  const contextValue: UserContextType = {
    user,
    setUser,
    masterKey,
    setMasterKey,
  };

  return (
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserInfoContext);

  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um userProvider");
  }

  return context;
};
