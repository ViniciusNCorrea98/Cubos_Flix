const moviesList = document.querySelector('.movies');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');
const input = document.querySelector('.input');


const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightvideo_link = document.querySelector('.highlight__video-link')

input.addEventListener('keydown', function (event) {
  if(event.key !== 'Enter'){
    return; 
  }

  page = 0;

  if(input.value){
    load_search_movies(input.value)
  } else {
    load_movies()
  }

  input.value = '';
})

let page = 0;
let movies = [];

btn_prev.addEventListener('click', function() {
  if(page === 0){
    page = 3;
  } else {
    page--;
  }
  display()
});

btn_next.addEventListener('click', function() {
  if(page === 3){
    page = 0;
  } else {
    page++;
  }
  display()
});

function display (){
  moviesList.textContent = '';
  for (let i = page * 5; i < (page * 5) + 5; i++) {
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
}
function load_search_movies (search){
  const promiseResponse = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${search}`);

  promiseResponse.then( function (response) {
    const bodyResponse = response.json();

    bodyResponse.then( function (body) {
      movies = body.results;
      display();
    })
  })
}

function load_highlight_movies(){
  const promiseResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');

  promiseResponse.then( function (response) {
    const bodyResponse = response.json();

    bodyResponse.then( function (body) {
      highlightVideo.style.background = `linear-gradient( rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url('${body.backdrop_path}') no-repeat center / cover`

      highlightRating.textContent = body.vote_average;
      highlightTitle.textContent = body.title;
      highlightDescription.textContent = body.overview;

      highlightGenres.textContent = body.genres.map( function(genre){
        return genre.name;
      }).join(', ');
      
      highlightLaunch.textContent = (new Date(body.release_date)).toLocaleDateString('pt-br', {year: "numeric", mouth: "long", day: "numeric"});
    })
  })

  const linkResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

  linkResponse.then( function (response) {
    const bodyPromise = response.json();

    bodyPromise.then( function (body) {
      highlightvideo_link.href = `https://www.youtube.com/watch?v=${body.results[0].key}`
    })
  })
}

function load_movies (){
  const promiseResponse = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

  promiseResponse.then( function (response) {
    const bodyResponse = response.json();

    bodyResponse.then( function (body) {
      movies = body.results;
      display();
    })
  })
}

load_movies();
load_highlight_movies();