import { KnipConfig } from "knip";

type IsNotFunction<T> = T extends (...args: any) => any ? never : T;
type RecordValues<T> = T extends Record<any, infer U> ? U : never;

type KnipConfigObject = IsNotFunction<KnipConfig>;

type WorkspaceProjectConfig = RecordValues<
  Required<KnipConfigObject["workspaces"]>
>;

const defaultWorkspaceProjectConfig: WorkspaceProjectConfig & {
  entry: string[];
  ignoreDependencies: string[];
  project: string[];
} = {
  entry: [
    "{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    "src/{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    "**/?(*.)+(spec|spec-d).[jt]s?(x)",
  ],
  ignoreDependencies: ["ts-loader", "tslib"],
  project: [
    "**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "!vitest.config.stryker.mjs",
    "!**/__mocks__",
  ],
};

export default {
  commitlint: {
    config: "config/commitlint/commitlint.config.js",
  },
  prisma: false,
  workspaces: {
    ".": {
      entry: [],
      ignoreDependencies: defaultWorkspaceProjectConfig.ignoreDependencies,
      project: [],
    },
    "packages/examples/*": defaultWorkspaceProjectConfig,
    "packages/examples/002-catalog-grapql-api": {
      ...defaultWorkspaceProjectConfig,
      entry: [
        ...defaultWorkspaceProjectConfig.entry,
        "prisma.config.mjs",
        "src/app/scripts/generateGraphqlTypes.ts",
      ],
      ignore: ["src/graphql/models/types.ts"],
      ignoreDependencies: [
        ...defaultWorkspaceProjectConfig.ignoreDependencies,
        "@prisma/client",
        "@prisma/client-runtime-utils",
      ],
    },
  },
} satisfies KnipConfig;
