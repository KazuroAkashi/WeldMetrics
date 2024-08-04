<template>
  <div class="filter">
    <div class="control-btns">
      <Button type="filled" @click="filter">Apply Filter</Button>
      <Button type="bordered" href="/filter">Cancel</Button>
    </div>
    <div class="filters">
      <div class="usable">
        <h5>I am sure I know what I am doing</h5>
        <Checkbox v-model="usable" />
      </div>

      <TextField
        underlined
        placeholder="WHERE ..."
        v-if="usable"
        v-model="where"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $navigateTo } = useNuxtApp();

const usable = ref(false);
const where = ref(useDbStore().customFilter ?? "");

const filter = () => {
  if (!where.value) {
    useNotificationStore().send(
      "Cannot apply empty filter!",
      NotificationType.ERROR
    );
    return;
  }

  useDbStore().customFilter = where.value;

  useNotificationStore().send("Applied filter", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.customfilter {
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

.usable {
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 30px;
}

.filters {
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  padding: 20px 100px;
}
</style>
