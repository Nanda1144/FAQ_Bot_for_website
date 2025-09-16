# FAQ Bot for Website

A responsive FAQ bot with chat interface and admin panel, built with Node.js, Express, and vanilla JavaScript.

## Features

- Interactive chat interface for asking questions
- FAQ browsing with category filtering
- Admin panel for managing FAQs
- Dark/light theme toggle
- Responsive design for mobile devices
- Search functionality for finding relevant answers


How to Use
Chat Interface
Type your question in the input field and press Enter or click the send button
The bot will search for relevant FAQs and provide answers
Browse FAQs by category using the category buttons
Toggle between light and dark themes using the theme button
Admin Panel
Go to http://localhost:3000/admin
Add new FAQs using the form
Edit or delete existing FAQs
All changes are reflected immediately in the chat interface
Backend Logic
The backend is built with Node.js and Express:

Database: In-memory storage for FAQs (for simplicity)
API Endpoints:
GET /api/faqs - Get all FAQs
GET /api/faqs/:id - Get a specific FAQ
POST /api/faqs - Add a new FAQ
PUT /api/faqs/:id - Update an FAQ
DELETE /api/faqs/:id - Delete an FAQ
GET /api/search?q=query - Search FAQs
Customization
To customize the chatbot responses, edit the faqs array in src/database.js.

To change the styling, modify the variables in public/style.css.

Browser Compatibility
This FAQ bot works in all modern browsers including Chrome, Firefox, Safari, and Edge.




Required Packages
The project requires the following packages:

express: Web framework for Node.js
nodemon: Development dependency for auto-restarting the server (optional)
These are installed via npm as specified in package.json.

Main Backend Logic
The backend logic is primarily in src/database.js and src/routes.js:

Database Logic (database.js):
In-memory storage for FAQs (for simplicity; in production, use a real database)
Functions to get, add, update, delete, and search FAQs
API Routes (routes.js):
RESTful API endpoints for managing FAQs:
GET /api/faqs - Get all FAQs
GET /api/faqs/:id - Get a specific FAQ by ID
POST /api/faqs - Add a new FAQ
PUT /api/faqs/:id - Update an existing FAQ
DELETE /api/faqs/:id - Delete an FAQ
GET /api/search?q=query - Search FAQs by query
Server (app.js):
Sets up the Express server
Serves static files from the public directory
Routes API requests to the appropriate handlers
