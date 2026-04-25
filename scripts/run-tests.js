import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const env = { ...process.env };

if (!env.TEST_MONGODB_URI && env.MONGODB_URI) {
  env.TEST_MONGODB_URI = env.MONGODB_URI;
}

const command = process.platform === "win32" ? "npm.cmd" : "npm";
const child = spawn(command, ["exec", "--", "vitest", ...args], {
  stdio: "inherit",
  env,
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error("Failed to run tests:", error);
  process.exit(1);
});
