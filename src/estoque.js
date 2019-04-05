const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estoqueSchema = new Schema({
    keyword: {
        type: String,
        required: true,
        unique: true
    },
    items: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Estoque = mongoose.model('Estoque', estoqueSchema);
module.exports = Estoque;