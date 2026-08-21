require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const categoryRouter = require('./routes/categoryRoutes')
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRouter')
const cartRouter = require('./routes/cartRouter')
const addressRouter = require('./routes/addressRouter');
const orderRouter = require('./routes/orderRouter');
const adminRouter = require('./routes/adminRouter')

const cors = require('cors')
const app = express()

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

app.use(express.json());


connectDB();


app.use('/auth', authRouter)

app.use('/category', categoryRouter);

app.use('/products', productRouter);

app.use('/cart', cartRouter);

app.use('/address', addressRouter);

app.use('/orders', orderRouter);

app.use('/admin', adminRouter)


app.listen(process.env.PORT, ()=>{
    console.log(`Server Running PORT ${process.env.PORT}`)
})
  