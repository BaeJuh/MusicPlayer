class DoublyLinkedList {
	constructor() {
		this._head = null;
		this._tail = null;
		this.size = 0;

		this.test = " "; // print용 임시 변수
	}
	get head() {
		return this._head;
	}
	get tail() {
		return this._tail;
	}

	append(node) {
		if (this.size === 0) {
			this._head = node;
			this._tail = node;
		} else { // 맨 뒤 삽입 기준
			node._prev = this.tail;
			this._tail.next = node;
			this._tail = node;
		}

		this.size++;
	}
	printNodes(node) {
		if (node.next != null) {
			this.test += node.title + " \n ";
			this.printNodes(node.next);
		} else {
			this.test += node.title + " \n ";
			console.log(this.test);
			return
		}
	}
}

class Music {
	constructor(id) {
		this.id = id;
		this.title = "";
		this.singer = "";
		this.cover = ""; // URL
		this.audio = "";

		this._next = null;
		this._prev = null;
	}
	set next(nextNode) {
		this._next = nextNode;
	}
	get next() {
		return this._next;
	}
	set prev(prevNode) {
		this._prev = prevNode;
	}
	get prev() {
		return this._prev;
	}

	setMusicInformation(musicJson) {
		this.title = musicJson[this.id]["title"];
		this.singer = musicJson[this.id]["singer"];
		this.cover = `url("${musicJson[this.id]["cover"]}")`;
		this.audio = `${musicJson[this.id]["audio"]}`;
	}
}

class MusicPlayer {
	constructor(MusicJson) {
		// setting music data
		this.musicJson = MusicJson; // json file
		this.musicList = null; // doubly linked list

		//
		this.currentMusic = null; // Music
		this.isPlaying = false; // 노래가 재생 중이면 True 아니면 False

		// Visible interface HTML Element
		this.playerArea = document.getElementById("playerArea"); // 플레이어 배경
		this.siteBackground = document.getElementById("siteBackground"); // 전체 배경 ( 블러 처리된 )
		this.coverArea = document.getElementById("coverArea"); // 앨범 사진
		this.songTitle = document.getElementById("songTitle"); // 노래 제목
		this.singer = document.getElementById("singer"); // 가수

		this.song = document.getElementById("song");
		this.songControl = document.getElementById("songControl");
		this.playToggle = document.getElementById("playToggle"); // 시작/멈춤 버튼
		this.prevButton = document.getElementById("prev"); // 이전 곡
		this.nextButton = document.getElementById("next"); // 다음 곡
	}

	setMusicList() {
		//console.log( this.musicJson );
		this.musicList = new DoublyLinkedList();
		for (const key in this.musicJson) {
			const music = new Music(key);
			music.setMusicInformation(this.musicJson);

			//console.log( music.title );
			this.musicList.append(music);


		}
		//console.log( this.musicList.tail );
		this.currentMusic = this.musicList.head;

	}

	setInterface() { // 화면 표시/ 노래 세팅
		this.coverArea.style.backgroundImage = this.currentMusic.cover;
		this.siteBackground.style.backgroundImage = this.currentMusic.cover;

		this.song.src = this.currentMusic.audio;
		this.songTitle.innerText = this.currentMusic.title;
		this.singer.innerText = this.currentMusic.singer;

		this.songControl.value = 0;
		this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-pause" : "xi-play"} xi-5x toggleIcon"></i>`
	}

	controlSong() { // 컨트롤 바 기능
		this.songControl.max = this.song.duration;

		this.songControl.addEventListener("input", () => {
			//console.log(this.songControl.value);
			this.song.currentTime = (this.songControl.value * this.song.duration) / 100;
		});
		this.song.addEventListener("timeupdate", () => {
			if (this.isPlaying === true) {
				this.songControl.value = (this.song.currentTime / this.song.duration) * 100;
			}
		});
	}

	clickButtons() {
		this.playToggle.addEventListener("click", () => {
			this.isPlaying = !this.isPlaying;
			if (this.isPlaying === true) {
				this.song.play();
			} else {
				this.song.pause();
			}
			this.playToggle.innerHTML = `<i class="${this.isPlaying ? "xi-pause" : "xi-play"} xi-5x toggleIcon"></i>`
		});
		this.nextButton.addEventListener("click", () => {
			this.currentMusic = this.currentMusic === this.musicList.tail ? this.musicList.head : this.currentMusic.next;
			//this.isPlaying = false;
			this.setInterface();
			if (this.isPlaying === true) {
				this.song.play();
			}
		});

		this.prevButton.addEventListener("click", () => {
			if (this.song.currentTime > (this.song.duration / 10)) {
				this.song.currentTime = 0;
				this.songControl.value = 0;
			} else {
				this.currentMusic = this.currentMusic === this.musicList.head ? this.musicList.tail : this.currentMusic.prev;
				//this.isPlaying = false;
				this.setInterface();
				if (this.isPlaying === true) {
					this.song.play();
				}
			}

		});
	}

	readyForStart() {
		this.setMusicList(); // 노래 데이터 세팅
		this.setInterface(); // 화면 표시
		this.controlSong(); // 노래 재생
		this.clickButtons(); // 이전 / 다음 / 시작 버튼 기능 세팅

		//this.musicList.printNodes( this.currentMusic );
	}
}

const main = (() => {
	console.log("Page is ready");

	const musicPlayer = new MusicPlayer(JSON.parse(JSON.stringify(MusicJson)));
	musicPlayer.readyForStart();
})();

/* 
class Node {
	constructor ( id ) {
		this.id = id; // class Music
		this._next = null;
		this._prev = null;
	}
	set next( nextNode ) {
		this._next = nextNode;
	}
	set prev( prevNode ) {
		this._prev = prevNode;
	}
}

*/