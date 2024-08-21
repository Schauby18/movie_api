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
let movies = [
    {
        'title': 'Remember the Titans',
        'description': 'A high school football team must overcome racial differences during the age of desegregation.',
        'genre': {
          'name':'Sports',
          'description': 'Compelling stories surrounding sports teams or players.'
        },
        'year': '2000',
        'director': {
            'name': 'Boaz Yayik',
            'bio': 'An Israeli-American screenwriter, film director, and producer based in New York City. He has director movies such as Remember the Titans and Safe.',
            'birthday': 'June 20, 1965'
        }
    },

    {
        'title': 'Black Hawk Down',
        'description': 'US Forces are forced to fight a gruesome battle in the hostile city of Mogadishu after a black hawk helicopter is shot down.',
        'genre': {
          'name':'Action',
          'description': 'Exciting stories involving high amount of violence or physical activity.'
        },
        'year': '2001',
        'director': {
            'name': 'Ridley Scott',
            'bio': 'Sir Ridley Scott GBE is an English filmmaker. He is best known for directing films in the science fiction, crime and historical drama genres.',
            'birthday': 'November 30, 1937'
        }
        },
    
    {
        'title': 'Gladiator',
        'description': 'The emperors son is enraged when he is passed over as heir in favour of his fathers favorite general. He kills his father and arranges the murder of the generals family, and the general is sold into slavery to be trained as a gladiator, but his subsequent popularity in the arena threatens the throne.',
        'genre': {
          'name':'Action',
          'description': 'Exciting stories involving high amount of violence or physical activity.'
        },
        'year': '2000',
        'director': {
            'name': 'Ridley Scott',
            'bio': 'Sir Ridley Scott GBE is an English filmmaker. He is best known for directing films in the science fiction, crime and historical drama genres.',
            'birthday': 'November 30, 1937'
        },
    }
];

//Read
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

app.get('/users', (req, res) => {
    res.status(200).json(users);
  });

//Read
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie');
    }  
});

//Read
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params; 
  const genre = movies.find(movie => movie.genre.name.toLowerCase() === genreName.toLowerCase()).genre;
  if (genre){
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }
});

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

  app.get('/movies/director/:directorName', (req, res) => {
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
    res.json(movies);
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