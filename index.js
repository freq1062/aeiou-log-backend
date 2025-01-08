const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const Model = require('./model.js');
require('dotenv').config({ path: __dirname + "/config.env" });

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.ATLAS_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

app.post('/addEntry', (req, res) => { //create to mongodb
    const newEntry = new Model(req.body);
    newEntry.save()
        .then(() => res.json('Entry added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// app.get('/getEntries', (_req, res) => { //read from mongodb
//     Model.find()
//         .then(entries => {
//             res.json(entries)
//         })
//         .catch(err => res.status(400).json('Error: ' + err))
// })
app.get('/getEntries/:mode', (req, res) => {
    const mode = req.params.mode;
    // console.log(mode)
    if (mode === 'all') {
        console.log("Requesting all")
        Model.find()
            .then(entries => res.json(entries))
            .catch(err => res.status(400).json('Error: ' + err));
        } 
    else if (/^\d{4}-\d{2}-\d{2}$/.test(mode)) { //YYYY-MM-DD
        // console.log("Specific date request")
        const date = mode;
        Model.find({ date: date })
            // .then(entries => console.log(entries))
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
    
    Model.findOneAndUpdate({ date: date }, { entry: newEntry }, { new: true })
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
    Model.findOneAndDelete({ date: date })
        .then(deletedEntry => {
            if (!deletedEntry) {
                return res.status(404).json('Entry not found');
            }
            res.json('Entry deleted!');
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})