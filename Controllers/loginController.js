const Teacher = require("./../Models/TeacherModel")
const AppError = require("./../utils/appError");
const CatchAsync = require("./../utils/CatchAsync");
const catchAsync = require("./../utils/CatchAsync");


exports.login = catchAsync(async (req,res,next)=>{
    const {email , password }  = req.body;

    if(!email || !password){
    return next(new AppError(` Missing paramters for login`, 404));
    }

const user = await Teacher.findOne({email:email}).select("+password");
console.log((await user.correctPassword(password)))

if(!user || !(await user.correctPassword(password))){
    return next(new AppError(`Incorrect email or password`, 401));
}


const token = JWT.sign({id:user.id , role:user.role },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

  res.status(200).json({status:"success" ,  token});
});


exports.isValidToken = CatchAsync(async (req,res,next)=>{
    const token = req.headers.authorization;
        
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
        const expirationDate = new Date(decoded.exp * 1000); 
        const currentDate = new Date();
    
        if (currentDate > expirationDate) {
          return res.status(401).json({ message: 'Token expired' });
        }
    
        return res.status(200).json({ message: 'Token is valid' });
     
})

