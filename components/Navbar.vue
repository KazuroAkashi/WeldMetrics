<template>
  <nav class="navbar" ref="nav">
    <!-- <h1 ref="logo" class="title" @click="$navigateTo('/')">
      <span class="itu">İTÜ</span>
      <span class="gh">GH</span>
    </h1> -->
    <img
      ref="logo"
      class="logo"
      src="/itugh_logo.svg"
      href="/"
      @click="$navigateTo('/')"
      alt="ITUGH Logo"
    />
    <Button
      v-for="button in $props.buttons"
      v-show="!useIsMobile()"
      type="link"
      class="navlink"
      :href="button.href"
      :icon="button.icon"
      :righticon="button.sub ? 'expand_more' : undefined"
      tabindex="0"
      :href-selected="button.sub ? button.sub.filter(obj => obj.href).map(obj => obj.href!) : true"
      clickable-when-selected
      >{{ button.title }}

      <template v-if="button.sub" #submenu="{ hovered }">
        <Accordion :open="hovered" class="submenu">
          <Button
            v-for="subbtn in button.sub"
            type="link"
            :href="subbtn.href"
            :icon="subbtn.icon"
            href-selected
            >{{ subbtn.title }}</Button
          >
        </Accordion>
      </template>
    </Button>
    <TextField
      v-if="$props.search"
      v-show="!useIsMobile()"
      class="navlink"
      placeholder="Search"
      icon="search"
      underlined
    />

    <Button
      class="menubtn"
      type="empty"
      corners="circle"
      onlyicon
      icon="menu"
      tabindex="0"
      @click="toggleMenu"
      v-show="useIsMobile()"
      :selected="menuopen || menuAccOpen.some((val) => val)"
      clickable-when-selected
    ></Button>
    <Accordion class="navmenu" :open="menuopen" v-show="useIsMobile()">
      <Button
        v-for="(button, i) in $props.buttons"
        type="link"
        class="navlink"
        :href="button.href"
        :icon="button.icon"
        @click="button.sub ? navmenuBtnClick(i) : toggleMenu()"
        :righticon="button.sub ? 'chevron_right' : undefined"
        tabindex="0"
        :href-selected="button.sub ? button.sub.filter(obj => obj.href).map(obj => obj.href!) : true"
        clickable-when-selected
        >{{ button.title }}
      </Button>
    </Accordion>
    <Accordion
      v-for="(button, i) in $props.buttons"
      :open="menuAccOpen[i]"
      class="navsubmenu"
    >
      <Button
        v-if="button.sub"
        type="link"
        @click="subBackClicked(i)"
        icon="arrow_back"
        class="navlink"
        >Back</Button
      >
      <Button
        v-if="button.sub"
        v-for="subbtn in button.sub"
        type="link"
        :href="subbtn.href"
        @click="toggleMenu()"
        :icon="subbtn.icon"
        class="navlink"
        href-selected
        >{{ subbtn.title }}</Button
      >
    </Accordion>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  buttons: ListButton[];
  search?: boolean;
}>();

const nav = ref() as Ref<HTMLElement>;
const logo = ref() as Ref<HTMLElement>;
const navHeight = defineModel('navHeight');

const menuopen = ref(false);
const menuAccOpen = ref(Array(props.buttons.length).fill(false));

onMounted(async () => {
  navHeight.value = nav.value.clientHeight;
  console.log(logo.value.getBoundingClientRect());
  useLogoLocation().set(logo.value.getBoundingClientRect());
});

const toggleMenu = () => {
  if (menuAccOpen.value.some((val) => val === true)) {
    for (let i = 0; i < menuAccOpen.value.length; i++) {
      menuAccOpen.value[i] = false;
    }
  } else {
    menuopen.value = !menuopen.value;
  }
};

const navmenuBtnClick = (i: number) => {
  menuAccOpen.value[i] = !menuAccOpen.value[i];
  menuopen.value = false;
};

const subBackClicked = (i: number) => {
  menuAccOpen.value[i] = false;
  menuopen.value = true;
};
</script>

<style scoped lang="scss">
.title {
  margin-right: auto;
  margin-bottom: -2px;
  user-select: none;
  font-size: 1.8rem;

  cursor: pointer;

  .itu {
    color: #444;
  }

  .gh {
    color: #00d2e1;
    text-shadow: 0 0 5px #00d2e1;
  }
}

.logo {
  height: 35px;
  margin-right: auto;
  cursor: pointer;
}

.navbar {
  position: relative;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  // border-bottom: 2px solid #aaa;

  background-color: var(--background-color-r1);
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.6);

  padding: 0 70px;
}

.navlink {
  margin: 15px 30px;
  position: relative;
}

.submenu {
  cursor: default;

  --padding: 10px 30px 10px 15px;
  background: var(--background-color-r2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  position: absolute;

  top: 100%;
  left: -2px;

  z-index: 50;
}

.navmenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;

  --padding: 10px 30px 10px 15px;
  background: var(--background-color-r2);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

.navsubmenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;

  z-index: 101;

  --padding: 10px 30px 10px 15px;
  background: var(--background-color-r2);
}

@media screen and (max-width: 600px) {
  .navbar {
    padding: 5px 40px;
  }
}
</style>
