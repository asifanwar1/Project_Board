const mongoose = require('mongoose');

const newCategory = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allCatogries: [
        {
            category: {
                type: String,
                required: true 
            },
        }
    ]
        
})

const Categories = mongoose.model('CATEGORIES', newCategory);

module.exports = Categories;