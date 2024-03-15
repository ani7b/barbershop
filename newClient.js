const express = require("express");
const router = express.Router();

router.post("/clientinfo", async (req, res) => {
  const emri = req.body.er;
  const cel = req.body.Cel;
  const buttonId = req.body.ora;
  const dataid = req.body.data;
  const sherbimet = req.body.use;

  console.log("Received Button Id:", dataid);

  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri =
    "mongodb+srv://anibregu7:A07092001ni@cluster0.qqbqs6m.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationEsrrors: true,
    },
  });

  let check = true; // Initialize check to true

  try {
    await client.connect();
    const database = client.db("client_data");
    const collection = database.collection("client");

    const result = await collection.find({}).toArray();

    for (var i = 0; i < result.length; i++) {
      if (cel == result[i].nr) {
        check = false;
        break;
      }
    }

    if (check) {
      const objectToInsert = {
        name: emri,
        nr: cel,
        orari: buttonId,
        data: dataid,
        sherbime: sherbimet,
      };
      console.log(objectToInsert);
      const result1 = await collection.insertOne(objectToInsert);
      console.log("Inserted object into MongoDB with _id:", result1.insertedId);
    }
  } finally {
    await client.close();
  }

  console.log(check);

  if (check) {
    res.redirect("/confirmed.html");
  } else {
    res.redirect("/usednr.html");
  }
});

module.exports = router;
