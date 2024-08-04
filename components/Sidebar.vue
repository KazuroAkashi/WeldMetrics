<template>
  <SidebarBase :push="!useIsTouchscreen()">
    <template #header="{ toggle, open }">
      <div class="header right">
        <Button
          type="empty"
          corners="circle"
          icon="double_arrow"
          onlyicon
          @click="toggle()"
          class="sidebar-opener"
          :class="{ open }"
        ></Button>
      </div>
    </template>
    <template #body="{ select, open, isSelected, toggle }">
      <div class="body">
        <span v-for="(item, index) in buttons" :key="index">
          <!-- <VButton
              v-if="!item.divider"
              hoverfill
              listitem
              :icon="item.icon"
              @click="click(index, item, select, open, toggle)"
              :onlyicon="!open"
              :selected="
                (isSelected(index) && subSelected[1] === -1) ||
                (subSelected[0] === index && subSelected[1] !== -1)
              "
              :clickable="
                item.sub && !(subSelected[0] === index && subSelected[1] !== -1)
              "
              :href="item.href"
              :righticon="item.sub ? 'expand_more' : ''"
              style="--padding-hor: 20px"
              :class="{ subexpand: item.subopen }"
              >{{ item.title }}</VButton
            > -->
          <Button
            v-if="!item.divider"
            type="listitem"
            :icon="item.icon"
            @click="click(index, item, select, open, toggle)"
            :onlyicon="!open"
            :href="item.href"
            :righticon="item.sub ? 'expand_more' : ''"
            :class="{ subexpand: item.subopen }"
            @selected="
              (selected) => {
                if (selected) item.subopen = true;
              }
            "
            :href-selected="item.sub ? item.sub.filter(obj => obj.href).map(obj => obj.href!) : true"
            :clickable-when-selected="!!item.sub"
            >{{ item.title }}</Button
          >
          <div
            v-if="item.dividerlinetop"
            class="sidebar-divider-line"
            :class="{ open }"
          ></div>
          <div v-if="item.divider" class="sidebar-divider" :class="{ open }">
            <h2>{{ item.title }}</h2>
          </div>
          <div
            v-if="item.dividerline"
            class="sidebar-divider-line"
            :class="{ open }"
          ></div>
          <Accordion
            v-if="item.sub"
            :open="item.subopen && open"
            :style="{ '--padding': open ? '5px 50px 10px 50px' : '0 0' }"
          >
            <Button
              v-for="subitem in item.sub"
              type="link"
              :href="subitem.href"
              :icon="subitem.icon"
              href-selected
              >{{ subitem.title }}</Button
            >
          </Accordion>
        </span>
      </div>
    </template>
    <template #footer="{ open }">
      <div class="footer radius">
        <div class="radius-before"></div>
        <div class="radius-after"></div>
        <Button :onlyicon="!open" type="empty" corners="circle" icon="logout"
          >Logout</Button
        >
      </div>
    </template>

    <!-- <template #submenu>
      <SidebarBase v-for="num in [3, 4]" submenu :open="subSelected[0] === num">
        <template #header>
          <div class="header left">
            <VButton
              hoverfill
              icon="arrow_back"
              onlyicon
              round
              @click="subUnselect()"
            ></VButton>
            <div class="submenu-title">Updates</div>
          </div>
        </template>
        <template #body="{ select, isSelected }">
          <div class="body submenu">
            <VButton
              v-for="(item, index) in subbuttons[num]"
              :key="index"
              hoverfill
              textleft
              listitem
              @click="click(index, item, select)"
              :selected="isSelected(index)"
              :href="item.href"
              >{{ item.title }}</VButton
            >
          </div>
        </template>
      </SidebarBase>
    </template> -->
  </SidebarBase>
</template>

<script setup lang="ts">
// TODO: Probably a rewrite to sidebar system
const props = defineProps<{
  buttons: Partial<ListButton>[];
}>();

const buttons = ref(props.buttons);

const click = (
  index: number,
  item: Partial<ListButton>,
  selectFunc: (index: number, callback: (() => void) | undefined) => void,
  open?: boolean,
  toggle?: () => void,
) => {
  if (item.sub) {
    if (!open) {
      toggle?.();
    }

    //subSelected.value[0] = index;
    item.subopen = !item.subopen;
    return;
  }

  selectFunc(index, item.click);
};
</script>

<style scoped lang="scss">
.sidebar-divider {
  h2 {
    font-weight: 800;
    color: var(--background-color-3);
    font-size: 13px;
  }

  .animated & {
    transition: 0.3s;
  }

  max-height: 40px;
  max-width: 120px;
  opacity: 1;
  margin-top: 10px;
  margin-bottom: 10px;

  user-select: none;

  &:not(.open) {
    max-height: 0;
    max-width: 0;
    opacity: 0;
    margin: 0;
  }
}

.sidebar-divider-line {
  height: 2px;
  background: var(--background-color-2);
}

.sidebar-opener.open:deep(.icon .icon .material-icon) {
  transform: rotateZ(180deg);
}

.subexpand:deep(.righticon .righticon .material-icon) {
  transform: rotateZ(-180deg);
}

.submenu-title {
  margin-left: 15px;
  font-weight: 600;
  font-size: 1.2rem;
}

.header {
  display: flex;
  align-items: center;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  row-gap: 10px;
}

.footer {
  background: var(--background-color-2);
}

.footer.radius {
  position: relative;

  --radius: 20px;

  .radius-before {
    position: absolute;
    top: calc(var(--radius) * -2);
    right: 0;
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
    background: transparent;

    border-bottom-right-radius: var(--radius);

    box-shadow: 0 var(--radius) 0 0 var(--background-color-2);

    pointer-events: none;
  }

  .radius-after {
    position: absolute;
    top: calc(var(--radius) * -2);
    left: 0;
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
    background: transparent;

    border-bottom-left-radius: var(--radius);

    box-shadow: 0 var(--radius) 0 0 var(--background-color-2);

    pointer-events: none;
  }
}
</style>
