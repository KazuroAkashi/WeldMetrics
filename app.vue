<template>
  <Title>WeldMetrics</Title>
  <Transition name="load">
    <div
      class="loading-overlay"
      :style="{
        '--logo-left': logoPos.left + 'px',
        '--logo-top': logoPos.top + 'px',
        '--logo-height': logoPos.height + 'px',
      }"
      v-if="loading"
    >
      <div class="loading-icon"></div>
      <p class="loading-text">Initializing...</p>
      <div class="loading-bg"></div>
      <!-- <h1 class="loading-title">İTÜGH</h1> -->
      <!-- <img class="loading-logo" src="/itugh_logo.svg" /> -->
    </div>
  </Transition>
  <Body
    :class="{
      animated: animated_store.animated,
      'dark-theme': darktheme_store.darktheme,
      touchscreen: useIsTouchscreen(),
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>

<script setup lang="ts">
import { useAnimatedStore, useDarkthemeStore } from "@/stores/options";

const animated_store = useAnimatedStore();
const darktheme_store = useDarkthemeStore();

const loading = ref(true);
const logoPos = ref({ left: 0, top: 0, height: 0 });

onMounted(async () => {
  await nextTick();
  logoPos.value = useLogoLocation().get().value || {
    left: 0,
    top: 0,
    height: 0,
  };
  await nextTick();
  loading.value = false;
});

interface CustomElement extends HTMLElement {
  clickOutsideEvent: (e: MouseEvent) => any;
}

const app = useNuxtApp();
app.vueApp.directive("click-outside", {
  mounted(element, binding, vnode) {
    const el = element as CustomElement;

    el.clickOutsideEvent = function (event: MouseEvent) {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value.call(vnode.appContext, event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

if (
  window &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  darktheme_store.turnon();
}

if (
  window &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion)").matches
) {
  animated_store.turnoff();
}
</script>

<style lang="scss">
.load-enter-active,
.load-leave-active {
  .animated &,
  .animated & * {
    transition: 0.3s all;
  }
}

.load-leave-to {
  .loading-bg,
  .loading-icon,
  .loading-text {
    opacity: 0;
  }

  .loading-logo {
    top: var(--logo-top) !important;
    left: var(--logo-left) !important;
    height: var(--logo-height) !important;

    transform: translate(0, 0) !important;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  row-gap: 10px;

  z-index: 9999;

  .loading-bg {
    width: 100%;
    height: 100%;
    background: var(--background-color);
  }

  .loading-logo {
    position: absolute;
    height: 50px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .loading-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
    animation: load 0.8s infinite linear;

    display: inline;
    width: 4rem;
    height: 4rem;

    border: 3px solid #00d2e1;
    border-radius: 4rem;
  }

  .loading-text {
    position: absolute;
    top: calc(50% + 1.5rem + 2.5rem);
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: sans-serif;
    font-size: 1.25rem;
  }
}

@keyframes load {
  from {
    transform: translate(-50%, -50%) rotateZ(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotateZ(360deg);
  }
}
</style>
