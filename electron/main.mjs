import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import url from "node:url";
import sqlite3 from "sqlite3";
import * as util from "./util.mjs";
import * as XLSX from "xlsx";

import ess from "electron-squirrel-startup";

import { updateElectronApp } from "./update-electron-app.mjs";

/* load 'fs' for readFile and writeFile support */
import * as fs from "fs";
XLSX.set_fs(fs);

if (ess) app.quit();

let wnd;

app.whenReady().then(() => {
  ipcMain.handle("connect-db", connect_db);
  ipcMain.handle("list-tables-db", list_tables_db);
  ipcMain.handle("query-db", query_db);
  ipcMain.handle("exec-db", exec_db);
  ipcMain.handle("exec-multi-db", exec_multi_db);
  ipcMain.handle("read-excel", read_excel);
  ipcMain.handle("update-app", update_app);
  ipcMain.handle("file-exists", file_exists);
  ipcMain.handle("ask-approve", ask_approve);
  ipcMain.handle("ask-save", ask_save);
  ipcMain.handle("export-to-excel", export_to_excel);

  wnd = new BrowserWindow({
    webPreferences: {
      preload: path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "preload.js"
      ),
    },
    autoHideMenuBar: true,
    icon: path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      ".generated/public/favicon.ico"
    ),
  });

  if (!app.isPackaged) wnd.loadURL(process.env.VITE_DEV_SERVER_URL);
  else {
    wnd.loadFile(
      path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "../electron/.generated/public/index.html"
      )
    );
  }

  wnd.maximize();
});

let db;

export const connect_db = async (event, dbPath) => {
  if (!dbPath) {
    const { canceled, filePaths } = await dialog.showOpenDialog();

    if (canceled) throw new Error("No file was selected");

    dbPath = filePaths[0];
  }
  await new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);

      db.run("PRAGMA journal_mode = 'WAL'");
      resolve();
    });
  });

  return { dbName: path.basename(dbPath), path: dbPath };
};

export const list_tables_db = async (event) => {
  if (!db) {
    throw new Error("Database is not connected!");
  }
  const tables = {};

  await util.each(
    db,
    "SELECT * FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    [],
    (trow) => {
      tables[trow.name] = trow;
    }
  );

  for (let table of Object.values(tables)) {
    table.cols = [];
    await util.each(db, "PRAGMA table_info(" + table.name + ")", [], (col) =>
      table.cols.push(col)
    );
  }

  return tables;
};

const query_db = async (event, sql, params) => {
  const rows = [];
  await util.each(db, sql, params, (row) => rows.push(row));
  return rows;
};

const exec_db = async (event, sql, params) => {
  await util.run(db, sql, params);
};

const exec_multi_db = async (event, sql, paramsList) => {
  await util.run_multi(db, sql, paramsList);
};

const read_excel = async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(wnd, {
    properties: ["openFile", "multiSelections"],
  });

  if (canceled) throw new Error("No file was selected");

  const ret = [];

  for (const filePath of filePaths) {
    const workbook = XLSX.read(filePath, { type: "file" });
    const [firstSheetName] = workbook.SheetNames;
    const worksheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      raw: true, // Use raw values (true) or formatted strings (false)
      header: 1,
      blankrows: false,
    });

    let name = path.basename(filePath).replace(" ", "_");
    const li = name.lastIndexOf(".");
    name = name.substring(0, li);

    ret.push({ rows, name });
  }

  return ret;
};

const update_app = async (event) => {
  updateElectronApp(wnd);
};

const file_exists = async (event, path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) reject(err);

      resolve(stat.isFile());
    });
  });
};

const ask_approve = async (event, { title, message, detail, buttons }) => {
  const dialogOpts = {
    type: "info",
    buttons,
    title,
    message,
    detail,
    cancelId: 1,
  };

  return new Promise((resolve, reject) => {
    dialog.showMessageBox(wnd, dialogOpts).then(({ response }) => {
      resolve(response);
    });
  });
};

const ask_save = async (event) => {
  return dialog.showOpenDialog(wnd, {
    properties: ["openDirectory"],
  });
};

const export_to_excel = async (event, filepath, data) => {
  const sheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet);

  XLSX.writeFile(workbook, filepath);
};
