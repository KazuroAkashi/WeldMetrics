<template>
  <div class="notifications">
    <TransitionGroup name="notifs" tag="ul" class="notifs-group">
      <div
        class="notif-card"
        v-for="notif in useNotificationStore().buffer"
        :key="notif.id"
        :style="{
          '--notif-color': typeToColor(notif.type),
          '--notif-time': notif.ms + 'ms',
        }"
        @click="click(notif.id)"
      >
        <Icon :icon="typeToIcon(notif.type)" />
        <p>{{ notif.text }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore, NotificationType } from "~/stores/notifications";

const typename = (type: NotificationType) => {
  return type.toString().toLocaleLowerCase("en-US");
};

const typeToColor = (type: NotificationType) => {
  return "var(--" + typename(type) + "-color)";
};

const typeToIcon = (type: NotificationType) => {
  const icon = typename(type);
  if (icon === "success") return "check_circle"; // Some interjection needed
  return icon;
};

const click = (id: number) => {
  useNotificationStore().deleteFromBuffer(id);
};
</script>

<style scoped lang="scss">
.notifications {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;

  overflow: hidden;

  pointer-events: none;

  z-index: 10;
}

.notifs-group {
  width: 100%;
  height: 100%;

  direction: rtl;

  pointer-events: none;
}

.notif-card {
  position: relative;

  direction: ltr;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 9px;

  background: var(--notif-color);

  padding: 7px;
  padding-right: 11px;
  padding-bottom: 8px;
  margin: 10px 15px;

  user-select: none;
  cursor: pointer;

  pointer-events: all;

  width: fit-content;
  max-width: 25vw;

  border-radius: 5px;

  box-shadow: 0 0 6px 3px rgba(0, 0, 0, 0.6);

  overflow: hidden;

  p {
    color: var(--dark-color);
  }

  .icon {
    --icon-color: var(--dark-color);
    font-size: 24px;
  }
}

.notif-card::after {
  content: "";

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;

  background: var(--dark-color);

  transform-origin: left;

  animation: timeout var(--notif-time) linear forwards;
}

@keyframes timeout {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.notifs-move,
.notifs-enter-active,
.notifs-leave-active {
  transition: all 0.3s ease;
}
.notifs-enter-from,
.notifs-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notifs-leave-active {
  position: absolute;
}
</style>
