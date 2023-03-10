const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt')
app.use(express.json());
app.use(cors());


const dbName = 'authentication';
  
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://f709:Romona04!@clicker-game-db.8nvb1a0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
   client.connect().then(() => {
       console.log('Connected to MongoDB');
       const db = client.db(dbName);
       const usersCollection = db.collection('users');

       app.post('/create-user', async (req, res) => {
        console.log("create user")
        const userData = req.body;
        userData.password = await bcrypt.hash(userData.password, 10)
            usersCollection.insertOne(userData).then((result) => {
                if (!result.insertedId) {
                  console.log("User Creation Error");
                  res.sendStatus(500);
                } else {
                  console.log(result);
                  res.sendStatus(200);
                }
              });
        })
        app.post("/save-data", (req,res) => {
            const updateData = req.body
            usersCollection.updateOne(
                { username: updateData.username },
                { $set: { gameInfo: updateData.gameInfo } }
              ).then((result) => {
                    res.sendStatus(200)
              })
          })

        app.post('/login', (req, res) => {
            const loginData = req.body;
            usersCollection.findOne({ username: loginData.username }).then((result) => {
                if (result) {  // If a user document is found
                bcrypt.compare(loginData.password,result.password, (error, match) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else if (match) {  // If the passwords match
                    console.log('Login successful');
                    res.send(result.gameInfo);
                } else {  // If the passwords do not match
                    console.log('Incorrect password');
                    res.sendStatus(401);
                }
                });
            } else {  // If no user document is found
                console.log('Username not found');
                res.sendStatus(401);
            }
            });
        });
 });



app.listen(3001, function () {
  console.log("server is running");
});
