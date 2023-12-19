const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors');
const { UNAUTHORIZED, NOT_FOUND } = require('http-status-codes');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("X-Education").command({ ping: 1 });
        console.log("Database Connection Established!")

        app.listen(process.env.PORT, () => {
            console.log(`X-Education app listening on port ${process.env.PORT}`)
        });

        //INFO: ROUTES
        app.get("/api/course", (req, res) => {
            res.send("Hello World!")
        });

        //INFO: handle not found
        app.use((req, res, next) => {
            res.status(NOT_FOUND).json({
                success: false,
                message: 'Not Found',
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: 'API Not Found',
                    },
                ],
            });
            next();
        });

    } catch (error) {
        console.dir(error)
    }
}
run();



