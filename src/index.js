const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const { UNAUTHORIZED, NOT_FOUND, CREATED } = require('http-status-codes');
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
        const coursCollection = client.db("X-Education").collection("courses");
        console.log("Database Connection Established!")

        app.listen(process.env.PORT, () => {
            console.log(`X-Education app listening on port ${process.env.PORT}`)
        });

        //INFO: ROUTES
        app.get("/", (req, res) => {
            res.send("X-Education Server is running!")
        });

        //INFO: add a new course
        app.post('/api/course', async (req, res) => {
            const course = req.body;
            await coursCollection.insertOne(course);
            res.json({ statusCode: CREATED, message: "The course has been added successfully" });

        });

        //INFO: get all courses
        app.get('/api/course', async (req, res) => {
            const courses = await coursCollection.find({}).toArray();
            res.send(courses);
        });

        //INFO: get course by id
        app.get('/api/course/:id', async (req, res) => {
            const id = req.params.id;
            const courses = await coursCollection.findOne({ _id: new ObjectId(id) });
            res.send(courses);
        });

        //INFO: update course

        //INFO: delete course


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



