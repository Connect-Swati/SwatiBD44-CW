//npm install express sqlite3 sqlite
//node BD4.4_CW/initDB.js
//node BD4.4_CW
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.4_CW/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.4 - CW" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: SELECT only id, title & release_year of all movies

Create an endpoint /movies to return all the movies

Create a function fetchAllMovies to fetch all the movies from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies

Expected Response:

{
	movies: [
		// All the movies in the database
	]
}
*/

// function to fetch id, title & release_year of all movies
async function fetchAllMovies() {
  let query = "SELECT id, title, release_year FROM movies";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No Movies found");
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching Movies ", error.message);
    throw error;
  }
}
// endpoint to fetch id, title & release_year of all movies
app.get("/movies", async (req, res) => {
  try {
    let movies = await fetchAllMovies();
    res.status(200).json(movies);
    console.log("Succesfully fetched all movies");
  } catch (error) {
    if (error.message === "No Movies found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 2: SELECT id, title, actor & release_year from all movies by an actor

Create an endpoint /movies/actor/:actor to return all the movies of an actor.

Create a function fetchMoviesByActor to fetch all the movies of an actor from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/actor/Salman%20Khan

Expected Response:

{
  movies: [
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      actor: 'Salman Khan',
      release_year: 2015,
    },
    { id: 5, title: 'Sultan', actor: 'Salman Khan', release_year: 2016 },
  ],
}
*/
// function to fetch id, title, actor & release_year from all movies by an actor
async function fetchMoviesByActor(actor) {
  let query = `SELECT id, title, actor, release_year FROM movies WHERE actor = ?`;
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [actor]);
    if (!result || result.length == 0) {
      throw new Error("No Movies found for actor : " + actor);
    }
    return { movies: result };
  } catch (error) {
    console.log("Error in fetching Movies for actor :" + actor, error.message);
    throw error;
  }
}
// endpoint to fetch id, title, actor & release_year from all movies by an actor
app.get("/movies/actor/:actor", async (req, res) => {
  try {
    let actor = req.params.actor;
    let movies = await fetchMoviesByActor(actor);
    res.status(200).json(movies);
    console.log("Succesfully fetched movies for actor :" + actor);
  } catch (error) {
    if (error.message === "No Movies found for actor : " + actor) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: SELECT id, title, director & release_year from all movies by a director

Create an endpoint /movies/director/:director to return all the movies of an actor.

Create a function fetchMoviesByDirector to fetch all the movies of an actor from the database.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/movies/director/Kabir%20Khan

Expected Response:

{
  movies: [
    {
      id: 4,
      title: 'Bajrangi Bhaijaan',
      director: 'Kabir Khan',
      release_year: 2015,
    },
  ],
}
*/
// function to fetch id, title, director & release_year from all movies by a director
async function fetchMoviesByDirector(director) {
  let query = `SELECT id, title, director, release_year FROM movies WHERE director = ?`;
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [director]);
    if (!result || result.length == 0) {
      throw new Error("No Movies found for director : " + director);
    }
    return { movies: result };
  } catch (error) {
    console.log(
      "Error in fetching Movies for director :" + director,
      error.message,
    );
    throw error;
  }
}
// endpoint to fetch id, title, director & release_year from all movies by a director
app.get("/movies/director/:director", async (req, res) => {
  try {
    let director = req.params.director;
    let movies = await fetchMoviesByDirector(director);
    res.status(200).json(movies);
    console.log("Succesfully fetched movies for director :" + director);
  } catch (error) {
    if (error.message === "No Movies found for director : " + director) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
