'use strict';
require('dotenv')
const jwt = require("jsonwebtoken");
const redisService = require('./redisService')
const models = require('../models')

const config = process.env;


const verifyClient = async(req, res, next) =>{
  const auth = req.headers['authorization']
  try{
  if(!auth){
    return res.send("Missing authorization")
  }
  const tmp = auth.split(' ')
  if(tmp.length !== 2)
  {
    return res.send("Invalid authorization")
  }

  const buf = Buffer.from(tmp[1], 'base64')
  const plainAuth = buf.toString()
  const creds = plainAuth.split(':')
  if (creds.length !== 2) {
    return res.send("Invalid authorization")
  }

  const bundle = creds[0]
  const token = creds[1]

  const authbundle = await models.app.findOne({
      where:{ bundle: bundle }
  })

  res.locals.roleId = authbundle.user_role_id

    if(authbundle.token === token)
    {
      next()
    }
  }
  catch(err){
    console.log(err);
    res.send("Unauthorized client")
  }

}



const verifyToken = async(req, res, next) => {
  const token = req.headers['token'];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY, async(err, decoded)=>{
      //const userId = user.id
      const  userId = decoded.userId
        //redis se getValue 
        const redisToken = await redisService.getValue(userId)

        res.locals.userId = userId
        if(token === redisToken)
        {
          return next();
        }

  
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};


const roleAuth = async(role, roleId)=>{
  try{
  const user_role = await models.user_role.findOne({
    where:{id: roleId}
  })

  if(user_role.role !== role)
  {
    return false
  }else
  return true
}catch(err){
  console.log(err);
}
}


module.exports = {verifyToken, verifyClient, roleAuth};