const express= require("express");
const cors = require("cors");
const sequelize = require('./utils/dbConfig');
require("dotenv").config({ path: "config.env" });

// const LoginRoute = require("./Routes/LoginRoute");
// const TeacherRoute = require("./Routes/TeacherRoute");
 const CourseRoute = require("./Routes/CourseRoute");
 const ChapterRoute = require("./Routes/ChapterRoute");
 const QuestionRoute = require("./Routes/QuestionRoute");

//server

const app = express();
let port= process.env.PORT||8080;
app.listen(port,()=>{
    console.log("server is listenng.....",port);
});

//db connection
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

app.use(
    cors({
      origin: "*",
    })
  );



//body parse
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Routes 
app.use(CourseRoute)
app.use(ChapterRoute)
app.use(QuestionRoute)

//Not Found Middleware
app.use((request, response, next) => {
	response
		.status(404)
		.json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
app.use((error, request, response, next) => {
	if (error.statusCode && error.statusCode !== 500) {
		response.status(error.statusCode).json({ message: error.message });
	} else {
        response.status(500).json({ message: error + "" });
	}
});
