const moviesList = document.querySelector('.movies');
const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const btn_theme = document.querySelector('.btn-theme');


const modal = document.querySelector('.modal');
const modal_close = document.querySelector('.modal__close');
const body = document.querySelector('body');
const modal__title = document.querySelector('.modal__title');
const modal__img = document.querySelector('.modal__img');
const modal__description = document.querySelector('.modal__description');
const modal__genres = document.querySelector('.modal__genres');
const modal__average = document.querySelector('.modal__average');


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
const persitedTheme = localStorage.getItem('theme');

let currentTheme = persitedTheme ? persitedTheme : 'light';


function darkTheme() {
  currentTheme = 'dark';
    localStorage.setItem('theme', currentTheme);
    btn_next.src = './assets/seta-direita-branca.svg';
    btn_prev.src = './assets/seta-esquerda-branca.svg';
    currentTheme = 'dark';
    btn_theme.src = './assets/dark-mode.svg';
    body.style.setProperty('--background-color', '#242424');
    body.style.setProperty('--input-border-color', '#fff')
    body.style.setProperty('--color', '#FFF');
    body.style.setProperty('--shadow-color', "0px 4px 8px rgba(255, 255, 225, 0.15)");
    body.style.setProperty('--highlight-background', "#454545");
    body.style.setProperty('--letras-highlight', "#FFF");
}

function lightTheme() {
  currentTheme = 'light';
  localStorage.setItem('theme', currentTheme);
  btn_theme.src = './assets/light-mode.svg';
  btn_next.src = './assets/seta-direita-preta.svg';
  btn_prev.src = './assets/seta-esquerda-preta.svg';
  body.style.setProperty('--background-color', '#fff');
  body.style.setProperty('--input-border-color', '#979797');
  body.style.setProperty('--color', '#000');
  body.style.setProperty('--highlight-background', "#FFF");
  body.style.setProperty('--letras-highlight', "#000");
}

function changeThemes () {
  if(currentTheme === 'light'){
    darkTheme();
  } else {
    lightTheme();
  }

  localStorage.setItem('theme', currentTheme);
}

if(currentTheme === 'light'){
  lightTheme();
} else {
  darkTheme();
}

btn_theme.addEventListener('click', function () {
  changeThemes();  
})

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

modal.addEventListener('click', fecharModal)

modal_close.addEventListener('click', fecharModal);


function fecharModal() {
  modal.classList.add('hidden');
  body.style.overflow = 'auto';
} 

function display (){
  moviesList.textContent = '';
  for (let i = page * 5; i < (page * 5) + 5; i++) {
    const movie = movies[i];
      
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie');
    movieContainer.style.backgroundImage = `url('${movie.poster_path}')`;
 
    movieContainer.addEventListener("click", function () {
      loadMovie(movie.id);
    })

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

      highlightRating.textContent = body.vote_average.toFixed(2);
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

function loadMovie (id){
  modal.classList.remove("hidden");

  body.style.overflow = 'hidden';

  const promiseResponse = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);
  

  promiseResponse.then( function (response) {
    const bodyResponse = response.json();

    bodyResponse.then( function (body) {
      modal__title.textContent = body.title;
      modal__img.src = body.backdrop_path;
      modal__img.alt = body.title;
      modal__description.textContent = body.overview;
      if(!body.overview){
        modal__description.textContent = `O filme ${body.title} não possui uma descrição sobre.`
      };
      modal__average.textContent = body.vote_average.toFixed(2);
      
      modal__genres.textContent = '';
      body.genres.forEach(function (genre) {
        const modalGenre = document.createElement('span');
        modalGenre.classList.add('modal__genre');
        modalGenre.textContent = genre.name;

        console.log(modal__genres);
        modal__genres.append(modalGenre)
      })
    })
  })
}

load_movies();
load_highlight_movies();