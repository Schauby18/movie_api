const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

//Define top 10 movie database
const topMovies = [
    {
        title: 'Remember the Titans',
        genre: 'Sports',
        year: '2000'
    },
    {
        title: 'Black Hawk Down',
        genre: 'Action',
        year: '2001'
    },
    {
        title: 'Gladiator',
        genre: 'Action',
        year: '2000'
    },
    {
        title: 'Avengers: End Game',
        genre: 'Superhero',
        year: '2019'
    },
    {
        title: 'Star Wars Episode II: Attack of the Clones',
        genre: 'Science Fiction',
        year: '2002'
    },
    {
        title: 'Lord of the Rings: The Fellowship of the Ring',
        genre: 'Adventure',
        year: '2001'
    },
    {
        title: '13 Hours',
        genre: 'Action',
        year: '2016'
    },
    {
        title: 'Zoolander',
        genre: 'Comedy',
        year: '2001'
    },
    {
        title: 'Treasure Planet',
        genre: 'Adventure',
        year: '2002'
    },
    {
        title: 'Jurassic Park',
        genre: 'Adventure',
        year: '2001'
    }
];

//create a write stream
//a 'log.txt' file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

// Logging requests with Morgan middleware library 
app.use(morgan('combined', {stream: accessLogStream}));


// GET route at endpoint /movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//GET route at endpoint /
app.get('/', (req, res) => {
    res.send('Enjoy the movie!')
});

// Serving static from public folder rather than http, url and fs modules
app.use(express.static('public'));

// Error handling log 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('sorry something went wrong');
});

app.listen(8080, () => {
    console.log('Your app is listening to port 8080');
});