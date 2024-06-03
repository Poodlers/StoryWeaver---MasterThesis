// app.js
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cleanupFiles = require("./cleanup-files");
const jwt = require("jsonwebtoken");
const secretkey = require("./config/secret.json");

const { MongoClient, ServerApiVersion } = require("mongodb");
const { randomUUID } = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const unzipper = require("unzipper");

const { Worker } = require("worker_threads");

const uri =
  "mongodb+srv://Poodlers:" +
  process.env.MONGO_PASSWORD +
  "@storyweaver.6lspmuu.mongodb.net/?retryWrites=true&w=majority&appName=StoryWeaver";
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
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

const app = express();
// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath = path.join("files", req.body.projectID);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath);
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use("/files", express.static(path.join(__dirname, "files")));

app.post("/save", async (req, res) => {
  const originalStoryId = req.body.storyId;
  let storyId = originalStoryId;
  if (storyId === null || storyId === undefined) {
    storyId = randomUUID();
  }
  const storyTitle = req.body.projectTitle;
  const nodes = req.body.nodes;
  const edges = req.body.edges;
  const characters = req.body.characters;
  const maps = req.body.maps;
  const exported = req.body.exported;
  const experienceName = req.body.experienceName;
  const description = req.body.description;
  const tags = req.body.tags;

  //save to database
  await client
    .db("projects")
    .collection("story_structures")
    .updateOne(
      { id: originalStoryId },
      {
        $set: {
          id: storyId,
          title: storyTitle,
          nodes: nodes,
          edges: edges,
          characters: characters,
          maps: maps,
          exported: exported,
          experienceName: experienceName,
          description: description,
          tags: tags,
          lastModified: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

  res.send({ storyId: storyId });
});

app.get("/projects/:searchString", async (req, res) => {
  const searchString = req.params.searchString;
  const projects = await client
    .db("projects")
    .collection("story_structures")
    .find({ title: { $regex: searchString, $options: "i" } })
    .project({ id: 1, title: 1 })
    .toArray();
  res.send(projects);
});

app.get("/projects", async (req, res) => {
  const projects = await client
    .db("projects")
    .collection("story_structures")
    .find({})
    .project({ id: 1, title: 1 })
    .toArray();
  res.send(projects);
});

app.get("/exported-projects", async (req, res) => {
  const projects = await client
    .db("projects")
    .collection("story_structures")
    .find({ exported: true })
    .project({ id: 1, title: 1, experienceName: 1, description: 1, tags: 1 })
    .toArray();
  console.log(projects);
  res.send(projects);
});

app.get("/load/:storyId", async (req, res) => {
  const storyId = req.params.storyId;
  const story = await client
    .db("projects")
    .collection("story_structures")
    .findOne({ id: storyId });
  res.send(story);
});

app.post("/export/:storyId", async (req, res) => {
  const storyId = req.params.storyId;
  const experienceName = req.body.name;
  const description = req.body.description;
  const tags = req.body.tags;
  const story = await client
    .db("projects")
    .collection("story_structures")
    .updateOne(
      { id: storyId },
      {
        $set: {
          exported: true,
          experienceName: experienceName,
          description: description,
          tags: tags,
        },
      }
    );
  res.send({ success: true });
});

app.delete("/delete/:storyId", async (req, res) => {
  const storyId = req.params.storyId;
  await client
    .db("projects")
    .collection("story_structures")
    .deleteOne({ id: storyId });
  res.send({ success: true });
});

app.options("/upload", cors()); // enable pre-flight request for upload
// Handle file upload
app.post(
  "/upload",
  upload.fields([{ name: "file" }, { name: "projectID" }]),
  (req, res) => {
    res.json({ success: true });
  }
);

app.get("/unzip/:storyID/:filename", async (req, res) => {
  const filename = req.params.filename;
  const storyID = req.params.storyID;
  const filePath = path.join(__dirname, "files", storyID, filename);

  const fileNameWithoutExtension = filename.split(".")[0];
  const outputPath = path.join(
    __dirname,
    "files",
    storyID,
    fileNameWithoutExtension
  );
  if (fs.existsSync(outputPath)) {
    console.log("Unzipped files already exist for this image");
    res.json({ success: true });
    return;
  } else {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  const stream = fs
    .createReadStream(filePath)
    .pipe(unzipper.Extract({ path: outputPath }));

  stream.on("close", () => {
    res.json({ success: true });
  });

  stream.on("error", (err) => {
    res.json({ success: false, error: err });
  });
});

app.get("/generateMarker/:storyID/:filename", async (req, res) => {
  const filename = req.params.filename;
  const storyID = req.params.storyID;
  const filePath = path.join(__dirname, "files", storyID, filename);
  const fileNameWithoutExtension = filename.split(".")[0];
  if (
    fs.existsSync(
      path.join(__dirname, "files", storyID, fileNameWithoutExtension + ".fset")
    )
  ) {
    console.log("Marker files already exist for this image");
    res.json({ success: true });
    return;
  }
  const worker = new Worker("./nft-creator.js", {
    workerData: {
      imageURL: filePath,
      outputPath: "/files/" + storyID + "/",
      iParam: true,
      noConfParam: false,
      zftParam: false,
      onlyConfidenceParam: false,
    },
  });

  worker.on("message", (data) => {
    res.status(200).send(data);
  });
  worker.on("error", (msg) => {
    res.status(404).send(`An error occurred: ${msg}`);
  });
});

// Define a route to handle DELETE requests for files by name
app.delete("/files/:storyID/:filename", (req, res) => {
  const filename = req.params.filename;
  const storyID = req.params.storyID;
  const filePath = path.join(__dirname, "files", storyID, filename);
  if (filename.includes(".zip")) {
    const fileNameWithoutExtension = filename.split(".")[0];
    const outputPath = path.join(
      __dirname,
      "files",
      storyID,
      fileNameWithoutExtension
    );
    fs.rmdirSync(outputPath, { recursive: true });
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(404).send("File not found");
    } else {
      console.log("File deleted successfully.");
      res.send("File deleted successfully.");
    }
  });
});

// Define a route to handle GET requests for files by name
app.get("/files/:storyID/:filename", (req, res) => {
  const filename = req.params.filename;
  const storyID = req.params.storyID;
  // Set the appropriate content type based on the file extension
  const contentType = getContentType(filename);
  res.setHeader("Content-Type", contentType);

  // Serve the file from the 'uploads' directory
  res.sendFile(path.join(__dirname, "files", storyID, filename), (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(404).send("File not found");
    }
  });
});

// Function to determine content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

app.post("/login/user", async (req, res) => {
  const OAuthClient = new OAuth2Client(process.env.CLIENT_ID);
  const { authId } = req.body;

  try {
    //check if passed token is valid
    const ticket = await OAuthClient.verifyIdToken({
      idToken: authId,
      audience: process.env.CLIENT_ID,
    });

    //get metadata from the id token, to be saved in the db
    const { name, email, picture } = ticket.getPayload();

    //this value will be passed thru cookie
    const loginToken = jwt.sign(`${email}`, secretkey.key);
    await client
      .db("users")
      .collection("login")
      .updateOne(
        { email: email },
        {
          $set: {
            email: email,
            name: name,
            picture: picture,
          },
        },
        { upsert: true }
      );

    //creating a cookie name "login", which will expire after 360000 milliseconds from the time of creation
    //the value of the cookie is a jwt, created using the email id of the google user
    //later on each call we will deconde this message using secret key and check if user is authenticated

    res.status(200).send({
      success: true,
      loginToken: loginToken,
      name: name,
      email: email,
      picture: picture,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: e,
    });
  }
});

const authenticateUser = async (req, res, next) => {
  try {
    let idToken = req.body.loginToken;

    const decodedMessage = jwt.verify(idToken, secretkey.key);
    await client.db("users").collection("login").findOne({
      email: decodedMessage,
    });
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send({
      error: e,
    });
  }
};

app.post("/user/authenticated/getAll", authenticateUser, async (req, res) => {
  //authenticateUser is the middleware where we check if the use is valid/loggedin
  try {
    const data = await client.db("users").collection("login").find().toArray();
    res.status(200).send({
      users: data,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.get("/logout/user", async (req, res) => {
  //logout function
  try {
    res.send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.post("/user/checkLoginStatus", authenticateUser, async (req, res) => {
  //check if user is logged in already
  try {
    res.status(200).send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  // Schedule a cron job to run every day at midnight
  cron.schedule("0 0 * * *", () => {
    console.log("Running file cleanup task...");
    //cleanupFiles(path.join(__dirname, "files"));
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});
