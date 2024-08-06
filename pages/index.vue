<template>
  <div class="index">
    <div class="index-bg" v-if="false">
      <img src="/cool.jpg" />
    </div>
    <div class="control-btns">
      <Button type="bordered" @click="updateApp" icon="update"
        >Check and Install Updates</Button
      >
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

onMounted(async () => {
  if (useDbStore().checkedLastDb) return;
  useDbStore().checkedLastDb = true;

  const lastConnected = window.localStorage.getItem("last-connected-db");

  if (lastConnected) {
    if (await $NativeService().fileExists(lastConnected)) {
      const response = await $NativeService().askApprove({
        title: "Last Database",
        message: "Would you like to connect to the last database?",
        detail: "Database path: " + lastConnected,
        buttons: ["Yes", "No"],
      });

      if (response === 0) {
        connectDb(lastConnected);
      }
    }
  }
});

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
    if (integer) {
      type = "INTEGER";
    } else if (float) {
      type = "FLOAT";
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

  const contentRows = [];

  // rows.shift() raised a type error, so I did it the old-fashioned way
  for (let i = 1; i < rows.length; i++) {
    contentRows[i - 1] = rows[i];
  }

  const qms = Array(keys.length).fill("?");
  await $NativeService().execMultiDb(
    "INSERT INTO " + name + " VALUES (" + qms.join(", ") + ")",
    contentRows
  );

  useNotificationStore().send("Created table", NotificationType.SUCCESS);

  await useDbStore().refreshTables();
};

const connectDb = async (dbPath?: string) => {
  const { dbName, path } = await $NativeService().connectDb(dbPath);
  useNotificationStore().send(
    "Connected to database!",
    NotificationType.SUCCESS
  );
  await useDbStore().refreshTables();
  useDbStore().connectedTo = dbName;

  window.localStorage.setItem("last-connected-db", path);
};

const selectTable = (name: string) => {
  useDbStore().selectedTableName = name;
  $navigateTo("/table");
};

const updateApp = async () => {
  await $NativeService().updateApp();
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

.index {
  position: relative;
  height: 100vh;
}

.index-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 1400px;
    filter: blur(2px) opacity(0.4);
    border-radius: 100px;
  }
}
</style>
