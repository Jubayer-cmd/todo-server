const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qygv5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todo").collection("list");
    console.log("DB Connected");

    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // POST
    app.post("/todo", async (req, res) => {
      const newService = req.body;
      const result = await todoCollection.insertOne(newService);
      res.send(result);
    });

    // DELETE
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Todo is running");
});

app.listen(port, () => {
  console.log(`Todo listening on port ${port}`);
});
