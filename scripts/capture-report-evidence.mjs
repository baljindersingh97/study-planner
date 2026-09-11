import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const evidence = path.join(root, "report_evidence");
const screenshots = path.join(evidence, "screenshots");
const raw = path.join(evidence, "raw-results");
mkdirSync(screenshots, { recursive: true });
mkdirSync(raw, { recursive: true });

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const runEnv = { ...process.env };
delete runEnv.NO_COLOR;
delete runEnv.FORCE_COLOR;

function run(args) {
  const result = spawnSync(npm, args, {
    cwd: root,
    encoding: "utf8",
    env: runEnv,
    shell: process.platform === "win32",
  });
  const command = `npm ${args.join(" ")}`;
  const output =
    `${result.stdout ?? ""}${result.stderr ?? ""}${result.error?.message ?? ""}`.trim();
  return { command, exitCode: result.status ?? 1, output };
}

function stripAnsi(value) {
  return value.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d/#&.:=?%@~_]+)*)?\u0007)|(?:(?:\d{1,4}(?:[;:]\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g,
    "",
  );
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cleanForDisplay(value) {
  return stripAnsi(value)
    .split("\n")
    .filter(
      (line) =>
        !line.includes("NO_COLOR") && !line.includes("node --trace-warnings"),
    )
    .join("\n")
    .trim();
}

