//https://pixabay.com/api/

// Your API key: 33017340-1f495014f3d6cee1ab5507ad9

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

import Notiflix from 'notiflix';
import axios from "axios";
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector('[name=searchQuery]');
const searchButton = document.querySelector('.search-form > button');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
const per_page = 40;

searchButton.addEventListener('click', showResults);

loadMoreButton.addEventListener('click', loadMore);

async function showResults(event) {
    event.preventDefault();
    const inputValue = input.value;
    if (inputValue === "") {
        Notiflix.Notify.warning('Write something in the input field');
        return
    }
    getApi(inputValue, page)
        .then(images => {
            const totalHits = images.totalHits;
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            renderGallery(images);
            loadMoreButton.hidden = false;
        })
        .catch(error => {
            console.log(error.message)
        }) 
}

async function getApi(text, page = 1) {
    const baseUrl = "https://pixabay.com/api/";
    const GLOBAL_KEY = "33017340-1f495014f3d6cee1ab5507ad9&q"

    const response = await axios.get(`${baseUrl}?key=${GLOBAL_KEY}=${text}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`);

    if (response.data.hits.length === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    }

    return await response.data;
}

function renderGallery(data) {
    const markup = data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
                `<a class="gallery__item" href="${largeImageURL}">
                    <div class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                        <div class="info">
                            <p class="info-item">
                                <b>Likes</b>
                                ${likes}
                            </p>
                            <p class="info-item">
                                <b>Views</b>
                                ${views}
                            </p>
                            <p class="info-item">
                                <b>Comments</b>
                                ${comments}
                            </p>
                            <p class="info-item">
                                <b>Downloads</b>
                                ${downloads}
                            </p>
                        </div>
                    </div>
                </a>`
            ).join('');
            gallery.insertAdjacentHTML('beforeend', markup);
}

function loadMore() {
    page += 1;
    const inputValue = input.value;

    getApi(inputValue, page)
        .then(data => {
            const totalPages = data.totalHits / per_page;
            if (page >= totalPages) {
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                loadMoreButton.hidden = true;
                return
            } 
            renderGallery(data);
        })
}

