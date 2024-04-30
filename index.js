const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
uuid = require('uuid');

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Brianna",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Peyton",
        favoriteMovies: ["Finding Nemo"]
    },
]

//Define top 10 movie database
let topMovies = [
    {
        Title: 'Remember the Titans',
        genre: 'Sports',
        year: '2000'
    },
    {
        Title: 'Black Hawk Down',
        genre: 'Action',
        year: '2001'
    },
    {
        Title: 'Gladiator',
        genre: 'Action',
        year: '2000'
    },
    {
        Title: 'Avengers: End Game',
        genre: 'Superhero',
        year: '2019'
    },
    {
        Title: 'Star Wars Episode II: Attack of the Clones',
        genre: 'Science Fiction',
        year: '2002'
    },
    {
        Title: 'Lord of the Rings: The Fellowship of the Ring',
        genre: 'Adventure',
        year: '2001'
    },
    {
        Title: '13 Hours',
        genre: 'Action',
        year: '2016'
    },
    {
        Title: 'Zoolander',
        genre: 'Comedy',
        year: '2001'
    },
    {
        Title: 'Treasure Planet',
        genre: 'Adventure',
        year: '2002'
    },
    {
        Title: 'Jurassic Park',
        genre: 'Adventure',
        year: '2001'
    }
];

//Read
app.get('/topMovies', (req, res) => {
    res.status(200).json(topMovies);
})

//Read
app.get('/topMovies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
    
})

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