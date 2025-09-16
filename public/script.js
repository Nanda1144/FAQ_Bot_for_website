document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const faqCategories = document.getElementById('faq-categories');
    const faqList = document.getElementById('faq-list');
    
    // State
    let faqs = [];
    let categories = new Set();
    let activeCategory = 'All';
    
    // Initialize
    function init() {
        // Check for saved theme
        const savedTheme = localStorage.getItem('chat-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Load FAQs
        loadFaqs();
        
        // Event listeners
        sendBtn.addEventListener('click', handleUserMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            localStorage.setItem('chat-theme', newTheme);
        });
    }
    
    // Load FAQs from API
    async function loadFaqs() {
        try {
            const response = await fetch('/api/faqs');
            faqs = await response.json();
            
            // Extract categories
            faqs.forEach(faq => {
                if (faq.category) {
                    categories.add(faq.category);
                }
            });
            
            // Render categories and FAQs
            renderCategories();
            renderFaqs();
        } catch (error) {
            console.error('Error loading FAQs:', error);
            addMessageToChat('Sorry, I couldn\'t load the FAQs at the moment. Please try again later.', 'bot');
        }
    }
    
    // Render FAQ categories
    function renderCategories() {
        faqCategories.innerHTML = '';
        
        // Add "All" category
        const allBtn = document.createElement('button');
        allBtn.classList.add('category-btn', 'active');
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', () => {
            activeCategory = 'All';
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            allBtn.classList.add('active');
            renderFaqs();
        });
        faqCategories.appendChild(allBtn);
        
        // Add other categories
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.classList.add('category-btn');
            btn.textContent = category;
            btn.addEventListener('click', () => {
                activeCategory = category;
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');
                renderFaqs();
            });
            faqCategories.appendChild(btn);
        });
    }
    
    // Render FAQs
    function renderFaqs() {
        faqList.innerHTML = '';
        
        const filteredFaqs = activeCategory === 'All' 
            ? faqs 
            : faqs.filter(faq => faq.category === activeCategory);
        
        if (filteredFaqs.length === 0) {
            faqList.innerHTML = '<p>No FAQs found in this category.</p>';
            return;
        }
        
        filteredFaqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');
            
            const faqQuestion = document.createElement('div');
            faqQuestion.classList.add('faq-question');
            faqQuestion.innerHTML = `
                ${faq.question}
                <i class="fas fa-chevron-down"></i>
            `;
            
            const faqAnswer = document.createElement('div');
            faqAnswer.classList.add('faq-answer');
            faqAnswer.textContent = faq.answer;
            
            faqQuestion.addEventListener('click', () => {
                faqItem.classList.toggle('active');
            });
            
            faqItem.appendChild(faqQuestion);
            faqItem.appendChild(faqAnswer);
            faqList.appendChild(faqItem);
        });
    }
    
    // Add message to chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const avatar = document.createElement('div');
        avatar.classList.add('message-avatar');
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.classList.add('message-content');
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        content.appendChild(messageText);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }
    
    // Handle user message
    async function handleUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessageToChat(message, 'user');
        userInput.value = '';
        
        showTypingIndicator();
        
        try {
            // Search for matching FAQs
            const response = await fetch(`/api/search?q=${encodeURIComponent(message)}`);
            const results = await response.json();
            
            hideTypingIndicator();
            
            if (results.length > 0) {
                // Use the first result as the answer
                addMessageToChat(results[0].answer, 'bot');
            } else {
                // No matching FAQ found
                addMessageToChat('I couldn\'t find an answer to your question. Please try rephrasing or browse the FAQs below.', 'bot');
            }
        } catch (error) {
            console.error('Error searching FAQs:', error);
            hideTypingIndicator();
            addMessageToChat('Sorry, I encountered an error while searching for an answer. Please try again later.', 'bot');
        }
    }
    
    // Initialize the app
    init();
});
