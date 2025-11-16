import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItem = async ({ key }: { key: string }) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

export const saveItem = async ({ key, value }: { key: string; value: any }) => {
  const stringfiedValue = JSON.stringify(value);

  await AsyncStorage.setItem(key, stringfiedValue);
  return value;
};
