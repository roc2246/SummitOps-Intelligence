import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const serverRoot = process.cwd();
const sourceRoot = path.join(serverRoot, "src");
const testDirectoryNames = new Set(["__test__", "__tests__"]);

function collectTestFiles(directoryPath) {
  const entries = readdirSync(directoryPath, {
    withFileTypes: true,
  });

  const testFiles = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (testDirectoryNames.has(entry.name)) {
        for (const nestedEntry of readdirSync(entryPath, {
          withFileTypes: true,
        })) {
          if (!nestedEntry.isFile()) {
            continue;
          }

          if (nestedEntry.name.endsWith(".test.ts")) {
            testFiles.push(path.relative(serverRoot, path.join(entryPath, nestedEntry.name)));
          }
        }

        continue;
      }

      testFiles.push(...collectTestFiles(entryPath));
    }
  }

  return testFiles;
}

if (!statSync(sourceRoot).isDirectory()) {
  console.error("Could not find the src directory for backend tests.");
  process.exit(1);
}

const testFiles = collectTestFiles(sourceRoot).sort((left, right) =>
  left.localeCompare(right)
);

if (testFiles.length === 0) {
  console.error("No test files were found under __test__ or __tests__ directories.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...testFiles],
  {
    cwd: serverRoot,
    stdio: "inherit",
  }
);

process.exit(result.status ?? 1);