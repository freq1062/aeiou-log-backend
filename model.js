const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    entry: {
        type: String,
        required: true,
    }
})

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }, 
    day: {
        type: String,
        required: true,
    }, 
    created: {
        type: String,
        required: true,
    }
})

const EntryModel = mongoose.model('dates', entrySchema) //for some reason mongodb always pluralizes the collection name
const TaskModel = mongoose.model('tasks', taskSchema)
module.exports = { EntryModel, TaskModel } // Exporting the models