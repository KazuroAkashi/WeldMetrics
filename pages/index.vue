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
          >Güncellemeleri Kontrol Et</Button
        >
        <Button
          type="filled"
          corners="circle"
          @click="connectDb"
          icon="chevron_right"
          >Veritabanına Bağlan</Button
        >
        <Button
          type="filled"
          corners="circle"
          @click="readExcel"
          v-if="useDbStore().connectedTo"
          icon="document_scanner"
          >Excel Dosyasından Çek</Button
        >
      </div>
    </div>
    <div class="inner">
      <h3 v-if="useDbStore().connectedTo">
        Kullanılan veritabanı:
        <span class="accent">{{ useDbStore().connectedTo }}</span>
      </h3>
      <h2
        v-if="Object.keys(useDbStore().tables).length > 0"
        class="tables-title"
      >
        Tablolar
      </h2>
      <h4 v-if="loadingTables" class="tables-loading">Yükleniyor...</h4>
      <div class="tables" v-if="!loadingTables">
        <div class="search-wrapper">
          <TextField
            placeholder="Tablo ara"
            v-model="searchTable"
            round
            icon="search"
            class="search-table"
          />
          <Button
            type="empty"
            corners="circle"
            onlyicon
            icon="close"
            class="delete-search-btn"
            v-if="searchTable.length > 0"
            @click="deleteSearch"
          ></Button>
        </div>
        <TransitionGroup name="vert-btns" appear>
          <div
            class="table-btn-wrapper"
            v-for="(table, index) in Object.values(useDbStore().tables).filter(
              (table) =>
                table.name.toLowerCase().includes(searchTable.toLowerCase())
            )"
            :key="index"
          >
            <Button
              type="filled"
              corners="circle"
              @click="selectTable(table.name)"
              :style="{ 'transition-delay': index * 0.1 + 's' }"
              class="table-btn"
              >{{ table.name }}</Button
            >
            <Button
              type="empty"
              corners="circle"
              onlyicon
              icon="delete"
              class="delete-btn"
              @click="deleteTable(table.name)"
            ></Button>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $NativeService, $UtilService, $navigateTo } = useNuxtApp();

const searchTable = ref("");
const loadingTables = ref(false);

onMounted(async () => {
  if (useDbStore().checkedLastDb) return;
  useDbStore().checkedLastDb = true;

  const lastConnected = window.localStorage.getItem("last-connected-db");

  if (lastConnected) {
    if (await $NativeService().fileExists(lastConnected)) {
      const response = await $NativeService().askApprove({
        title: "Son Veritabanı",
        message:
          "Son bağlandığınız veritabanına tekrar bağlanmak ister misiniz?",
        detail: "Veritabanı yolu: " + lastConnected,
        buttons: ["Evet", "Hayır"],
      });

      if (response === 0) {
        connectDb(lastConnected);
      }
    }
  }
});

const readExcel = async () => {
  const tables = await $NativeService().readExcel();

  loadingTables.value = true;

  useNotificationStore().send(
    "Tablolar yükleniyor. Lütfen bekleyiniz.",
    NotificationType.INFO
  );

  for (const table of tables) {
    const { rows, name } = table;

    try {
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
        await $NativeService().execDb("DROP TABLE " + name);
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
    } catch (err) {
      useNotificationStore().send(
        "Tablo yüklenirken bir hata oluştu: " + name,
        NotificationType.ERROR
      );
      console.error(err);
      continue;
    }

    useNotificationStore().send(
      "Tablo oluşturuldu: " + name,
      NotificationType.SUCCESS
    );
  }
  await useDbStore().refreshTables();
  loadingTables.value = false;
};

const connectDb = async (dbPath?: string) => {
  const { dbName, path } = await $NativeService().connectDb(dbPath);
  useNotificationStore().send(
    "Veritabanına bağlanıldı.",
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

const deleteTable = async (name: string) => {
  const res = await $NativeService().askApprove({
    title: "Tablo Siliniyor",
    message: name + " tablosunu silmek istediğinize emin misiniz?",
    detail: "Bu işlemi geri almak mümkün olmayacaktır.",
    buttons: ["Evet, tabloyu sil.", "Geri dön"],
  });

  if (res === 0) {
    await $NativeService().execDb("DROP TABLE " + name);
    await useDbStore().refreshTables();
    useNotificationStore().send(
      name + " tablosu başarıyla silindi.",
      NotificationType.SUCCESS
    );
  }
};

const deleteSearch = () => {
  searchTable.value = "";
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

.search-table:not(.increase) {
  --fg-color: #184496;
  --placeholder-color: #184496;
  --hover-color: #184496;
}

.tables {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  column-gap: 20px;
  row-gap: 20px;
}

.table-btn-wrapper,
.search-wrapper {
  position: relative;
}

.table-btn {
  --padding-hor: 100px;
}

.delete-btn,
.delete-search-btn {
  position: absolute;

  top: 0;
  right: -64px;

  --accent-color: var(--error-color);
  --accent-hover: var(--error-color);
  &:deep(.icon) {
    --icon-color: var(--error-color);
  }
}
</style>
