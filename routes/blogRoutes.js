// routes/blogRoutes.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Blog = require('../models/Blog');
const authenticate = require('../middleware/authenticate');
const slugify = require('slugify')

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './images/blog';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create blog post
router.post('/', authenticate, upload.single('blogImage'), async (req, res) => {
    const { title, description } = req.body;
    const blogImage = req.file ? req.file.path : null;

    if (!blogImage) return res.status(400).send('blogImage is required.');

    try {
        const blog = new Blog({
            title,
            description,
            image: blogImage,
            slug: slugify(title)
        });
        await blog.save();
        res.status(201).send('Blog created successfully.');
    } catch (err) {
        res.status(400).send('Error creating blog: ' + err.message);
    }
});

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.send(blogs);
    } catch (err) {
        res.status(500).send('Error fetching blogs: ' + err.message);
    }
});

// Get single blogs
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const blog = await Blog.findOne({slug});
        res.send(blog);
    } catch (err) {
        res.status(500).send('Error fetching blogs: ' + err.message);
    }
});

// Delete blog post
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByIdAndDelete(id);
        console.log("blog:", blog)
        if (!blog) return res.status(404).send('Blog not found.');

        // Delete the image file
        if (fs.existsSync(blog.image)) {
            fs.unlinkSync(blog.image);
        }

        res.send('Blog deleted successfully.');
    } catch (err) {
        res.status(400).send('Error deleting blog: ' + err.message);
    }
});

module.exports = router;
