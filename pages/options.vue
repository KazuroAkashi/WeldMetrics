<template>
  <div class="options">
    <div class="control-btns">
      <Button type="filled" @click="apply">Apply</Button>
      <Button type="bordered" href="/table">Cancel</Button>
    </div>
    <div class="fields">
      <TextField placeholder="Items per page" underlined v-model.number="ipp" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $navigateTo } = useNuxtApp();

const ipp = ref(useDbStore().itemsPerPage);

const apply = async () => {
  if (ipp.value <= 0 || ipp.value > 1000) {
    useNotificationStore().send(
      "Items per page must be between 0 and 1000!",
      NotificationType.ERROR
    );
    return;
  }

  useDbStore().itemsPerPage = ipp.value;
  window.localStorage.setItem("itemsPerPage", ipp.value.toString());

  useNotificationStore().send("Applied options!", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.options {
  height: 100vh;
  overflow-y: scroll;
}

.control-btns {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
  column-gap: 20px;
}

.fields {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 20px 50px;
}
</style>
