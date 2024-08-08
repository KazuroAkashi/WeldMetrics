<template>
  <div class="options">
    <OptionMenu
      :options="colnames"
      v-model="orderIndex"
      :max-height="300"
      placeholder="Sütun"
    />

    <div style="display: flex; column-gap: 12px; align-items: center">
      <p>Artan</p>
      <Checkbox v-model="orderDescending" />
      <p>Azalan</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const table = useDbStore().selectedTable;
const colnames = table.cols.map((val) => val.name);

const orderIndex = defineModel<number>("index");
const orderDescending = defineModel<boolean>("desc");
</script>

<style scoped lang="scss">
.options {
  display: grid;
  justify-content: space-around;
  align-items: center;
  grid-template-columns: repeat(2, max-content);

  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
  column-gap: 20px;

  p {
    font-weight: bold;
  }
}
</style>
