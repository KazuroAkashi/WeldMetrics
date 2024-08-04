import cp from "child_process";

export function publish_patch(cb) {
  publish(cb, "patch");
}
export function publish_minor(cb) {
  publish(cb, "minor");
}
export function publish_major(cb) {
  publish(cb, "major");
}

function publish(cb, ver) {
  cp.execSync("npm version " + ver + " --sign-git-tag");
  cp.execSync("git push origin main --tags");
  cb();
}
