import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';
import userRoutes from './routes/users.js'; // include .js for local file modules

const app = express();
app.use(express.json());
app.use(cors()); // Needed for cross-origin requests

// Constants
const DB_PATH = "mongodb+srv://laksh:laksh@backend.z28uyt1.mongodb.net/Fasal_Maitri?retryWrites=true&w=majority&appName=Backend";
const PORT = 5000;

// Setup MongoDB session store (note: pass DB name here)
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: DB_PATH,
  databaseName: 'Fasal_Maitri',   // This should match your MongoDB db
  collection: 'User'
});

app.use(session({ 
  secret: "hello",
  resave: false,
  saveUninitialized: true,
  store: store 
}));

// Routes
app.use('/api/users', userRoutes);

// Start the database and server
mongoose.connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error while connecting to Mongo:', err);
  });

