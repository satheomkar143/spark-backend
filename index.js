require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cors()); // Enable CORS globally

// Middleware
app.use(bodyParser.json());
app.use('/images/blog', express.static(path.join(__dirname, 'images/blog')));

// Database connection
connectDB();


app.get("/",(req,res)=>res.send("running"))

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Start server
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
