//https://pixabay.com/api/

// Your API key: 33017340-1f495014f3d6cee1ab5507ad9

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import renderGallery from './js/render-gallery';
import getApi from './js/show-results';

const gallery = document.querySelector('.gallery');
const input = document.querySelector('[name=searchQuery]');
const form = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;

form.addEventListener('submit', showResults);

loadMoreButton.addEventListener('click', loadMore);

async function showResults(event) {
    event.preventDefault();
    const inputValue = input.value;
    if (inputValue === "") {
        Notiflix.Notify.warning('Write something in the input field');
        return
    }
    page = 1;
    loadMoreButton.hidden = true;
    gallery.innerHTML = '';
    getApi(inputValue, page)
        .then(images => {
            const totalHits = images.totalHits;
            if (page < Math.ceil(totalHits / 40)) {
                loadMoreButton.hidden = false;
            }
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            renderGallery(images);
        })
        .catch(error => {
            console.log(error.message)
        }) 
}

function loadMore() {
    page += 1;
    const inputValue = input.value;

    getApi(inputValue, page)
        .then(data => {
            const totalPages = Math.ceil(data.totalHits / 40);
            if (page >= totalPages) {
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                loadMoreButton.hidden = true;
            } 
            renderGallery(data);
        })
}

