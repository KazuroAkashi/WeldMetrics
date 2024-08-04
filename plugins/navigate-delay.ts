let lock = ref(false);

export default defineNuxtPlugin(() => ({
  provide: {
    navlock: lock,
    navigateTo: (href: string) => {
      if (lock.value) return;

      navigateTo(href);
      lock.value = true;
      setTimeout(() => {
        lock.value = false;
      }, 400);
    },
  },
}));
