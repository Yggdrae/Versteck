import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type passesProps = {
  uuid: string;
  name: string;
  pass: string;
};

type KeyContextType = {
  keys: passesProps[];
  setKeys: Dispatch<SetStateAction<passesProps[]>>;
};

export const KeyContext = createContext<KeyContextType | undefined>(undefined);

type KeyProviderProps = {
  children: ReactNode;
};

export const KeyProvider = ({ children }: KeyProviderProps) => {
  const [keys, setKeys] = useState<passesProps[]>([]);

  const contextValue: KeyContextType = {
    keys,
    setKeys,
  };

  return <KeyContext.Provider value={contextValue}>{children}</KeyContext.Provider>;
};

export const useKey = () => {
  const context = useContext(KeyContext);

  if (context === undefined) {
    throw new Error("useKey deve ser usado dentro de um keyProvider");
  }

  return context;
};
