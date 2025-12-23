#!/usr/bin/env node

import config from '@inversifyjs/foundation-prettier-config';
import { generateTsModels } from '@inversifyjs/graphql-codegen';
import type prettier from 'prettier';

await generateTsModels({
  destinationPath: './src/graphql/models/types.ts',
  prettierConfig: config as prettier.Options,
  schemas: {
    glob: {
      patterns: ['./graphql/schemas/*.graphql'],
    },
  },
});
