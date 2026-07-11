require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const categoryRouter = require('./routes/categoryRoutes')
const productRouter = require('./routes/productRoutes')
const app = express()
app.use(express.json());


connectDB();

app.use('/', categoryRouter);

app.use('/products', productRouter)


app.listen(process.env.PORT, ()=>{
    console.log(`Server Running PORT ${process.env.PORT}`)
})
 