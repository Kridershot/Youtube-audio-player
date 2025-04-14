// Глобальная переменная для плеера
let player;

// Функция, вызываемая API после загрузки
export function onYouTubeIframeAPIReady(videoId) {
    player = new YT.Player('player', {
        height: '640',
        width: '480',
        videoId: videoId, // Замените на ID нужного видео
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    setupEventListeners();
}

// Функция, выполняемая, когда плеер готов
function onPlayerReady(event) {
    const totalTime = player.getDuration(); // Получаем текущее время
    document.getElementById('timeline').max = totalTime;
    document.getElementById('totalTime').innerText = formatTime(totalTime);
    event.target.playVideo();
}

function startTimeUpdate() {
    setInterval(() => {
        const currentTime = player.getCurrentTime(); // Получаем текущее время
        document.getElementById('timeline').value = currentTime;
        document.getElementById('currentTime').innerText = formatTime(currentTime); // Обновляем элемент
    }, 1000); // Обновляем каждую секунду
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Добавляем ведущий ноль к секундам
}

// Функция, выполняемая при изменении состояния плеера
function onPlayerStateChange(event) {
    startTimeUpdate(); // Начинаем обновление времени
}

// Обработчик событий нажатия кнопок
function setupEventListeners() {
    document.getElementById('timeline').addEventListener('change', (target) => {
        player.seekTo(target.target.value, true);
        
    });

    document.getElementById('playButton').addEventListener('click', function() {
        player.playVideo();
    });

    document.getElementById('pauseButton').addEventListener('click', function() {
        player.pauseVideo();
    });

    document.getElementById('stopButton').addEventListener('click', function() {
        player.stopVideo();
    });
}
