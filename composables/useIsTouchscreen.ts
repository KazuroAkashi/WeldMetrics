export default function () {
  return (
    window &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches
  );
}
