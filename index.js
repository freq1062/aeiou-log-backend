const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const {EntryModel, TaskModel} = require('./model.js');
require('dotenv').config({ path: __dirname + "/config.env" });

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.ATLAS_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

/* ENTRIES ENDPOINTS */ 
app.post('/addEntry', (req, res) => { //create to mongodb
    const newEntry = new EntryModel(req.body);
    newEntry.save()
        .then(() => res.json('Entry added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/getEntries/:mode', (req, res) => {
    const mode = req.params.mode;
    // console.log(mode)
    if (mode === 'all') {
        console.log("Requesting all")
        EntryModel.find()
            .then(entries => res.json(entries))
            .catch(err => res.status(400).json('Error: ' + err));
    } 
    else if (/^\d{4}-\d{2}-\d{2}$/.test(mode)) { //YYYY-MM-DD
        console.log("Specific date request")
        const date = mode;
        EntryModel.find({ date: date })
            .then(entry => res.json(entry))
            .catch(err => res.status(400).json('Error: ' + err));
    } else {
        res.status(400).json('Invalid mode');
    }
});

app.patch('/updateEntry', (req, res) => {//update by date
    const { date, newEntry } = req.body;
    // console.log("Patch request found")
    if (!date || !newEntry) {
        return res.status(400).json('Date and entry are required');
    }
    
    EntryModel.findOneAndUpdate({ date: date }, { entry: newEntry }, { new: true })
        .then(updatedEntry => {
            if (!updatedEntry) {
                return res.status(404).json('Entry not found');
            }
            res.json('Entry updated!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

app.delete('/deleteEntry', (req, res) => {//delete by date
    const { date } = req.body;
    if (!date) {
        return res.status(400).json('Date is required');
    }
    EntryModel.findOneAndDelete({ date: date })
        .then(deletedEntry => {
            if (!deletedEntry) {
                return res.status(404).json('Entry not found');
            }
            res.json('Entry deleted!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

/* TASKS ENDPOINTS */

app.get('/getTasks', (_req, res) => {
    TaskModel.find()
        .then(tasks => res.json(tasks))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/addTask', (req, res) => { //create to mongodb
    const newTask = new TaskModel(req.body);
    newTask.save()
        .then(() => res.json(newTask._id))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.delete('/deleteTask/:id', (req, res) => {//delete by id
    const { id } = req.params;
    if (!id) {
        return res.status(400).json('Id is required');
    }
    TaskModel.findOneAndDelete({ _id: id })
        .then(deletedEntry => {
            console.log(deletedEntry)
            if (!deletedEntry) {
                return res.status(404).json('Task not found');
            }
            res.json('Task deleted!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})