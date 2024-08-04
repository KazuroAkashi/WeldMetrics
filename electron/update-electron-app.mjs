import assert from "assert";
import isURL from "is-url";
import ms from "ms";
import gh from "github-url-to-object";
import path from "path";
import fs from "fs";
import url from "url";
import os from "os";
import { format } from "util";

import electron from "electron";

const pkg = JSON.parse(
  fs
    .readFileSync(
      path.join(
        path.dirname(url.fileURLToPath(import.meta.url)),
        "../package.json"
      )
    )
    .toString()
);
const userAgent = format(
  "%s/%s (%s: %s)",
  pkg.name,
  pkg.version,
  os.platform(),
  os.arch()
);
const supportedPlatforms = ["darwin", "win32"];

export function updateElectronApp(opts = {}) {
  // check for bad input early, so it will be logged during development
  const safeOpts = validateInput(opts);

  // don't attempt to update during development
  if (!electron.app.isPackaged) {
    const message =
      "update-electron-app config looks good; aborting updates since app is in development mode";
    opts.logger ? opts.logger.log(message) : console.log(message);
    return;
  }

  if (safeOpts.electron.app.isReady()) initUpdater(safeOpts);
  else electron.app.on("ready", () => initUpdater(safeOpts));
}

function initUpdater(opts) {
  const { updateSource, updateInterval, logger, electron } = opts;

  // exit early on unsupported platforms, e.g. `linux`
  if (!supportedPlatforms.includes(process?.platform)) {
    log(
      `Electron's autoUpdater does not support the '${process.platform}' platform. Ref: https://www.electronjs.org/docs/latest/api/auto-updater#platform-notices`
    );
    return;
  }

  const { app, autoUpdater, dialog } = electron;
  let feedURL;
  let serverType = "default";
  feedURL = `${updateSource.host}/${updateSource.repo}/${process.platform}-${
    process.arch
  }/${app.getVersion()}`;

  const requestHeaders = { "User-Agent": userAgent };

  function log(...args) {
    logger.log(...args);
  }

  log("feedURL", feedURL);
  log("requestHeaders", requestHeaders);
  autoUpdater.setFeedURL({
    url: feedURL,
    headers: requestHeaders,
    serverType,
  });

  autoUpdater.on("error", (err) => {
    log("updater error");
    log(err);
  });

  autoUpdater.on("checking-for-update", () => {
    log("checking-for-update");
  });

  autoUpdater.on("update-available", () => {
    log("update-available; downloading...");
  });

  autoUpdater.on("update-not-available", () => {
    log("update-not-available");
  });

  if (opts.notifyUser) {
    autoUpdater.on(
      "update-downloaded",
      (event, releaseNotes, releaseName, releaseDate, updateURL) => {
        log("update-downloaded", [
          event,
          releaseNotes,
          releaseName,
          releaseDate,
          updateURL,
        ]);

        const dialogOpts = {
          type: "info",
          buttons: ["Restart", "Later"],
          title: "Application Update",
          message: process.platform === "win32" ? releaseNotes : releaseName,
          detail:
            "A new version has been downloaded. Restart the application to apply the updates.",
        };

        dialog.showMessageBox(dialogOpts).then(({ response }) => {
          if (response === 0) autoUpdater.quitAndInstall();
        });
      }
    );
  }

  // check for updates right away and keep checking later
  autoUpdater.checkForUpdates();
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, ms(updateInterval));
}

function guessRepo(electron) {
  const pkgBuf = fs.readFileSync(
    path.join(electron.app.getAppPath(), "package.json")
  );
  const pkg = JSON.parse(pkgBuf.toString());
  const repoString = pkg.repository?.url || pkg.repository;
  const repoObject = gh(repoString);
  assert(
    repoObject,
    "repo not found. Add repository string to your app's package.json file"
  );
  return `${repoObject.user}/${repoObject.repo}`;
}

function validateInput(opts) {
  const defaults = {
    host: "https://update.electronjs.org",
    updateInterval: "10 minutes",
    logger: console,
    notifyUser: true,
  };
  const { host, updateInterval, logger, notifyUser } = Object.assign(
    {},
    defaults,
    opts
  );

  // allows electron to be mocked in tests
  const electronMock = opts.electron || electron;

  let updateSource = opts.updateSource;
  // Handle migration from old properties + default to update service
  if (!updateSource) {
    updateSource = {
      repo: opts.repo || guessRepo(electronMock),
      host,
    };
  }

  assert(
    updateSource.repo?.includes("/"),
    "repo is required and should be in the format `owner/repo`"
  );

  assert(
    updateSource.host &&
      isURL(updateSource.host) &&
      updateSource.host.startsWith("https:"),
    "host must be a valid HTTPS URL"
  );

  assert(
    typeof updateInterval === "string" && updateInterval.match(/^\d+/),
    "updateInterval must be a human-friendly string interval like `20 minutes`"
  );

  assert(
    ms(updateInterval) >= 5 * 60 * 1000,
    "updateInterval must be `5 minutes` or more"
  );

  assert(logger && typeof logger.log, "function");

  return {
    updateSource,
    updateInterval,
    logger,
    electron: electronMock,
    notifyUser,
  };
}
