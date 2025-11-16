import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

type KeyContextType = {
  Key: string;
  setKey: Dispatch<SetStateAction<string>>;
  masterKey: string;
  setMasterKey: Dispatch<SetStateAction<string>>;
};

export const KeyContext = createContext<KeyContextType | undefined>(undefined);

type KeyProviderProps = {
  children: ReactNode;
};

export const KeyProvider = ({ children }: KeyProviderProps) => {
  const [Key, setKey] = useState<string>("");
  const [masterKey, setMasterKey] = useState<string>("");

  const contextValue: KeyContextType = {
    Key,
    setKey,
    masterKey,
    setMasterKey,
  };

  return (
    <KeyContext.Provider value={contextValue}>{children}</KeyContext.Provider>
  );
};

export const useKey = () => {
  const context = useContext(KeyContext);

  if (context === undefined) {
    throw new Error("useKey deve ser usado dentro de um keyProvider");
  }

  return context;
};
