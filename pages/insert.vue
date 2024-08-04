<template>
  <div class="insert">
    <div class="control-btns">
      <Button type="filled" @click="insert">Insert</Button>
      <Button type="bordered" href="/table">Cancel</Button>
    </div>
    <div class="fields">
      <TextField
        v-for="col in table.cols"
        :placeholder="col.name"
        underlined
        v-model="model[col.cid]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $UtilService, $NativeService, $navigateTo } = useNuxtApp();

const table = useDbStore().selectedTable;

const model = ref([] as string[]);

const insert = async () => {
  let temp = "(?";

  for (let i = 1; i < table.cols.length; i++) {
    temp += ", ?";
  }

  temp += ")";

  const errors = [] as { field: string; err: string }[];

  const values = model.value.map((val, index) => {
    return $UtilService().parseValue(val, table.cols[index], errors);
  });

  if (values.every((val) => !val)) {
    useNotificationStore().send(
      "You should not add empty rows!",
      NotificationType.ERROR
    );
    return;
  }

  if (errors.length > 0) {
    for (let e of errors) {
      if (e.err === "int")
        useNotificationStore().send(
          "Value of " + e.field + " must be an integer!",
          NotificationType.ERROR
        );
      else if (e.err === "float")
        useNotificationStore().send(
          "Value of " + e.field + " must be a float!",
          NotificationType.ERROR
        );
      else
        useNotificationStore().send(
          "Value of " + e.field + " is ill-formatted!",
          NotificationType.ERROR
        );
    }
    return;
  }

  await $NativeService().execDb(
    "INSERT INTO " + table.name + " VALUES " + temp,
    values
  );

  useNotificationStore().send("Inserted row!", NotificationType.SUCCESS);

  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.insert {
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
