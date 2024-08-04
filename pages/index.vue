<template>
  <div>
    <div class="control-btns">
      <Button type="filled" @click="connectDb" icon="chevron_right"
        >Connect Database</Button
      >
      <Button
        type="bordered"
        @click="readExcel"
        v-if="useDbStore().connectedTo"
        icon="document_scanner"
        >Read Excel File</Button
      >
    </div>
    <div class="inner">
      <h3 v-if="useDbStore().connectedTo">
        Connected to database:
        <span class="accent">{{ useDbStore().connectedTo }}</span>
      </h3>
      <h3 v-if="Object.keys(useDbStore().tables).length > 0">Tables:</h3>
      <div class="tables">
        <Button
          type="bordered"
          v-for="table in useDbStore().tables"
          @click="selectTable(table.name)"
          >{{ table.name }}</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $NativeService, $UtilService, $navigateTo } = useNuxtApp();

const readExcel = async () => {
  const { rows, name } = await $NativeService().readExcel();

  const keys = rows[0];
  const keysClean = keys.map((key) => key.trim().replace("\n", " "));

  const list = [];

  for (let i = 0; i < keys.length; i++) {
    let integer = true;
    let float = true;

    let firstrow = true;
    for (const row of rows) {
      if (firstrow) {
        firstrow = false;
        continue;
      }
      const cell = row[i];
      console.log(cell);

      if (cell === "" || cell === undefined) continue;

      if (integer && !$UtilService().isInt(cell)) {
        integer = false;
      }
      if (float && !$UtilService().isFloat(cell)) {
        float = false;
      }
      if (!integer && !float) {
        break;
      }
    }

    let type;
    if (float) {
      type = "FLOAT";
    } else if (integer) {
      type = "INTEGER";
    } else {
      type = "VARCHAR";
    }

    list.push('"' + keysClean[i] + '" ' + type);
  }

  if (useDbStore().tables[name]) {
    await $NativeService().execDb("DROP TABLE " + name, []);
  }

  await $NativeService().execDb(
    "CREATE TABLE " + name + " (" + list.join(", ") + ")",
    []
  );

  for (let i = 1; i < rows.length; i++) {
    const qms = Array(keys.length).fill("?");
    await $NativeService().execDb(
      "INSERT INTO " + name + " VALUES (" + qms.join(", ") + ")",
      rows[i]
    );
  }

  useNotificationStore().send("Created table", NotificationType.SUCCESS);

  await useDbStore().refreshTables();
};

const connectDb = async () => {
  const dbName = await $NativeService().connectDb();
  useNotificationStore().send(
    "Connected to database!",
    NotificationType.SUCCESS
  );
  await useDbStore().refreshTables();
  useDbStore().connectedTo = dbName;
};

const selectTable = (name: string) => {
  useDbStore().selectedTableName = name;
  $navigateTo("/table");
};
</script>

<style scoped lang="scss">
.control-btns {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-bottom: 50px;
  column-gap: 20px;
}

.accent {
  color: var(--primary-color);
  margin-left: 20px;
}

.tables {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
  column-gap: 20px;
  row-gap: 20px;
}

.inner {
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
  row-gap: 30px;
}
</style>
