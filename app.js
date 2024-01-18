let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');
let { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('projekti', 'emrat', 'pasat', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync()
  .then(() => {
    console.log('Database sync successful.');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('signup.ejs');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try { 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    res.render('welcome.ejs'); 
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(4000);