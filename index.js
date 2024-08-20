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
        favoriteMovies: ["Black Hawk Down"]
    },
    {
        id: 2,
        name: "Peyton",
        favoriteMovies: ["The Gladiator"]
    },
]

//Define top movie database
let topMovies = [
    {
        'Title': 'Remember the Titans',
        'Description': 'A high school football team must overcome racial differences during the age of desegregation.',
        'Genre': 'Sports',
        'Year': '2000',
        'Director': {
            'Name': 'Boaz Yayik',
            'Bio': 'An Israeli-American screenwriter, film director, and producer based in New York City. He has director movies such as Remember the Titans and Safe.',
            'Birthday': 'June 20, 1965'
        }
        imageURL: 'https://www.imdb.com/title/tt0210945/mediaviewer/rm625477376/?ref_=tt_ov_i'
    },
    {
        'Title': 'Black Hawk Down',
        'Description': 'US Forces are forced to fight a gruesome battle in the hostile city of Mogadishu after a black hawk helicopter is shot down.',
        'Genre': 'Action',
        'Year': '2001',
        'Director': {
            'Name': 'Ridley Scott',
            'Bio': 'Sir Ridley Scott GBE is an English filmmaker. He is best known for directing films in the science fiction, crime and historical drama genres.',
            'Birthday': 'November 30, 1937'
        }
        imageURL: 'https://www.imdb.com/title/tt0265086/mediaviewer/rm2867726336/?ref_=tt_ov_i'
    },
    {
        'Title': 'Gladiator',
        'Description': 'The emperors son is enraged when he is passed over as heir in favour of his fathers favorite general. He kills his father and arranges the murder of the generals family, and the general is sold into slavery to be trained as a gladiator, but his subsequent popularity in the arena threatens the throne.',
        'Genre': 'Action',
        'Year': '2000',
        'Director': {
            'Name': 'Ridley Scott',
            'Bio': 'Sir Ridley Scott GBE is an English filmmaker. He is best known for directing films in the science fiction, crime and historical drama genres.',
            'Birthday': 'November 30, 1937'
        },
        imageURL: 'https://m.media-amazon.com/images/I/51GA6V6VE1L._SY445_.jpg'
    }
];

//Read
app.get('/topMovies', (req, res) => {
    res.status(200).json(topMovies);
})

app.get('/users', (req, res) => {
    res.status(200).json(users);
  });

//Read
app.get('/topMovies/:Title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
    
})

//Read
app.get('/topMovies/Genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = topMovies.find(movie => movie.Genre === genreName );

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre');
    }   
})

app.post('/users', (req, res) => {
    const newUser = req.body;
  
    if (newUser.name){
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).json(newUser);
    } else {
      res.status(400).send('users need names');
    }
  });

  app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;
  
    let user = users.find(user => user.id == id);
  
    if (user){
      user.name = updatedUser.name;
      res.status(200).json(user);
    } else {
      res.status(400).send('no such user');
    }
  });

  app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find(user => user.id == id);
  
    if (user){
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`); 
    } else {
      res.status(400).send('no such user');
    }
  });

  app.get('/movies/Director/:directorName', (req, res) => {
    const { directorName } = req.params; 
    const movie = movies.find(movie => movie.director.name.toLowerCase() === directorName.toLowerCase());
  
    if (movie) {
      const director = movie.director;
      res.status(200).json(director);
    } else {
      res.status(400).send('No such director');
    }
  });

  app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
  
    let user = users.find(user => user.id == id);
  
    if (user){
      user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`); 
    } else {
      res.status(400).send('no such user');
    }
  });

  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
  
    let user = users.find(user => user.id == id);
  
    if (user) {
      users = users.filter(user => user.id != id);
      res.json(users);
    } else {
      res.status(400).send('no such user');
    }
  });

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