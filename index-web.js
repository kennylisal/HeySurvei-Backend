const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./src-web/schema");

const app = express();

app.use(express.json());

const PORT = parseInt(process.env.PORT, 10) || 3030;

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      // Enable introspection for development
      introspection: process.env.NODE_ENV !== "production",
      // Add context for authentication or other shared data
      context: ({ req }) => ({
        // Example: Pass headers for auth
        authToken: req.headers.authorization || "",
      }),
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

startServer();
