export default function <T>(name: string, def?: T): Ref<T> {
  let deff = def;
  if (window) {
    const val = window.sessionStorage.getItem(name);
    if (val) {
      deff = JSON.parse(val).val;
    }
  }

  const r = ref(deff) as Ref<T>;

  watch(r, () => {
    if (window) {
      window.sessionStorage.setItem(name, JSON.stringify({ val: r.value }));
    }
  });

  return r;
}
