const pos = ref();

export default function () {
  return {
    set(rect: DOMRect) {
      if (window) {
        const left = rect.left;
        const top = rect.top;
        const height = rect.height;

        pos.value = { left, top, height };
      }
    },
    get() {
      return pos;
    },
  };
}
