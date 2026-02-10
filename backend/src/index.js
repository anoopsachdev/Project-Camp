// Environment variables are preloaded via: node -r dotenv/config
import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
    // our server is listening on the port only if our database is connected
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
