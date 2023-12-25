const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000
// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
// 	username: 'api',
// 	key: '43dbe5a8c59d15d80a8f5d63f78f7292-07f37fca-7ca1951f',
// });

// npm i mailgun.js form-data
// 43dbe5a8c59d15d80a8f5d63f78f7292-07f37fca-7ca1951f
// middleware
app.use(cors())
app.use(express.json())



// OdUJNFJYDcRluKpi
// farmart 



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wgrdqnn.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

const mainData = client.db("farmart").collection("mainData")
const addCart = client.db("farmart").collection("addCart")

app.get("/home", async(req, res) => {
  const data = req.query

  const perpage = parseInt(data.perpage)
const size = parseInt(data.size)


const result = await mainData.find({ category: "Bakery" })
.skip(perpage * size)
.limit(perpage)
.toArray();



// // const result = await mainData.find({ category: "Bakery" }).sort({ price: 1 } ).toArray();
res.send(result)



})


app.get("/datacount", async(req, res) => {

const result = await mainData.estimatedDocumentCount()
res.send({result})

})




app.post("/homeid", async(req, res) => {
const id = req.body.id;
const idse = {_id: new ObjectId(id)}

const result = await mainData.findOne(idse);

res.send(result)


})





app.post("/addCard", async (req, res) => {
  const allData = req.body;

  const isExit = await addCart.findOne({ name: allData.name, price: allData.price });

  if (!isExit) {
    const result = await addCart.insertOne(allData);

       
    res.send({result});
  } 
  else {

const totalquantity = isExit.quantity + allData.quantity

    const updates = {
      $set: {
        quantity: totalquantity

      }
    };

    const updateData = await addCart.updateOne(
      { _id: isExit._id }, updates);

    res.send(updateData);


  }
});







app.get("/addCard", async(req, res) => {

const options = {
  sort: { _id: -1 },
};

const result = await addCart.find({}, options).toArray()
res.send(result)
})



// http://localhost:5000/deleteproduct
app.delete("/deleteproduct", async(req, res) => {
  
const reloader = Math.floor(Math.random() * 1054353453453450);
const deletion = await addCart.deleteOne({_id: req.body.id})
res.send({deletion, reloader})



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






app.get("/", async(req, res) => {

res.send("Server is Running")

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})