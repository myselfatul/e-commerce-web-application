'use strict'
require('dotenv').config()
const models = require('../models')
const redisService = require('../middleware/redisService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const path = require('path')



exports.register = async(req, res) =>{
    try{
        const first_name = req.body.first_name
        const last_name = req.body.last_name
        const email = req.body.email
        const password = req.body.password
        const user_role = req.body.role.toUpperCase()

        if (!(email && password && first_name && last_name && user_role)) {
            res.status(400).send("All input is required");
          }
          
        const role =  await auth.roleAuth(user_role, res.locals.roleId)

        if(!role){
          res.send(
            'Invalid User'
          )
          throw Error('Invalid User')
        }

          // check if user already exist
          // Validate if user exist in our database
          
          const oldUser = await models.user.findOne({
               where:{email: email}
              });
      
          if (oldUser) {
            return res.status(409).send("User Already Exist");
          }
      
          //Encrypt user password
          const encryptedPassword = await bcrypt.hash(password, 10);
      
          // Create user in our database
          const user = await models.user.create({
            first_name: first_name,
            last_name: last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
            
          });

          const admin = await models.user_role.findOne({
              where:{
                  role: 'ADMIN'
                }
              })
          const user2user_role = await models.user2user_role.create({
                user_id: user.id,
                user_role_id: admin.id
            })

          // extract userId from user as "userId"
          const userId = user.id

        
          //generate token as token with key as {userId}
          const token = jwt.sign({userId},process.env.TOKEN_KEY)
          
          //when you get token then save it in redis with key userId and value token
          const userToken = await redisService.setValue(userId, token);
  
          // return new user
          if(userToken){
            res.status(201).send({
                user,
                role:admin.role,
                token
            })
          }
    }
    catch(err) {
        console.log(err)
}
}


exports.login = async(req, res) => {
  try {
    // Get user input
    const email = req.body.email
    const password = req.body.password

    // Validate user input
    if (!(email && password )) {
      res.status(400).send("All input is required");
    }
    
    // Validate if user exist in our database
    const user = await models.user.findOne({ where :{email: email} });

    if (user && (await bcrypt.compare(password, user.password))) {

      const userId = user.id
      // Create token
      const token = jwt.sign(
        {userId},
        process.env.TOKEN_KEY
      );

    const userToken = await redisService.setValue(userId, token);

  // return new user
  if(userToken){
    res.status(201).send({
        message:'user login successfully',
        token
    })
  }
    }else
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}


exports.logout = async(req,res) =>{
  try
  {
    const  userId = res.locals.userId
    
    redisService.deleteValue(userId)
      .then((replyFromRedis) =>{
        if(replyFromRedis){
          res.send("user log out")
        }
      })
}catch(err){
  console.log(err);
}}


exports.addProduct = async(req, res) =>{
  try{
  const product_name = req.body.product_name
  const price = req.body.price
  const description = req.body.description


  if(!(product_name && price && description)){
    res.status(400).send('All input required!')
  }

  const product = await models.product.create({
    product_name: product_name,
    price: price,
    image: 'images/blank.jpg',
    description:description
  })

  res.send({
    body:{
      product
    },
    message:'product added successfully'
  })
  }catch(err){
    console.log(err);
    res.send('product is not added')
  }
}


exports.orders = async(req, res) =>{

  try{
  const orders = await models.order.findAll({
    attributes:['id','user_id'],
    include:{
      model: models.product,
      attributes:['id','product_name']
    } 
  })
console.log(orders);
  res.send({
    orders
  })
}catch(err){
  console.log(err);
}
}
