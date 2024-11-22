const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/auth');
const tripRoutes = require('./Routes/trip');
const cors = require('cors');
dotenv.config();

const app = express();
// define the port
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a simple route
app.get('/', (req, res) => { 
  res.send('Hello World!');
});



app.use('/api/auth', authRoutes);
app.use('/trip', tripRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 1.import the express
// 2.by using app we can do all type of http requests
// 3.the server must listen the request


//1.import the route
//2.use it
