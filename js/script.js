const currrentPage = location.pathname;

class App {
  constructor() {
    this.spinner = document.querySelector('.spinner');
    this.movies = [];
    this.shows = [];
    this.searchResults = [];
    this.currentMovie = null;
    this.currentShow = null;
    this.#initializeEventListeners();
  }

  // INITIALIZE EVENT LISTENERS
  #initializeEventListeners() {
    document
      .querySelector('.search__submitBtn')
      ?.addEventListener('click', this.initializeSearch.bind(this));
  }

  // SHOW SPINNER WHILE FETCHING
  #showSpinner() {
    this.spinner.classList.remove('hide');
  }

  // HIDE SPINNER WHEN DATA IS FETCHED
  #hideSpinner() {
    this.spinner.classList.add('hide');
  }

  // CUSTOM FUNCTION GET FORMATTED DATE
  #getFormattedDate(originalDate) {
    const date = new Date(originalDate);
    return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  // FETCH DATA (MOVIES/SHOWS/DETAILS)
  async #fetchData(url, options) {
    try {
      this.#showSpinner();
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Faild to fetch data');
      const data = await res.json();
      this.#hideSpinner();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // ADD MOVIES TO DOM
  #renderMovies() {
    let moviesContainer = document
      .querySelector('.popularMovies')
      .querySelector('.moviesContainer');
    if (!moviesContainer) {
      document
        .querySelector('.popularMovies')
        .insertAdjacentHTML('beforeend', `<div class='moviesContainer'></div>`);
    }
    moviesContainer = document.querySelector('.moviesContainer');
    moviesContainer.addEventListener(
      'click',
      this.initializeMovieDetails.bind(this)
    );
    this.movies.forEach((movie) => {
      const movieCard = `<div class="movieCard" id=${movie.id}>
      <img
        class="movie__image"
        src=${
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : './images/no-image.jpg'
        }
        alt="movie image"
      />
      <h2 class="movie__title">
        ${movie.original_title}
      </h2>
      <p class="movie__releaseDate">Release Date: ${this.#getFormattedDate(
        movie.release_date
      )}</p>
    </div>`;
      moviesContainer.insertAdjacentHTML('beforeend', movieCard);
    });
  }

  // ADD SHOWS TO DOM
  #renderShows() {
    let showsContainer = document
      .querySelector('.popularShows')
      .querySelector('.showsContainer');
    if (!showsContainer) {
      document
        .querySelector('.popularShows')
        .insertAdjacentHTML('beforeend', `<div class='showsContainer'></div>`);
    }
    showsContainer = document.querySelector('.showsContainer');
    showsContainer.addEventListener(
      'click',
      this.initializeShowDetails.bind(this)
    );
    this.shows.forEach((show) => {
      const showCard = `
      <div class="showCard" id=${show.id}>
        <img class="movie__image" src=${
          show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : './images/no-image.jpg'
        } alt="show image" />
        <h2 class="show__title">${show.original_name}</h2>
        <p class="show__releaseDate">Release Date: ${this.#getFormattedDate(
          show.first_air_date
        )}</p>
      </div>
      `;
      showsContainer.insertAdjacentHTML('beforeend', showCard);
    });
  }

  // ADD MOVIE DETAILS TO DOM
  async #renderMovieDetails() {
    const movie = this.currentMovie;
    const movieDetails = `
          <div class="movieDetails">
            <div class="details__image">
              <img src=${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : './images/no-image.jpg'
              } alt="movie image" />
            </div>
            <div class="details_info">
              <h1 class="info__title">${movie.original_title}</h1>
              <p class="info__rating">🌟 6.5/10</p>
              <p class="info__releaseDate">Release Date: ${this.#getFormattedDate(
                movie.release_date
              )}</p>
              <p class="info__description">
               ${movie.overview}
              </p>
            </div>
          </div>`;
    document
      .querySelector('.movieDetailsContainer')
      .insertAdjacentHTML('beforeend', movieDetails);
    document
      .querySelector('.backToMovies')
      .addEventListener('click', () => window.history.back());
  }

  // ADD SHOW DETAILS TO DOM
  #renderShowDetails() {
    const show = this.currentShow;
    const showDetails = `
    <div class="showDetails">
    <div class="details__image">
    <img src=${
      show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : './images/no-image.jpg'
    } alt="movie image" />
    </div>
    <div class="details_info">
      <h1 class="info__title">${show.original_name}</h1>
      <p class="info__rating">🌟 6.5/10</p>
      <p class="info__releaseDate">Release Date: ${this.#getFormattedDate(
        show.first_air_date
      )}</p>
      <p class="info__description">
       ${show.overview}
      </p>
    </div>
  </div>`;
    document
      .querySelector('.showDetailsContainer')
      .insertAdjacentHTML('beforeend', showDetails);
    document
      .querySelector('.backToShows')
      .addEventListener('click', () => window.history.back());
  }

  // RENDER SERACH RESULTS
  #renderSearchResults(type) {
    let resultsContainer = document
      .querySelector('.results')
      .querySelector('.resultsContainer');
    if (!resultsContainer) {
      document
        .querySelector('.results')
        .insertAdjacentHTML(
          'beforeend',
          `<div class='resultsContainer'></div>`
        );
    }
    resultsContainer = document.querySelector('.resultsContainer');
    resultsContainer.addEventListener('click', (e) => {
      type === 'movie' && this.initializeMovieDetails(e);
      type === 'tv' && this.initializeShowDetails(e);
    });
    this.searchResults.forEach((result) => {
      const resultCard = `<div class="resultCard" id=${result.id}>
      <img
        class="result__image"
        src=${
          result.poster_path
            ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
            : './images/no-image.jpg'
        }
        alt="movie image"
      />
      <h2 class="result__title">
        ${result.original_name || result.original_title}
      </h2>
      <p class="result__releaseDate">Release Date: ${this.#getFormattedDate(
        result.release_date || result.first_air_date
      )}</p>
    </div>`;
      resultsContainer.insertAdjacentHTML('beforeend', resultCard);
    });
  }

  // INITIALIZE MOVIES
  async initializeMovies() {
    const url = 'https://api.themoviedb.org/3/movie/popular';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI',
      },
    };
    const data = await this.#fetchData(url, options);
    this.movies = data.results;
    this.#renderMovies();
  }

  // INITIALIZE SHOWS
  async initializeShows() {
    const url = 'https://api.themoviedb.org/3/tv/popular';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI',
      },
    };
    const data = await this.#fetchData(url, options);
    this.shows = data.results;
    this.#renderShows();
  }

  // INITIALIZE MOVIE DETAILS
  async initializeMovieDetails(e) {
    if (e) {
      if (e.target.classList.contains('moviesContainer')) return;
      let movieId = '';
      movieId = !e.target.classList.contains('movieCard')
        ? e.target.parentElement.id
        : e.target.id;
      window.location = `/movie-details.html?id=${movieId}`;
    } else {
      const movieId = window.location.search.split('=')[1];
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI',
          },
        };
        const movie = await this.#fetchData(url, options);
        this.currentMovie = movie;
        this.#renderMovieDetails();
      } catch (err) {
        console.log(err);
      }
    }
  }

  // INITIALIZE SHOW DETAILS
  async initializeShowDetails(e) {
    if (e) {
      if (e.target.classList.contains('showsContainer')) return;
      let showId = '';
      showId = !e.target.classList.contains('showCard')
        ? e.target.parentElement.id
        : e.target.id;
      window.location = `/show-details.html?id=${showId}`;
    } else {
      const showId = window.location.search.split('=')[1];
      try {
        const url = `https://api.themoviedb.org/3/tv/${showId}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI',
          },
        };
        const show = await this.#fetchData(url, options);
        this.currentShow = show;
        this.#renderShowDetails();
      } catch (err) {
        console.log(err);
      }
    }
  }

  // INITIALIZE SEARCH RESULTS
  async initializeSearch(e) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const url = `https://api.themoviedb.org/3/search/${searchParams.get(
        'type'
      )}?query=${searchParams.get('query')}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI',
        },
      };
      const data = await this.#fetchData(url, options);
      this.searchResults = data.results;
      this.#renderSearchResults(searchParams.get('type'));
    } catch (err) {
      console.log(err);
    }
  }

  // INITIALIZE APP
  init() {
    switch (currrentPage) {
      case '/':
      case '/movies.html':
      case '/movies':
        this.initializeMovies();
      case '/shows.html':
      case '/shows':
        this.initializeShows();
      case '/movie-details.html':
        this.initializeMovieDetails();
      case '/show-details.html':
        this.initializeShowDetails();
      case '/search':
      case '/search.html':
        this.initializeSearch();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App().init();
});
