const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const objectId = require('mongodb').ObjectId

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://organicUser:organicUser123@cluster0.x7xfr.mongodb.net/organicdb?retryWrites=true&w=majority";

const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("organicdb").collection("products");
  app.get("/products", (req, res) => {
    collection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })
  app.get('/products/:id', (req, res) => {
    collection.find({ _id: objectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })

  app.post("/addFriends", (req, res) => {
    const friend = req.body;
    console.log(friend);
    collection.insertOne(friend)
      .then(() => {
        res.redirect('/')
      })

  })

  app.delete('/deleteItems/:id', (req, res) => {
    collection.deleteOne({ _id: objectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({ _id: objectId(req.params.id) },
      {
        $set: { name: req.body.name, topic: req.body.topic }
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })


});
app.listen(3000, () => { console.log('3000 port running...') });