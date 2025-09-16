const express = require('express');
const router = express.Router();
const db = require('./database');

// Get all FAQs
router.get('/faqs', (req, res) => {
    res.json(db.getAllFaqs());
});

// Get a single FAQ by ID
router.get('/faqs/:id', (req, res) => {
    const faq = db.getFaqById(parseInt(req.params.id));
    if (faq) {
        res.json(faq);
    } else {
        res.status(404).json({ message: 'FAQ not found' });
    }
});

// Add a new FAQ
router.post('/faqs', (req, res) => {
    const { question, answer, category } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required' });
    }
    const newFaq = db.addFaq(question, answer, category || 'General');
    res.status(201).json(newFaq);
});

// Update an FAQ
router.put('/faqs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { question, answer, category } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required' });
    }
    const updatedFaq = db.updateFaq(id, question, answer, category);
    if (updatedFaq) {
        res.json(updatedFaq);
    } else {
        res.status(404).json({ message: 'FAQ not found' });
    }
});

// Delete an FAQ
router.delete('/faqs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deletedFaq = db.deleteFaq(id);
    if (deletedFaq) {
        res.json({ message: 'FAQ deleted successfully' });
    } else {
        res.status(404).json({ message: 'FAQ not found' });
    }
});

// Search FAQs
router.get('/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }
    const results = db.searchFaqs(query);
    res.json(results);
});

module.exports = router;
