<template>
  <div class="options">
    <div class="control-btns">
      <Button type="filled" @click="apply">Uygula</Button>
      <Button type="bordered" href="/table">İptal</Button>
    </div>
    <div class="fields">
      <TextField
        placeholder="Sayfa başı satır sayısı"
        underlined
        v-model.number="ipp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $navigateTo } = useNuxtApp();

const ipp = ref(useDbStore().itemsPerPage);

const apply = async () => {
  if (ipp.value <= 0 || ipp.value > 1000) {
    useNotificationStore().send(
      "Sayfa başına satır sayısı 0 ile 1000 arasında olmalıdır.",
      NotificationType.ERROR
    );
    return;
  }

  useDbStore().itemsPerPage = ipp.value;
  window.localStorage.setItem("itemsPerPage", ipp.value.toString());

  useNotificationStore().send("Ayarlar uygulandı.", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.options {
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

.fields {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 20px 50px;
}
</style>
