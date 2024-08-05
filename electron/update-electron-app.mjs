/*
MIT License

Copyright (c) 2018 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
This code is taken from https://github.com/electron/update-electron-app and modified.
*/

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

export function updateElectronApp(wnd, opts = {}) {
  // check for bad input early, so it will be logged during development
  const safeOpts = validateInput(opts);

  // don't attempt to update during development
  if (!electron.app.isPackaged) {
    const message =
      "update-electron-app config looks good; aborting updates since app is in development mode";
    opts.logger ? opts.logger.log(message) : console.log(message);
    return;
  }

  if (electron.app.isReady()) initUpdater(wnd, safeOpts);
  else electron.app.on("ready", () => initUpdater(wnd, safeOpts));
}

function initUpdater(wnd, opts) {
  const { updateSource, updateInterval, logger } = opts;

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
    const dialogOpts = {
      type: "error",
      buttons: ["Ok"],
      title: "Application Update",
      message: "An error occured while updating:",
      detail: err,
    };

    dialog.showMessageBox(dialogOpts).then(() => {
      wnd.setProgressBar(0, {
        mode: "none",
      });
    });

    wnd.setProgressBar(1, {
      mode: "error",
    });
  });

  autoUpdater.on("checking-for-update", () => {
    log("checking-for-update");
  });

  autoUpdater.on("update-available", () => {
    const dialogOpts = {
      type: "info",
      buttons: ["Ok"],
      title: "Application Update",
      message: "A new version was found. Downloading...",
    };

    dialog.showMessageBox(dialogOpts);

    wnd.setProgressBar(0, {
      mode: "indeterminate",
    });
  });

  autoUpdater.on("update-not-available", () => {
    const dialogOpts = {
      type: "info",
      buttons: ["Ok"],
      title: "Application Update",
      message: "Your application is up to date.",
    };

    dialog.showMessageBox(dialogOpts);
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
          buttons: ["Restart Now", "Later"],
          title: "Application Update",
          message: process.platform === "win32" ? releaseNotes : releaseName,
          detail:
            "A new version has been downloaded. Restart the application to apply the updates.",
        };

        dialog.showMessageBox(dialogOpts).then(({ response }) => {
          wnd.setProgressBar(0, {
            mode: "none",
          });
          if (response === 0) autoUpdater.quitAndInstall();
        });

        wnd.setProgressBar(100, {
          mode: "normal",
        });
      }
    );
  }

  // check for updates right away
  autoUpdater.checkForUpdates();
}

function guessRepo() {
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

  let updateSource = opts.updateSource;
  // Handle migration from old properties + default to update service
  if (!updateSource) {
    updateSource = {
      repo: opts.repo || guessRepo(),
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
    notifyUser,
  };
}
