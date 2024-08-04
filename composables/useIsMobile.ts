export default function () {
  return (
    window &&
    window.matchMedia &&
    window.matchMedia('screen and (max-width: 600px)').matches
  );
}
