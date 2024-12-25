const express = require('express');
const app = express();
const User = require('./models/user');
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const session = require('express-session');

const DATABASE_NAME = 'auth';
const CONNECTION_STRING = `mongodb://localhost:27017/${DATABASE_NAME}`;

app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: 'secret'
})
)

mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.send("Home Page");
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
   const {username, password} = req.body;
   const hashedPassword = await bcrypt.hash(password, 12);
   const user = new User({
    username,
    password: hashedPassword
})
   await user.save()
   req.session.user_id = user._id;
   res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    const validUser = await bcrypt.compare(password, user.password);
    if(validUser){
        req.session.user_id = user._id;
        res.redirect('/secret');
    } else {
        res.redirect('/login');
    }
})

app.get('/secret', (req, res) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    res.render('secret');
})

app.post('/logout', (req, res) => {
   // req.session.user_id = null;
    req.session.destroy();
    res.redirect('/login');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})