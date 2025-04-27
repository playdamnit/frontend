import { defineConfig } from "orval";

export default defineConfig({
  playdamnit: {
    // input: './petstore.yaml',
    input: "./openapi.yaml",
    output: {
      // mode: "tags-split",
      target: "./playdamnit-client/index.ts",
      baseUrl: "http://localhost:3030",
      client: "react-query",
      override: {
        mutator: {
          path: "./custom-axios.ts",
          name: "customInstance",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
