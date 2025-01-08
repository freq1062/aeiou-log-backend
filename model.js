const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    entry: {
        type: String,
        required: true,
    }
})

const Model = mongoose.model('dates', Schema) //for some reason mongodb always pluralizes the collection name
module.exports = Model // Exporting the model