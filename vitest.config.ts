import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        setupFiles: ['./test/setupTests.ts'],
        globals: true,
        environment: 'jsdom',
        coverage: {
            allowExternal: true,
            exclude: ['**/node_modules/**', '**/test/**', '**/build/**'],
        },
    },
    resolve: {
        alias: {
            lib: path.resolve(__dirname, './lib'),
            test: path.resolve(__dirname, './test'),
        },
    },
})
