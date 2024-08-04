<template>
  <div class="page">
    <div class="page-inner">
      <h1 class="touch">Touchscreen</h1>
      <div style="display: flex; column-gap: 12px; align-items: center">
        <p>Animations</p>
        <Checkbox v-model="anims" />
      </div>
      <div style="display: flex; column-gap: 12px; align-items: center">
        <p>Dark Mode</p>
        <Checkbox v-model="darkmode" />
      </div>

      <div class="button-grid">
        <Button type="filled">Filled Button</Button>
        <Button type="bordered">Bordered Button</Button>
        <Button type="empty">Empty Button</Button>
        <Button type="link">Link Button</Button>

        <Button type="filled" leftalign>Filled Button</Button>
        <Button type="bordered" leftalign>Bordered Button</Button>
        <Button type="empty" leftalign>Empty Button</Button>
        <Button type="link" leftalign>Link Button</Button>

        <Button type="filled" leftalign righticon="home">Filled Button</Button>
        <Button type="bordered" leftalign righticon="home"
          >Bordered Button</Button
        >
        <Button type="empty" leftalign righticon="home">Empty Button</Button>
        <Button type="link" leftalign righticon="home">Link Button</Button>

        <Button type="filled" icon="home">Filled Button</Button>
        <Button type="bordered" icon="home">Bordered Button</Button>
        <Button type="empty" icon="home">Empty Button</Button>
        <Button type="link" icon="home">Link Button</Button>

        <Button type="filled" righticon="home">Filled Button</Button>
        <Button type="bordered" righticon="home">Bordered Button</Button>
        <Button type="empty" righticon="home">Empty Button</Button>
        <Button type="link" righticon="home">Link Button</Button>

        <Button type="filled" corners="circle">Filled Button</Button>
        <Button type="bordered" corners="circle">Bordered Button</Button>
        <Button type="empty" corners="circle">Empty Button</Button>
        <Button type="link" corners="circle">Link Button</Button>

        <Button type="filled" icon="home" corners="circle"
          >Filled Button</Button
        >
        <Button type="bordered" icon="home" corners="circle"
          >Bordered Button</Button
        >
        <Button type="empty" icon="home" corners="circle">Empty Button</Button>
        <Button type="link" icon="home" corners="circle">Link Button</Button>

        <Button type="filled" corners="hard">Filled Button</Button>
        <Button type="bordered" corners="hard">Bordered Button</Button>
        <Button type="empty" corners="hard">Empty Button</Button>
        <Button type="link" corners="hard" hover-underline
          >Link Button Under</Button
        >

        <Button type="filled" icon="home" corners="hard">Filled Button</Button>
        <Button type="bordered" icon="home" corners="hard"
          >Bordered Button</Button
        >
        <Button type="empty" icon="home" corners="hard">Empty Button</Button>
        <Button type="link" icon="home" corners="hard">Link Button</Button>

        <Button type="filled" icon="home" corners="circle" onlyicon></Button>
        <Button type="bordered" icon="home" corners="circle" onlyicon></Button>
        <Button type="empty" icon="home" corners="circle" onlyicon></Button>
        <Button type="link" icon="home" corners="circle" onlyicon></Button>

        <Button style="--accent-hover: orange" type="link" icon="fa-instagram"
          >Instagram</Button
        >
        <Button style="--accent-hover: red" type="link" icon="fa-youtube"
          >Youtube</Button
        >
        <Button type="link" icon="fa-x-twitter">Twitter (X)</Button>
        <Button style="--accent-hover: lime" type="link" icon="fa-whatsapp"
          >WhatsApp</Button
        >
      </div>
      <ClientOnly>
        <Button
          :type="btnTypes[btnType]"
          :corners="btnCornerss[btnCorners]"
          :icon="btnIcon"
          :righticon="btnRightIcon"
          :onlyicon="btnOnlyIcon"
          :leftalign="btnLeftAlign"
          >{{ btnText }}</Button
        >
        <OptionMenu
          :options="btnTypeOptions"
          placeholder="Select Button Type"
          v-model="btnType"
        />
        <OptionMenu
          :options="btnCornerOptions"
          placeholder="Select Corner Type"
          v-model="btnCorners"
        />
        <div style="display: flex; column-gap: 12px; align-items: center">
          <p>Only icon</p>
          <Checkbox v-model="btnOnlyIcon" />
        </div>
        <div style="display: flex; column-gap: 12px; align-items: center">
          <p>Left align</p>
          <Checkbox v-model="btnLeftAlign" />
        </div>
        <TextField
          icon="edit"
          v-model="btnText"
          placeholder="Button Text"
          underlined
        />
        <TextField
          underlined
          icon="insert_emoticon"
          v-model="btnIcon"
          placeholder="Button Icon"
        />
        <TextField
          underlined
          icon="insert_emoticon"
          v-model="btnRightIcon"
          placeholder="Button Right Icon"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const btnTypeOptions = ["Filled", "Bordered", "Empty", "Link"];
const btnTypes = ["filled", "bordered", "empty", "link"] as const;
const btnCornerOptions = ["Hard", "Round", "Circle"];
const btnCornerss = ["hard", "round", "circle"] as const;

const anims = ref(useAnimatedStore().animated);
const darkmode = ref(useDarkthemeStore().darktheme);

watch(anims, (val) => {
  useAnimatedStore().animated = val;
});
watch(darkmode, (val) => {
  useDarkthemeStore().darktheme = val;
});

const btnType = usePersistentRef("btnType", 1);
const btnCorners = usePersistentRef("btnCorners", 2);
const btnText = usePersistentRef("btnText", "Option Button");
const btnIcon = usePersistentRef("btnIcon", "fa-instagram");
const btnRightIcon = usePersistentRef("btnRightIcon", "expand_more");
const btnOnlyIcon = usePersistentRef("btnOnlyIcon", false);
const btnLeftAlign = usePersistentRef("btnLeftAlign", false);
</script>

<style scoped lang="scss">
.touch {
  .touchscreen & {
    color: lime;
  }

  body:not(.touchscreen) & {
    color: red;
  }
}

.page-inner {
  margin-top: 50px;
  margin-bottom: 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  row-gap: 10px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  row-gap: 20px;
  column-gap: 20px;
}

@media screen and (max-width: 600px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>
