import {
  KickstartContext,
  PackageInfo,
  Trigger,
  watchTree,
  WatchExpression,
} from "turbotree";

import path from "path";

/**
 * This function returns a watch expression that determines which files to watch for changes.
 */
const getWatchExpression = (p: PackageInfo): WatchExpression => [
  "allof",
  // don't watch files in dist, node_modules, or lib
  [
    "not",
    [
      "anyof",
      ["dirname", "dist"],
      ["dirname", "node_modules"],
      ["dirname", "lib"],
    ],
  ],
  [
    "anyof",
    // watch index.html in the root
    [
      "allof",
      ["dirname", p.root],
      ["anyof", ["match", "index.html", "wholename"]],
    ],
    // watch configuration files in the root
    [
      "allof",
      ["dirname", p.root],
      [
        "anyof",
        ["match", "*.json", "basename"],
        ["match", "*.env", "basename"],
        ["match", "*.env.local", "basename"],
      ],
    ],
    // watch .css, .ts, and .tsx files in src
    [
      "allof",
      ["dirname", path.join(p.root, "src")],
      [
        "anyof",
        ["match", "*.ts", "basename"],
        ["match", "*.tsx", "basename"],
        ["match", "*.css", "basename"],
      ],
    ],
  ],
];

const triggers = (p: PackageInfo): Trigger[] => [
  {
    expression: getWatchExpression(p),
    name: `${p.name}:build`,
    initialRun: false,
    onChange: async ({ spawn, files }) => {
      console.log(`${p.root}: changes detected: ${files.map((f) => f.name)}`);
      await spawn`turbo build --output-logs=new-only ${p.turboFilterFlags}`;
    },
  },
];

const kickstartCommand = async (k: KickstartContext) =>
  k.$`pnpm turbo build --output-logs=new-only ${k.turboFilterFlags}`;

watchTree(__dirname, triggers, kickstartCommand);
