<template>
  <div class="order">
    <div class="control-btns">
      <Button type="filled" @click="order">Sırala</Button>
      <Button type="bordered" href="/table">İptal</Button>
    </div>
    <div class="orders">
      <OrderField
        v-for="i in orderCount"
        v-model:index="colindex[i - 1]"
        v-model:desc="desc[i - 1]"
      />
      <div class="btns-wrapper">
        <Button
          class="removebtn"
          type="bordered"
          corners="circle"
          icon="remove"
          onlyicon
          @click="orderCount--"
          v-if="orderCount > 0"
        ></Button>
        <Button
          class="addbtn"
          type="bordered"
          corners="circle"
          icon="add"
          onlyicon
          @click="orderCount++"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $navigateTo } = useNuxtApp();

const orderCount = ref(useDbStore().orderBy.length);

const table = useDbStore().selectedTable;

const colindex_start = useDbStore().orderBy.map((order) => {
  const col = useDbStore().selectedTable.cols.find(
    (col) => col.name === order.colname
  );
  return col?.cid;
});

const desc_start = useDbStore().orderBy.map((order) => order.desc);

const colindex = ref(colindex_start);
const desc = ref(desc_start);

const order = () => {
  useDbStore().orderBy = [];

  for (let i = 0; i < orderCount.value; i++) {
    const col = table.cols[colindex.value[i]!];

    useDbStore().orderBy.push({
      colname: col.name,
      desc: desc.value[i],
    });
  }

  useNotificationStore().send("Tablo sıralandı", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.order {
  height: 100vh;
  overflow-y: scroll;

  background: #184496;
}
.control-btns {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
  column-gap: 20px;
}

.btns-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.addbtn {
  margin: 20px;
}
</style>
