const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Access Denied No token Provided"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
    catch(err){ return res.status(403).json({error:"Invalid or Expired token"}); 
    } 
}; 
module.exports=verifyToken;