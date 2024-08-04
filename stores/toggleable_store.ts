import { defineStore } from 'pinia';

export const useToggleableStore = (name: string) =>
  defineStore(name, {
    state: () => ({
      [name]: true,
    }),
    actions: {
      toggle() {
        this[name] = !this[name];
      },
      turnon() {
        this[name] = true;
      },
      turnoff() {
        this[name] = false;
      },
    },
  });
