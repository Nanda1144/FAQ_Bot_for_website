document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const faqForm = document.getElementById('faq-form');
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const categoryInput = document.getElementById('category');
    const faqManagement = document.getElementById('faq-management');
    
    // State
    let faqs = [];
    let editingId = null;
    
    // Initialize
    function init() {
        // Load FAQs
        loadFaqs();
        
        // Form submission
        faqForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Load FAQs from API
    async function loadFaqs() {
        try {
            const response = await fetch('/api/faqs');
            faqs = await response.json();
            renderFaqs();
        } catch (error) {
            console.error('Error loading FAQs:', error);
            faqManagement.innerHTML = '<p>Error loading FAQs. Please try again later.</p>';
        }
    }
    
    // Render FAQs for management
    function renderFaqs() {
        faqManagement.innerHTML = '';
        
        if (faqs.length === 0) {
            faqManagement.innerHTML = '<p>No FAQs found. Add some using the form above.</p>';
            return;
        }
        
        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-management-item');
            
            const faqInfo = document.createElement('div');
            faqInfo.classList.add('faq-management-info');
            
            const faqQuestion = document.createElement('h3');
            faqQuestion.textContent = faq.question;
            
            const faqAnswer = document.createElement('p');
            faqAnswer.textContent = faq.answer;
            
            const faqCategory = document.createElement('p');
            faqCategory.textContent = `Category: ${faq.category || 'General'}`;
            
            faqInfo.appendChild(faqQuestion);
            faqInfo.appendChild(faqAnswer);
            faqInfo.appendChild(faqCategory);
            
            const faqActions = document.createElement('div');
            faqActions.classList.add('faq-management-actions');
            
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn-edit');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editFaq(faq));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn-delete');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteFaq(faq.id));
            
            faqActions.appendChild(editBtn);
            faqActions.appendChild(deleteBtn);
            
            faqItem.appendChild(faqInfo);
            faqItem.appendChild(faqActions);
            
            faqManagement.appendChild(faqItem);
        });
    }
    
    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        const category = categoryInput.value.trim() || 'General';
        
        if (!question || !answer) {
            alert('Question and answer are required');
            return;
        }
        
        try {
            if (editingId) {
                // Update existing FAQ
                const response = await fetch(`/api/faqs/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question, answer, category })
                });
                
                if (response.ok) {
                    resetForm();
                    loadFaqs();
                } else {
                    alert('Error updating FAQ');
                }
            } else {
                // Add new FAQ
                const response = await fetch('/api/faqs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question, answer, category })
                });
                
                if (response.ok) {
                    resetForm();
                    loadFaqs();
                } else {
                    alert('Error adding FAQ');
                }
            }
        } catch (error) {
            console.error('Error saving FAQ:', error);
            alert('Error saving FAQ');
        }
    }
    
    // Edit FAQ
    function editFaq(faq) {
        questionInput.value = faq.question;
        answerInput.value = faq.answer;
        categoryInput.value = faq.category || 'General';
        editingId = faq.id;
        
        // Update form button
        const submitBtn = faqForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update FAQ';
        
        // Scroll to form
        faqForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Delete FAQ
    async function deleteFaq(id) {
        if (!confirm('Are you sure you want to delete this FAQ?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/faqs/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadFaqs();
            } else {
                alert('Error deleting FAQ');
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Error deleting FAQ');
        }
    }
    
    // Reset form
    function resetForm() {
        faqForm.reset();
        editingId = null;
        
        // Reset form button
        const submitBtn = faqForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add FAQ';
    }
    
    // Initialize the app
    init();
});
