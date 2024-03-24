const express = require("express");
const path = require("path");
const authRoutes = require("./auth");
const manageData = require("./data");
const newClient = require("./newClient");

const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;
const ipAddress = "192.168.100.20";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use("/", manageData); // Use the auth routes
app.use("/", newClient);
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/rezervim_klient", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "rezervim_klient.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/clientinfo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "clientinfo.html"));
});

app.get("/rezervim", (req, res) => {
  res.sendFile(path.join(__dirname, "public/public", "rezervim.html"));
});
app.get("/confirmed", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "confirmed.html"));
});
app.get("/deleted", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "deleted.html"));
});
app.get("/modifikuar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "modifikuar.html"));
});
app.get("/usednr", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "usednr.html"));
});

app.get("/client-info", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client-info.html"));
});
app.get("/client-info-modify", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "client-info-modify.html"));
});

app.listen(port, ipAddress, () => {
  console.log(`Server is listening on http://${ipAddress}:${port}`);
});

const uri =
  "mongodb+srv://anibregu7:A07092001ni@cluster0.qqbqs6m.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("client_data");
    const collection = database.collection("client");

    const result = await collection.find({}).toArray();

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    const currentYear = currentDate.getFullYear();
    const currentHours = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    var oraret = [];

    console.log(oraret);

    async function del(id, emri, buttonId, dataid, sherbim) {
      try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        const database = client.db("client_data");
        const collection = database.collection("client");

        await collection.deleteMany({ nr: id });

        console.log(`Document with ID ${id} deleted successfully.`);
        if (emri != 1 && buttonId != 1 && dataid != 1) {
          const objectToInsert = {
            name: emri,
            nr: id,
            orari: buttonId,
            data: dataid,
            sherbime: sherbim,
          };

          console.log("done");

          await collection.insertOne(objectToInsert);
        }
      } catch (error) {
        console.error(
          `Error deleting document with ID ${id}: ${error.message}`
        );
        // Re-throw the error if you want to propagate it further
        throw error;
      }
    }

    async function take() {
      try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        const database = client.db("client_data");
        const collection = database.collection("client");
        const result1 = await collection.find({}).toArray();

        for (const item of result1) {
          const db = item.data;
          const h = item.orari;

          const dateParts = db.split("/");
          const hParts = h.split(":");
          const day = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[2], 10);
          const hr = parseInt(hParts[0], 10);
          const mn = parseInt(hParts[1], 10);

          if (
            year < currentYear ||
            (year === currentYear &&
              (month < currentMonth ||
                (month === currentMonth && day < currentDay) ||
                (day === currentDay && hr < currentHours)))
          ) {
            console.log("Deleted");
            await collection.deleteOne({ _id: item._id });
          } else {
            console.log("Ok");
            //await collection.deleteMany();
          }
        }

        return result1;
      } finally {
        // Close the connection in the finally block to ensure it happens whether there's an error or not
      }
    }

    app.get("/getOraret", async (req, res) => {
      try {
        const id = req.query.id;
        const result = await take();

        // Filter the result array based on the id
        const filteredOraret = result
          .filter((item) => item.data === id)
          .map((item) => item.orari);

        // Respond with the filtered oraret array
        res.json({ oraret: filteredOraret });
      } catch (error) {
        console.error("Error in /getOraret route:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/modify", (req, res) => {
      const id = req.query.id;
      const data = req.query.data;
      const ora = req.query.ora;
      const emri = req.query.name;
      const sherbim = req.query.sherbim;
      console.log(id);
      console.log(data);
      var i = 0;
      for (i = 0; i < result.length; i++) {
        db = result[i].data;
        h = result[i].orari;
        if (result[i].nr == id) {
          console.log("Found");
          console.log(id, data, ora, emri);
        }
        del(id, emri, ora, data, sherbim);
      }
    });

    app.get("/delete", (req, res) => {
      const id = req.query.id;
      console.log(id);
      del(id, 1, 1, 1);
    });

    app.get("/info", async (req, res) => {
      let name;
      let nr;
      let sherbime;
      const data = req.query.data;
      const ora = req.query.ora;

      try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        const database = client.db("client_data");
        const collection = database.collection("client");
        const result1 = await collection.find({}).toArray();

        for (let i = 0; i < result1.length; i++) {
          if (ora === result1[i].orari && data === result1[i].data) {
            name = result1[i].name;
            nr = result1[i].nr;
            sherbime = result1[i].sherbime;

            break; // Exit the loop once a match is found
          }
        }

        // Send the data as JSON response to the client
        res.json({ name, nr, sherbime });
      } finally {
        // Close the connection in the finally block to ensure it happens whether there's an error or not
        await client.close();
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
