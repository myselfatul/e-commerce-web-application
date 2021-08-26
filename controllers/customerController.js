'use strict'
require('dotenv').config()
const models = require('../models')
const redisService = require('../middleware/redisService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')



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

          const customer = await models.user_role.findOne({
              where:{
                  role: 'CUSTOMER'
                }
              })
          const user2user_role = await models.user2user_role.create({
                user_id: user.id,
                user_role_id: customer.id
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
                role:customer.role,
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


exports.browseAllProducts = async(req, res) =>{

  try{
  const products = await models.product.findAll()

  res.send({
    products
  })
} catch(err){
  console.log(err);
}
}


exports.browseProduct = async(req, res) =>{
  
  try{
  const id = req.params.id
  const product = await models.product.findOne({
    where:{id: id}
  })

  res.send({
    product
  })
}catch(err){
  console.log(err);
}
}


exports.placeOrder = async(req, res) =>{

  try{
    const product_id = req.body.product_id
    const order = await models.order.create({
      user_id: res.locals.userId,
      product_id: product_id
    })

    const product = await models.product.findOne({
      where:{
        id: product_id
      }
    })
    res.send({
      body:{
        id: product.id,
        product: product.product_name,
        price: product.price
      },
      message:'order placed!'
    })
  }catch(err){
    console.log(err);
  }
  
}


exports.orders = async(req, res) =>{

try{
  let products = []
  let orders = await models.order.findAll({
    where:{
      user_id: res.locals.userId
    },
    attributes:['product_id'],
    include:{
      model: models.product
      }
  })

  for(let i=0; i< orders.length; i++)
  {
    products.push({
      id: orders[i].product.id,
      product_name: orders[i].product.product_name,
      price: orders[i].product.price,
      image: orders[i].product.image
    })
  }

  res.send({
      products
    }
  )
}catch(err){
  console.log(err);
}
}