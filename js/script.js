const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



// Init app
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const app = {
    currentIndex: 0,
    isPlaying: false,
    songs: [
        {
            name: 'Waiting For You',
            singer: 'MONO',
            path: './audio/WaitingForYou.mp3',
            thumbnail: 'thumbnail/waiting-for-you.jpeg'
        },
        {
            name: 'Hương',
            singer: 'Văn Mai Hương',
            path: './audio/Huong.mp3',
            thumbnail: 'thumbnail/huong.jpeg'
        },
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng M-TP',
            path: './audio/HayTraoChoAnh.mp3',
            thumbnail: 'thumbnail/hay-trao-cho-anh.jpeg'
        },
        {
            name: 'Tòng Phu',
            singer: 'KEYO',
            path: './audio/TongPhu.mp3',
            thumbnail: 'thumbnail/tong-phu.jpeg'
        },
    ],
    render: function () {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.thumbnail}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('\n');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // cd rotation
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ], {
            duration: 15000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Play/Pause playback
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.ontimeupdate = function () {
            currentProgress = Math.floor(audio.currentTime / audio.duration * 1000) / 10;
            console.log(currentProgress);
            progress.value = currentProgress;
        }
        progress.onchange = function () {
            audio.currentTime = audio.duration * this.value / 100;
        }
        nextBtn.onclick = function () {
            _this.nextSong();
            audio.play();
        }
        prevBtn.onclick = function () {
            _this.prevSong();
            audio.play();
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= -1) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    start: function () {
        // Define properties for Object
        this.defineProperties();

        // Event listeners
        this.handleEvents();

        // Load the current song to UI
        this.loadCurrentSong()

        // Render playlists
        this.render();
    },
}

app.start();