const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs');
const uniqid = require('uniqid');

const PORT = 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// GET Route for notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// GET Route for json of notes
app.get('/api/notes', (req, res) => 
{
    fs.readFile(`./db/db.json`, (err, data) =>
    {
        let json = JSON.parse(data);
        res.send(json);
    })
    
});

// POST Route to save a new note
app.post('/api/notes', (req, res) => 
{
    const { title, text, id } = req.body;

    if(title && text)
    {
        const newNote =
        {
            title,
            text,
            id: uniqid(),
        };

        fs.readFile(`./db/db.json`, (err, data) =>
        {
            let json = JSON.parse(data);
            json.push(newNote);

               // Write the string to a file
            fs.writeFile(`./db/db.json`,JSON.stringify(json), (err) =>
            err
            ? console.error(err)
            : console.log(
                `Note for ${newNote.title}  with id of ${newNote.id} has been written to JSON file`
                )
            );

        })
    }
});

app.delete('api/notes/:id', (req, res) => 
{
    if(req.params)
    {
        fs.readFile(`./db/db.json`, (err, data) =>
        {

            console.log(data);

            // let json = JSON.parse(data);
            // json.filter()

            //     // Write the string to a file
            // fs.writeFile(`./db/db.json`,JSON.stringify(json), (err) =>
            //     err
            //     ? console.error(err)
            //     : console.log(`Note for ${newNote.title}  with id of ${newNote.uniqid} has been written to JSON file`)
            // );

        })
    } 

});


// GET Route for any route not defined
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
