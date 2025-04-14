import './style.css'
import config from './../config.json' assert { type: 'json' }; 

const API_KEY = config.YOUTUBE_API_KEY;
const PLAYLIST_ID = config.PLAYLIST_ID;

window.addEventListener("DOMContentLoaded", () => fetchPlaylistItems(PLAYLIST_ID, API_KEY))


async function fetchPlaylistItems(playlistId, apiKey) {
  let videoItems = [];
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;

  try {
      while (url) {
          const response = await fetch(url);
          const data = await response.json();
          videoItems = videoItems.concat(data.items); // Добавляем текущие видео в общий массив

          // Если есть следующий токен, добавляем его к URL для следующего запроса
          url = data.nextPageToken
              ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50&pageToken=${data.nextPageToken}`
              : null;
      }

      return videoItems;

  } catch (error) {
      console.error('Error fetching playlist items:', error);
      return null;
  }
}

fetchPlaylistItems(PLAYLIST_ID, API_KEY)
  .then(videoItems => {
      const videoList = document.getElementById('videoList');
      if (videoItems) {
          videoItems.forEach(item => {
              const listItem = document.createElement('li');
              listItem.textContent = `Title: ${item.snippet.title}, Video ID: ${item.snippet.resourceId.videoId}`;
              videoList.appendChild(listItem);
          });
      }
  });