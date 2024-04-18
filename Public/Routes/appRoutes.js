
const express=require("express");
const router=express.Router();


router.route("/login")

router.route("/logout",(req,res)=>{
    req.logout();
    const logout = () => {
    localStorage.removeItem('token');
};
res.redirect("/login");

})

module.exports=router;
