<template>
  <div class="layout">
    <Notifications />
    <Sidebar :buttons="buttons" v-show="!useIsMobile()" />
    <div class="inner">
      <Navbar :buttons="navbuttons" search v-model:nav-height="navHeight" />

      <div class="content" :style="{ '--push-top': navHeight + 'px' }">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navbuttons = ref([
  {
    title: 'About Us',
    href: '/',
  },
  {
    title: 'Projects',
    href: '/price',
  },
  {
    title: 'Contacts',
    sub: [
      {
        title: 'Email',
      },
      {
        title: 'Linkedin',
        href: '/sometest',
      },
      {
        title: 'Phone',
      },
    ],
  },
]) as Ref<ListButton[]>;

const buttons = ref([
  {
    divider: true,
    title: 'MENU',
  },
  {
    title: 'Home Page',
    icon: 'home',
    href: '/',
  },
  {
    title: 'Users',
    icon: 'search',
    sub: [
      {
        title: 'List',
      },
      {
        title: 'Edit',
      },
    ],
  },
  {
    title: 'Announcements',
    icon: 'campaign',
    sub: [
      {
        title: 'List',
        href: '/sometest',
      },
      {
        title: 'Add',
      },
      {
        title: 'Delete',
      },
    ],
  },
  {
    title: 'Inventory',
    icon: 'inventory_2',
  },
  {
    dividerlinetop: true,
    divider: true,
    title: 'OTHERS',
  },
  {
    title: 'Analytics',
    icon: 'show_chart',
  },
  {
    title: 'Budget',
    icon: 'wallet',
    href: '/price',
  },
  {
    title: 'Admins',
    icon: 'group',
  },
] as Partial<ListButton>[]);

const navHeight = ref(1);
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  height: 100vh;
}

.inner {
  flex: 1;
  overflow: hidden;
}

.content :deep(.page) {
  max-height: calc(100vh - var(--push-top));
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
