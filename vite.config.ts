import path from 'path'
import { defineConfig } from 'vite'

import packageJson from './package.json'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        react(),
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: path.resolve(__dirname, 'lib'),
            rollupTypes: true,
        }),
    ],
    build: {
        outDir: 'build',
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'lib/index.ts'),
            name: 'index',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: [
                ...Object.keys(packageJson.dependencies || {}),
                ...Object.keys(packageJson.peerDependencies || {}),
                ...Object.keys(packageJson.devDependencies || {}),
                'react/jsx-runtime',
            ],
        },
        minify: false,
    },
    resolve: {
        alias: {
            lib: path.resolve(__dirname, './lib'),
        },
    },
})