function terminalPage(title, result) {
  const status = result.exitCode === 0 ? "PASS" : "FAIL";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 64px; background: #f3efe6; color: #18241d; font-family: "Segoe UI", Arial, sans-serif; }
  header { display: flex; justify-content: space-between; align-items: end; margin-bottom: 28px; }
  h1 { margin: 0; font: 700 42px Georgia, serif; color: #183d2e; }
  p { margin: 8px 0 0; color: #5f6d64; font-size: 17px; }
  .badge { border-radius: 999px; padding: 10px 18px; color: white; background: ${result.exitCode === 0 ? "#24563d" : "#9b352c"}; font-weight: 700; letter-spacing: .08em; }
  .terminal { overflow: hidden; border: 1px solid #39463e; border-radius: 14px; background: #111915; box-shadow: 0 16px 45px rgba(20, 36, 27, .18); }
  .terminal-bar { display: flex; gap: 9px; padding: 14px 18px; background: #26332b; }
  .dot { width: 12px; height: 12px; border-radius: 50%; background: #cfaa5a; }
  pre { margin: 0; padding: 28px; white-space: pre-wrap; color: #e8eee9; font: 15px/1.55 Consolas, "Courier New", monospace; }
  .command { color: #f1ce7c; }
</style>
</head>
<body>
  <header>
    <div><h1>${title}</h1><p>Verified locally on 10 September 2026</p></div>
    <div class="badge">${status} · EXIT ${result.exitCode}</div>
  </header>
  <section class="terminal">
    <div class="terminal-bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <pre><span class="command">PS&gt; ${escapeHtml(result.command)}</span>\n\n${escapeHtml(cleanForDisplay(result.output))}</pre>
  </section>
</body>
</html>`;
}

function saveResult(name, title, result) {
  writeFileSync(
    path.join(raw, `${name}.txt`),
    `${result.command}\n\n${stripAnsi(result.output)}\n`,
  );
  writeFileSync(path.join(raw, `${name}.html`), terminalPage(title, result));
}

const unit = run(["test"]);
const e2e = run(["run", "test:e2e", "--", "--reporter=line"]);
const coverage = run(["run", "test:coverage"]);
const staticRuns = [
  run(["run", "typecheck"]),
  run(["run", "lint"]),
  run(["run", "format:check"]),
  run(["run", "build"]),
  run(["audit"]),
];
const staticResult = {
  command:
    "npm run typecheck; npm run lint; npm run format:check; npm run build; npm audit",
  exitCode: Math.max(...staticRuns.map((result) => result.exitCode)),
  output: staticRuns
    .map((result) => `$ ${result.command}\n${result.output}`)
    .join("\n\n"),
};

saveResult("unit-integration-results", "Unit and integration tests", unit);
saveResult("e2e-results", "End-to-end tests", e2e);
saveResult("coverage-results", "Automated test coverage", coverage);
saveResult(
  "static-analysis-results",
  "Static analysis and build",
  staticResult,
);

writeFileSync(
  path.join(raw, "command-status.json"),
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      unitAndIntegration: { command: unit.command, exitCode: unit.exitCode },
      e2e: { command: e2e.command, exitCode: e2e.exitCode },
      coverage: { command: coverage.command, exitCode: coverage.exitCode },
      staticAnalysis: {
        command: staticResult.command,
        exitCode: staticResult.exitCode,
      },
    },
    null,
    2,
  ),
);

function dateFromToday(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function task(id, title, subject, days, priority, minutes, completed = false) {
  return {
    id,
    title,
    subject,
    dueDate: dateFromToday(days),
    priority,
    estimatedMinutes: minutes,
    completed,
    createdAt: new Date().toISOString(),
  };
}

const mainTasks = [
  task(
    "evidence-a",
    "Software Testing Report",
    "Software Testing",
    2,
    "high",
    120,
  ),
  task(
    "evidence-b",
    "Read Chapters 5 and 6",
    "Data Structures",
    5,
    "medium",
    60,
  ),
  task("evidence-c", "Practice Algebra", "Mathematics", 1, "low", 45, true),
];

const browser = await chromium.launch();

for (const file of [
  "unit-integration-results",
  "e2e-results",
  "coverage-results",
  "static-analysis-results",
]) {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 900 },
  });
  await page.goto(pathToFileURL(path.join(raw, `${file}.html`)).href);
  await page.screenshot({
    path: path.join(screenshots, `${file}.png`),
    fullPage: true,
  });
  await page.close();
}

for (const name of ["architecture-diagram", "coverage-chart"]) {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
  });
  await page.goto(
    pathToFileURL(path.join(evidence, "visualizations", `${name}.svg`)).href,
  );
  await page.screenshot({
    path: path.join(evidence, "visualizations", `${name}.png`),
  });
  await page.close();
}

const dist = path.join(root, "dist");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};
const appServer = createServer((request, response) => {
  const requested = decodeURIComponent(
    new URL(request.url ?? "/", "http://localhost").pathname,
  ).replace(/^\/+/, "");
  const filePath = path.join(dist, requested || "index.html");

  try {
    const body = readFileSync(filePath);
    response.writeHead(200, {
      "Content-Type":
        contentTypes[path.extname(filePath)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(200, { "Content-Type": contentTypes[".html"] });
    response.end(readFileSync(path.join(dist, "index.html")));
  }
});
await new Promise((resolve) => appServer.listen(0, "127.0.0.1", resolve));
const serverAddress = appServer.address();
const appPort =
  typeof serverAddress === "object" && serverAddress ? serverAddress.port : 0;
const appUrl = `http://127.0.0.1:${appPort}`;

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await desktop.goto(appUrl);
  await desktop.evaluate((items) => {
    localStorage.setItem("study-planner-tasks", JSON.stringify(items));
  }, mainTasks);
  await desktop.reload();
  await desktop.screenshot({
    path: path.join(screenshots, "application-dashboard.png"),
    fullPage: true,
  });

  await desktop.evaluate(() => localStorage.clear());
  await desktop.reload();
  await desktop.getByLabel("Study time (minutes)").fill("14");
  await desktop.getByRole("button", { name: "Add study task" }).click();
  await desktop.getByText("Enter a task title.").waitFor();
  await desktop.screenshot({
    path: path.join(screenshots, "validation-errors.png"),
    fullPage: true,
  });

  const overdueTasks = [
    task("evidence-overdue", "Old revision task", "History", -1, "high", 30),
    task(
      "evidence-upcoming",
      "Prepare weekly quiz",
      "Software Testing",
      3,
      "medium",
      60,
    ),
  ];
  await desktop.evaluate((items) => {
    localStorage.setItem("study-planner-tasks", JSON.stringify(items));
  }, overdueTasks);
  await desktop.reload();
  await desktop.getByText("Overdue").waitFor();
  await desktop.screenshot({
    path: path.join(screenshots, "overdue-task.png"),
    fullPage: true,
  });
  await desktop.close();

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await mobile.goto(appUrl);
  await mobile.evaluate((items) => {
    localStorage.setItem("study-planner-tasks", JSON.stringify(items));
  }, mainTasks);
  await mobile.reload();
  await mobile.screenshot({
    path: path.join(screenshots, "responsive-mobile.png"),
    fullPage: true,
  });
  await mobile.close();
} finally {
  appServer.close();
  await browser.close();
}

const failures = [unit, e2e, coverage, staticResult].filter(
  (result) => result.exitCode !== 0,
);
if (failures.length) process.exitCode = 1;
