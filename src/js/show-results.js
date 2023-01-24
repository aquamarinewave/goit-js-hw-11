import axios from "axios";
import Notiflix from 'notiflix';

const per_page = 40;

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

export default getApi;