<template>
  <div class="index">
    <div class="index-bg" v-if="false">
      <img src="/cool.jpg" />
    </div>
    <div class="index-logo">
      <img src="/weldmetrics.png" />
    </div>
    <div class="control-btns-outer">
      <div class="control-btns">
        <Button type="filled" corners="circle" @click="updateApp" icon="update"
          >Check and Install Updates</Button
        >
        <Button
          type="filled"
          corners="circle"
          @click="connectDb"
          icon="chevron_right"
          >Connect Database</Button
        >
        <Button
          type="filled"
          corners="circle"
          @click="readExcel"
          v-if="useDbStore().connectedTo"
          icon="document_scanner"
          >Read Excel File</Button
        >
      </div>
    </div>
    <div class="inner">
      <h3 v-if="useDbStore().connectedTo">
        Connected to database:
        <span class="accent">{{ useDbStore().connectedTo }}</span>
      </h3>
      <h2
        v-if="Object.keys(useDbStore().tables).length > 0"
        class="tables-title"
      >
        Tables
      </h2>
      <div class="tables">
        <TransitionGroup name="vert-btns" appear>
          <Button
            type="filled"
            corners="circle"
            v-for="(table, index) in Object.values(useDbStore().tables)"
            @click="selectTable(table.name)"
            :key="index"
            :style="{ 'transition-delay': index * 0.1 + 's' }"
            >{{ table.name }}</Button
          >
        </TransitionGroup>
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
.index {
  background: #184496;
  position: relative;
  height: 100vh;

  overflow-y: scroll;
}

.index-logo {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 256px;
  }
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

.control-btns-outer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.control-btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 20px;
  padding-bottom: 30px;
  column-gap: 20px;
  row-gap: 20px;

  * {
    --accent-color: var(--light-color);
    --accent-hover: var(--light-color-2);
    --padding-hor: 100px;
  }
}
.inner {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px 60px;
  row-gap: 30px;
}

.accent {
  color: var(--primary-color);
  margin-left: 20px;
}

.tables-title {
  text-decoration: underline;
}

.tables {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  column-gap: 20px;
  row-gap: 20px;

  * {
    --accent-color: var(--light-color);
    --accent-hover: var(--light-color-2);
    --padding-hor: 100px;
  }
}
</style>
