class Music {
	constructor ( id ) {
		this.id = id;
	}
}

const main = (() => {
	console.log("Page is ready");

	const musicList = JSON.parse(JSON.stringify(MusicList));
	console.log(musicList[0]["cover"])
	const coverArea = document.getElementById("coverArea");
	const outBackground = document.getElementById("siteBackground");
	outBackground.style.backgroundImage = `url("${musicList[0]["cover"]}")`;

	coverArea.style.backgroundImage = `url("${musicList[0]["cover"]}")`;
})();