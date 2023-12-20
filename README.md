# <h1 style="color:orange;">X-Education</h1>

-   An educational platform simple backend system.

### Live Site Link: https://xeducation.vercel.app/

-   Example get all courses: https://xeducation.vercel.app/api/course

## <h1 style="color:red;">Important</h1>

-   For all the routes except get all courses, login and logout you have to set accessToken Authorization in header. For get the accessToken you have to login first.

Login Creadintials with example:

```json
{
    "username": "admin",
    "password": "admin123"
}
```

Sample Response example:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAzMDQ4MDc4LCJleHAiOjE3MDMwNDkyNzh9.BGUj1HcLI2gwX_D-C0guzqWAGgHcU-GmxBUCpDcelTM"
}
```

### <h2 style="color:Green;">Set accessToken in Headers Authorization as </h2>

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAzMDQ4MDc4LCJleHAiOjE3MDMwNDkyNzh9.BGUj1HcLI2gwX_D-C0guzqWAGgHcU-GmxBUCpDcelTM
```

## <h1 style="color:orange;">Postman API Documentation</h1>

-   See the documention for proper instruction: https://documenter.getpostman.com/view/18387318/2s9YkoehUp

## <h1 style="color:orange;">How to run the project locally</h1>

-   Clone the repository first in your device using this command

```bash
git clone https://github.com/razikuljoni/X-Education
```

-   Go to the downloded folder and open terminal in the folder and run the given command

```
npm install
```

-   Change the .env file and added necessary information, example

```
PORT=8080
MONGODB_URL=mongodburl
JWT_SECRET=jwt-secret
ACCESS_TOKEN_SECRET=access-token
REFRESH_TOKEN_SECRET=refresh-token
```

-   To access all the routes you have to login as admin. For this login as admin and collect the accessToken and set in the headers authorization.
    Example Login Response:

```json
"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAzMDQ4MDc4LCJleHAiOjE3MDMwNDkyNzh9.BGUj1HcLI2gwX_D-C0guzqWAGgHcU-GmxBUCpDcelTM"
```

Example Set Authorization in Headers:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAzMDQ4MDc4LCJleHAiOjE3MDMwNDkyNzh9.BGUj1HcLI2gwX_D-C0guzqWAGgHcU-GmxBUCpDcelTM
```

-   Then run the project locally uning the following command

```
npm run dev
```

## <h1 style="color:orange;">Technology Used</h1>

-   Javascript
-   NodeJs
-   ExpressJs
-   cors
-   mongodb
-   dotenv
-   jsonwebtoken
-   http-status-codes
-   cookie-parser

## <h1 style="color:orange;">Contact</h1>

If you have any questions or feedback, feel free to contact me:

-   MD. Razikul Islam Joni - [Linkedin](https://www.linkedin.com/in/razikuljoni) - razikuljoni@gmail.com
