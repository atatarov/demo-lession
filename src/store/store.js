// store.js

let user = { name: "Alice" };
const listeners = new Set();

export const setUser = (newUser) => {
  user = newUser;
  listeners.forEach((l) => l());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getUser = () => user;
