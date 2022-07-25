const moviesList = document.querySelector('.movies');

const promiseResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

promiseResponse.then( function (response) {
  const bodyResponse = response.json();

  bodyResponse.then( function (body) {
    
    const movies = body.results;
    for (let i = 0; i < 5; i++) {
      const movie = movies[i];
      console.log(movie);
      
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie');
      movieContainer.style.backgroundImage = `url('${movie.poster_path}')`;

      const movieInfo = document.createElement('div');
      movieInfo.classList.add('movie_info');

      const movieTitle = document.createElement('span');
      movieTitle.classList.add('movie_title');
      movieTitle.textContent = movie.title;


      const movieRating = document.createElement('span');
      movieRating.classList.add('movie_rating');
      

      const estrela = document.createElement('img');
      estrela.src = 'assets/estrela.svg';
      estrela.alt = 'Estrela';

      movieRating.append(estrela, movie.vote_average);
      movieInfo.append(movieTitle, movieRating);
      movieContainer.append(movieInfo);
      moviesList.append(movieContainer);
    }
  })
})

