import "dotenv/config";

import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at port: ${process.env.PORT}`);
    });
  })
  .error(error => console.log("MONGODB db connection failed !!", error));
