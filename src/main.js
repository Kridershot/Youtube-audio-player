import './style.css'
import config from './../config.json' assert { type: 'json' }; 
import { onYouTubeIframeAPIReady } from './player';

const API_KEY = config.YOUTUBE_API_KEY;

const playlistTextbox = document.getElementById("playlistTextbox");
const messageElem = document.getElementById("message");

let videoItems = [];

const playerManager = () => {
  console.log(videoItems);
  
  onYouTubeIframeAPIReady(videoItems[0].snippet.resourceId.videoId);
}

document.getElementById("submitPlaylistBtn").addEventListener('click', () => {
  messageElem.textContent = "";
  fetchPlaylistItems(playlistTextbox.value, API_KEY)
  .then(videoItems => {
      const videoList = document.getElementById('videoList');
      console.log(videoItems);
      
      if (videoItems) {
          videoItems.forEach(item => {
              const listItem = document.createElement('li');
              listItem.textContent = `Title: ${item.snippet.title}, Video ID: ${item.snippet.resourceId.videoId}`;
              videoList.appendChild(listItem);
          });
          playerManager();
      }
  })
})

async function fetchPlaylistItems(playlistId, apiKey) {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50`;

  try {
      while (url) {
          const response = await fetch(url);
          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error ? errorData.error.message : 'Unknown error occurred';
            throw new Error(`Error ${response.status}: ${errorMessage}`);
          }
          const data = await response.json();

          videoItems = videoItems.concat(data.items); // Добавляем текущие видео в общий массив

          // Если есть следующий токен, добавляем его к URL для следующего запроса
          url = data.nextPageToken ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}&maxResults=50&pageToken=${data.nextPageToken}` : null;
      }

      return videoItems;

  } catch (error) {
      messageElem.textContent = "Playlist not accesable";
      console.error(error);
      return null;
  }
}