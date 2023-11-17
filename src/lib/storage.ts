export enum StorageType {
  // eslint-disable-next-line no-unused-vars
  INSERT_TO_CALENDAR = 'insert-to-calendar',
}

const hasStorage = () => typeof window !== 'undefined' && window.localStorage;

export const setItem = (type: StorageType, value: string) => {
  if (!hasStorage()) return;

  localStorage.setItem(type, value);
};

export const getItem = (type: StorageType) => {
  if (!hasStorage()) return;

  return localStorage.getItem(type);
};
