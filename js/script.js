const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
songs = [];
async function fetchMovies() {
    const response = await fetch('https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1');
    // waits until the request completes...
    const names = await response.json();
    names.data.song.forEach(name => {
        app.songs.push(
            {
                name: name.name,
                singer: name.artists_names,
                path: `http://api.mp3.zing.vn/api/streaming/audio/${name.id}/320`,
                thumbnail: name.thumbnail,
            }
        )
    });
    app.start();
  }
fetchMovies()
arr = ["hien", "đep"];

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
    songs: [],
    render: function (name) {
        const htmls = this.songs.map(song => {
            if (name == song.name) {
                return `
                    <div class="song streaming">
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
            } else {
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
            }
            
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
        heading.textContent = this.currentSong.name + ' - ' + this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
        audio.src = this.currentSong.path;
        this.render(this.currentSong.name);
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
    },
}

