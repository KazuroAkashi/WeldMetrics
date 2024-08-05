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
        "../.output/public/index.html"
      )
    );
  }

  wnd.maximize();
});

let db;

export const connect_db = async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog();

  if (canceled) throw new Error("No file was selected");

  await new Promise((resolve, reject) => {
    db = new sqlite3.Database(filePaths[0], (err) => {
      if (err) reject(err);

      db.run("PRAGMA journal_mode = 'WAL'");
      resolve();
    });
  });

  return path.basename(filePaths[0]);
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
  const { canceled, filePaths } = await dialog.showOpenDialog();

  if (canceled) throw new Error("No file was selected");

  const workbook = XLSX.read(filePaths[0], { type: "file" });
  const [firstSheetName] = workbook.SheetNames;
  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    raw: true, // Use raw values (true) or formatted strings (false)
    header: 1,
    blankrows: false,
  });

  let name = path.basename(filePaths[0]).replace(" ", "_");
  const li = name.lastIndexOf(".");
  name = name.substring(0, li);

  return {
    rows,
    name,
  };
};

const update_app = async (event) => {
  updateElectronApp(wnd);
};
