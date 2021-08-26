# e-commerce web application

## overview

This application has been built in PostgreSQL, ExpressJS and NodeJS.
This is the backend module of e-commerce web application. In this web application,There is register, login/ logout facility which is achieved by JWT web tokens. I also used redis for storing the cookies in this web application.

There are two user role - **Admin** and **Customer**.

-In admin module, one can register, login/ logout, add new products and get list of all orders from different customers.

-In customer module, one can register, login/logout, browse all products, order products and also get list of his ordered products.

## requirements

Following are the requirements to run this project - 

- install NodeJS
- install PostgreSQL
- A database for this e-commerce (only name, the migration files will do the rest)

- After that rename .env.example to .env and change its values accordingly. Also rename config-example.json file in the code by config.json with all appropriate values. 

###### To run this project, you need to clone this repo and enter following commands in Terminal -

- npm i

- npx sequelize-cli db:migrate

- npx sequelize-cli db:seed:all

- npm start


## screenshots

### admin APIs - 

#### register
##### body- 
![atul](https://i.imgur.com/yRkHZvD.png)

##### response-
![atul](https://i.imgur.com/wDYnJth.png)

#### login
##### body-
![atul](https://i.imgur.com/Se5BcmC.png)

##### response-
![atul](https://i.imgur.com/5fC75sO.png)

#### logout
##### response-
![atul](https://i.imgur.com/TjbknJC.png)

#### addProducts
##### body-
![atul](https://i.imgur.com/bgq5OBY.png)

##### response-
![atul](https://i.imgur.com/GRQgVyY.png)                            

#### getOrders
##### response-
![atul](https://i.imgur.com/BhBpquv.png)                                

### customer APIs
                                                                
#### register
##### body-
![atul](https://i.imgur.com/vdhg9AR.png)

##### response-
![atul](https://i.imgur.com/2ktLWSH.png)

#### login
##### body-
![atul](https://i.imgur.com/CvliqwV.png)

##### response-
![atul](https://i.imgur.com/k85Tjj7.png)

#### logout
##### response-
![atul](https://i.imgur.com/qfJR3SL.png)

#### getAllProducts
##### response-
![atul](https://i.imgur.com/JBjGuZt.png)

#### getProductsbyId
##### response-
![atul](https://i.imgur.com/g88GszF.png)

#### placeOrder
##### body-
![atul](https://i.imgur.com/WBpKpxm.png)

##### response-
![atul](https://i.imgur.com/TIhcGkK.png)

#### getOrders
##### response-
![atul](https://i.imgur.com/iVwdpdp.png)

