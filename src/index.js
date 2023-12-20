const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

//INFO: Middleware to verify admin credentials and JWT token
const verifyAdmin = (req, res, next) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        const accessToken = jwt.sign(
            { username: "admin" },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20m' }
        );

        const refreshToken = jwt.sign(
            { username: "admin" },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        //INFO: Set access token in headers
        req.headers.authorization = `Bearer ${accessToken}`;

        //INFO: Set refresh token in cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        req.accessToken = accessToken;
        next();
    } else {
        return res.status(406).json({
            message: 'Invalid credentials'
        });
    }
};

//INFO: Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token && req.cookies.jwt) {
        token = `Bearer ${req.cookies.jwt}`;
    }

    if (!token) {
        return res.status(401).json({ statusCode: StatusCodes.UNAUTHORIZED, message: 'Unauthorized Access: Token missing' });
    }

    jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ statusCode: StatusCodes.UNAUTHORIZED, message: 'Unauthorized Access: Invalid token' });
        }

        req.username = decoded.username;
        next();
    });
};

async function run() {
    try {
        await client.connect();
        const coursCollection = client.db("X-Education").collection("courses");
        console.log("Database Connection Established!");

        app.listen(process.env.PORT, () => {
            console.log(`X-Education app listening on port ${process.env.PORT}`)
        });

        //INFO: ROUTES
        app.get("/", (req, res) => {
            res.send("X-Education Server is running!")
        });

        //INFO: Login as admin
        app.post('/api/course/login', verifyAdmin, (req, res) => {
            return res.json({ accessToken: req.accessToken });
        });

        //INFO: Logout
        app.post('/api/course/logout', (req, res) => {
            res.clearCookie('jwt'); // Clear the refresh token from the cookie
            res.status(200).json({ statusCode: StatusCodes.OK, success: true, message: 'Logout successful' });
        });

        //INFO: Create a new Course
        app.post('/api/course', verifyToken, async (req, res) => {
            const course = req.body;
            const result = await coursCollection.insertOne(course);

            if (!result.acknowledged) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Created" });
            } else {
                res.json({ statusCode: StatusCodes.CREATED, success: true, message: "The course has been Created successfully" });
            }
        });

        //INFO: Get all courses
        app.get('/api/course', async (req, res) => {
            const courses = await coursCollection.find({}).toArray();

            if (!courses) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "Courses not found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "Get all courses successfully", courses });
            }
        });

        //INFO: Get single course by id
        app.get('/api/course/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const course = await coursCollection.findOne({ _id: new ObjectId(id) });

            if (!course) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "Course not found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "Get single course by id successfully", course });
            }
        });

        //INFO: Update a course
        app.patch('/api/course/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const updatedCourse = req.body;
            const result = await coursCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCourse });

            if (result.modifiedCount === 0) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Updated" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "The course has been Updated successfully" });
            }
        });

        //INFO: Delete a course
        app.delete('/api/course/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await coursCollection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                res.json({ statusCode: StatusCodes.NOT_FOUND, success: false, message: "The course has not been Deleted or Not Found" });
            } else {
                res.json({ statusCode: StatusCodes.OK, success: true, message: "The course has been Deleted successfully" });
            }
        });

        //INFO: Handle not found routes
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
        console.dir(error);
    }
}

run();
