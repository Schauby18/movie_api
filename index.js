const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('./swagger')(app);

const app = express();
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

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve a list of movies
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/users', (req, res) => {
    res.status(200).json(users);
  });

/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Retrieve a movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such movie
 */
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie');
    }  
});

/**
 * @swagger
 * /movies/genre/{genreName}:
 *   get:
 *     summary: Retrieve movies by genre
 *     parameters:
 *       - in: path
 *         name: genreName
 *         required: true
 *         schema:
 *           type: string
 *         description: The genre name
 *     responses:
 *       200:
 *         description: A genre object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such genre
 */
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params; 
  const genre = movies.find(movie => movie.genre.name.toLowerCase() === genreName.toLowerCase()).genre;
  if (genre){
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Users need names
 */
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

  /**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such user
 */
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

  /**
 * @swagger
 * /users/{id}/{movietitle}:
 *   post:
 *     summary: Add favorite movie for user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: movietitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: Movie added to user's favorites
 *       400:
 *         description: No such user
 */
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

  /**
 * @swagger
 * /movies/director/{directorName}:
 *   get:
 *     summary: Retrieve movies by director
 *     parameters:
 *       - in: path
 *         name: directorName
 *         required: true
 *         schema:
 *           type: string
 *         description: The director name
 *     responses:
 *       200:
 *         description: A director object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No such director
 */
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

/**
 * @swagger
 * /users/{id}/{movietitle}:
 *   delete:
 *     summary: Remove favorite movie for user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *       - in: path
 *         name: movietitle
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie title
 *     responses:
 *       200:
 *         description: Movie removed from user's favorites
 *       400:
 *         description: No such user
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The updated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: No such user
 */
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

const port = 3000;
app.listen(port, () => {
  console.log('Server is running on port ${port');
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