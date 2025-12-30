#!/usr/bin/env node

import config from '@inversifyjs/foundation-prettier-config';
import { generateTsModels } from '@inversifyjs/graphql-codegen';
import type prettier from 'prettier';

await generateTsModels({
  destinationPath: './src/graphql/models/types.ts',
  pluginConfig: {
    avoidOptionals: false,
    enumsAsTypes: true,
    resolverTypeWrapperSignature: 'Partial<T> | Promise<Partial<T>>',
    useIndexSignature: false,
  },
  prettierConfig: config as prettier.Options,
  schemas: {
    glob: {
      patterns: ['./graphql/schemas/*.graphql'],
    },
  },
});
