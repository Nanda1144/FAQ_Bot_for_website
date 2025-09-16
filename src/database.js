// In-memory database for FAQs
let faqs = [
    {
        id: 1,
        question: "How do I reset my password?",
        answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
        category: "Account"
    },
    {
        id: 2,
        question: "How can I contact customer support?",
        answer: "You can contact customer support by emailing support@example.com or calling 123-456-7890.",
        category: "Support"
    },
    {
        id: 3,
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers.",
        category: "Billing"
    }
];

let nextId = 4;

module.exports = {
    getAllFaqs: () => faqs,
    getFaqById: (id) => faqs.find(faq => faq.id === id),
    addFaq: (question, answer, category) => {
        const newFaq = {
            id: nextId++,
            question,
            answer,
            category
        };
        faqs.push(newFaq);
        return newFaq;
    },
    updateFaq: (id, question, answer, category) => {
        const faqIndex = faqs.findIndex(faq => faq.id === id);
        if (faqIndex !== -1) {
            faqs[faqIndex] = { id, question, answer, category };
            return faqs[faqIndex];
        }
        return null;
    },
    deleteFaq: (id) => {
        const faqIndex = faqs.findIndex(faq => faq.id === id);
        if (faqIndex !== -1) {
            const deletedFaq = faqs[faqIndex];
            faqs.splice(faqIndex, 1);
            return deletedFaq;
        }
        return null;
    },
    searchFaqs: (query) => {
        const lowerQuery = query.toLowerCase();
        return faqs.filter(faq => 
            faq.question.toLowerCase().includes(lowerQuery) || 
            faq.answer.toLowerCase().includes(lowerQuery)
        );
    }
};
