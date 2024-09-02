<template>
  <div class="filter">
    <div class="control-btns">
      <Button type="filled" @click="filter" icon="filter_alt">Filtrele</Button>
      <Button type="bordered" href="/filter" icon="close">İptal</Button>
    </div>
    <div class="filters">
      <div class="usable">
        <h5>Ne yaptığımı gayet iyi biliyorum</h5>
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
const where = ref(useDbStore().selectedTableOptions.customFilter ?? "");

const filter = () => {
  if (!where.value) {
    useNotificationStore().send(
      "Cannot apply empty filter!",
      NotificationType.ERROR
    );
    return;
  }

  useDbStore().selectedTableOptions.customFilter = where.value;

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
