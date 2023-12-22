const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleweres
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.iknar0j.mongodb.net/?retryWrites=true&w=majority`;

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

    const taskCollection = client.db('taskDB').collection('allTask');

    // task operation
    app.post('/tasks', async(req, res) =>{
        const taskItem = req.body;
        const result = await taskCollection.insertOne(taskItem);
        res.send(result);
    })

    // app.get('/tasks/:email', async(req, res) =>{
    //     const email = req.query.email;
    //     console.log(email);
    //     const query = {email: email}
    //     const result = await taskCollection.find(query).toArray();
    //     res.send(result)
    // })

    app.get('/tasks', async(req, res) =>{
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }
        const result = await taskCollection.find(query).toArray();
        res.send(result);
    })

    app.put('/tasks/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedTask = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: updatedTask
      };
      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result);

    })

    app.get('/tasks/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    app.delete('/tasks/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
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
  res.send('Task management server is running...')
})

app.listen(port, () => {
  console.log(`Task management server is running on port : ${port}`)
})