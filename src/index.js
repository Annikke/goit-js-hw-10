import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(eve) {
  eve.preventDefault();
  const value = eve.target.value.trim();
  if (value.length === 0) return;
  fetchCountries(value)
    .then(country => {
      if (country.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        resetListAndInfo();
        // return (markup = '');
      }
      if (country.length > 1 && country.length < 11) {
        markup = country.map(createCountriesList).join('');
        return updateCountriesList(markup);
      }
      if (country.length === 1) {
        markup = country.map(createCountryInfo).join('');
        return updateCountryInfo(markup);
      }
    })
    .catch(onError);
}

function resetListAndInfo() {
  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function updateCountriesList(markup) {
  countriesList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function updateCountryInfo(markup) {
  countryInfo.innerHTML = markup;
  countriesList.innerHTML = '';
}

function createCountriesList({ name: { official }, flags: { svg } }) {
  return `<li class="country-item"> <img width="30" height="20" src=${svg} />
     <span> ${official}</span></li>`;
}

function createCountryInfo({
  name: { official },
  capital,
  population,
  flags: { svg },
  languages,
}) {
  return `
      <p> <img width="30" height="20" src=${svg} />
      <span class="country-name">${official}</span></p>
      <p class="country-field"> <span>Capital:</span> ${capital}</p>
      <p class="country-field"> <span>Population:</span> ${population}</p>
      <p class="country-field"> <span>Languages:</span> ${Object.values(languages)}</p>
    `;
}

function onError(err) {
  console.error(err);
  Notify.failure('Oops, there is no country with that name');
}
