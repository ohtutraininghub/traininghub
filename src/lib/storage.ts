/* eslint-disable no-unused-vars */

type StorageTypeValue = {
  'insert-to-calendar': boolean | undefined;
};

export enum StorageType {
  INSERT_TO_CALENDAR = 'insert-to-calendar',
}

const hasStorage = () => typeof window !== 'undefined' && window.localStorage;

export const setItem = <T extends keyof StorageTypeValue>(
  type: StorageType,
  value: StorageTypeValue[T]
) => {
  if (!hasStorage()) return;

  localStorage.setItem(type, JSON.stringify(value));
};

export const getItem = <T extends keyof StorageTypeValue>(
  type: T
): StorageTypeValue[T] => {
  if (!hasStorage()) return;

  const storedValue = localStorage.getItem(type);
  if (!storedValue) return;

  return JSON.parse(storedValue);
};
