const express = require("express");
const router = express.Router();

router.post("/kerko_rezervim", (req, res) => {
  const cel = req.body.Cel;
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const uri =
    "mongodb+srv://anibregu7:A07092001ni@cluster0.qqbqs6m.mongodb.net/?retryWrites=true&w=majority";

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationEsrrors: true,
    },
  });
  async function run() {
    try {
      // Connect the client to the server (optional starting in v4.7)
      await client.connect();

      // Access a specific database and collection
      const database = client.db("client_data");
      const collection = database.collection("client");

      // Perform a find operation and log the result
      const result = await collection.find({}).toArray();
      var i = 0;
      var name, nr, date, ora, sherbim;
      let check = false;

      /////////////////////////////// Kerkimi i numrit te cel per /rezervimiim//////////////////////////////////////////////////////////
      for (i = 0; i < result.length; i++) {
        var n = result[i].nr;
        if (n == cel) {
          name = result[i].name;
          nr = n;
          date = result[i].data;
          ora = result[i].orari;
          sherbim = result[i].sherbime;
          check = true;
          break;
        }
      }
      if (check) {
        res.redirect(
          `/rezervimiim.html?name=${name}&nr=${nr}&date=${date}&ora=${ora}&sherbim=${sherbim}`
        );
      } else {
        res.redirect("/notreserved.html");
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});
module.exports = router;
