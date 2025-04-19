module.exports = {
  petstore: {
    output: {
      target: "src/petstore.ts",
      input: "http://localhost:3030/swagger/json",
      baseUrl: "http://localhost:3030",
      client: "react-query",
    },
  },
};
