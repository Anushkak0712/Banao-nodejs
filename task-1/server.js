const express=require('express')
const bodyParser=require('body-parser')
const cookieParser = require('cookie-parser');
const apiRoute = require('./apiRoutes');
const postapi=require('./postapiRoute.js')
const app = express();
const PORT = 5100;
app.use(bodyParser.json());
app.use(cookieParser());
app.use('', apiRoute);
app.use('/post',postapi);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
