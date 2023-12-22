const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjs4f1h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("taskManagementDb").collection("users");
    const createTaskCollection = client.db("taskManagementDb").collection("createTask");

    app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      })
      app.post('/users', async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      })
      app.get('/createTask', async (req, res) => {
        const result = await createTaskCollection.find().toArray();
        res.send(result);
      })
      app.post('/createTask', async (req, res) => {
        const taskItem = req.body;
        const result = await createTaskCollection.insertOne(taskItem);
        res.send(result);
      })
      app.delete('/createTask/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await createTaskCollection.deleteOne(query);
        res.send(result);
      })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task is Running');
  })
  
  app.listen(port, () => {
    console.log(`Task server is running on port ${port}`);
  })