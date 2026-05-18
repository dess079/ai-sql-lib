import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const external = [
  "react", "react-dom", "react/jsx-runtime",
  /^@mui\//, /^@emotion\//,
  "react-markdown", "remark-gfm", "rehype-highlight",
  "recharts", "mermaid", "shared-components"
];

const makeEntry = (input, outDir) => ({
  input,
  output: { dir: outDir, format: "esm", entryFileNames: "index.esm.js", sourcemap: true },
  external,
  plugins: [
    resolve({ extensions: [".ts", ".tsx"] }),
    typescript({ tsconfig: "./tsconfig.json", declaration: false, declarationDir: undefined, outDir }),
    terser()
  ]
});

export default [
  makeEntry("src/index.ts", "dist"),
  makeEntry("src/ui/index.ts", "dist/ui"),
  makeEntry("src/hooks/index.ts", "dist/hooks")
];
