const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors');
const { UNAUTHORIZED, NOT_FOUND, CREATED, StatusCodes } = require('http-status-codes');
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
            const result = await coursCollection.insertOne(course);
            if (result.acknowledged === false) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Created" });
            } else {
                res.json({ statusCode: StatusCodes.CREATED, success: true, message: "The course has been Created successfully" });
            }

        });

        //INFO: get all courses
        app.get('/api/course', async (req, res) => {
            const courses = await coursCollection.find({}).toArray();
            if (!courses) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "Courses not found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "Get all courses successfully", courses });
            }
        });

        //INFO: get course by id
        app.get('/api/course/:id', async (req, res) => {
            const id = req.params.id;
            const course = await coursCollection.findOne({ _id: new ObjectId(id) });
            console.log(course);
            if (!course) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "Course not found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "Get single course by id successfully", course });
            }
        });

        //INFO: update course
        app.patch('/api/course/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCourse = req.body;
            const result = await coursCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCourse });
            if (result.modifiedCount === 0) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Updated" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "The course has been Updated successfully" });
            }
        });

        //INFO: delete course
        app.delete('/api/course/:id', async (req, res) => {
            const id = req.params.id;
            const result = await coursCollection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Deleted or Not Found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "The course has been Deleted successfully" });
            }
        });

        //INFO: handle not found
        app.use((req, res, next) => {
            res.status(StatusCodes.NOT_FOUND).json({
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



