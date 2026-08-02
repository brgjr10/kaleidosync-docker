export default function debug(namespace) {
  return function(...args) {
    console.log(`[${namespace}]`, ...args);
  };
}

export const formatArgs = () => {};
export const save = () => {};
export const load = () => {};
export const useColors = () => false;
export const storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
export const destroy = () => {};
export const colors = [];
export const log = () => {};
export const formatters = {};
