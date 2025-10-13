import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/main.ts'],
  platform: 'neutral',
  external: ["child_process", "fs", "path"],
  tsconfig: "tsconfig.json",
  banner: {
    js: "#!/usr/bin/env node"
  }
})