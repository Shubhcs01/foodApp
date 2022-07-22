const express = require('express');
const cookieParser = require('cookie-parser');
let cors = require('cors');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'*'
}));
app.use(express.static('public/build'));

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});

//mini app
const userRouter = require('./Router/userRouter');
const planRouter = require('./Router/planRouter');
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require ('./Router/bookingRouter');

app.use('/user',userRouter);
app.use('/plan',planRouter)
app.use('/review',reviewRouter)
app.use('/booking',bookingRouter)