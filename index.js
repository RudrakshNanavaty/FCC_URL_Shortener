const fs = require("fs");
require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());

app.use(express.urlencoded());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

app.post(
	"/",
	(req, res) => {

		const links = fs.readFileSync("links.json");

		let urlList = JSON.parse(links);

		const urlIndex =
			urlList.urls[urlList.urls.length - 1]["short_url"] + 1;

		let longURL =
			(
				req.body.url_input.startsWith('http://')
				||
				req.body.url_input.startsWith('https://')
			)
			? 'https://' + req.body.url_input
			: req.body.url_input;

		const responseJSON =
			{
				original_url: longURL,
				short_url: urlIndex
			};

		urlList.urls.push(responseJSON);

		fs.writeFileSync(
			'links.json',
			JSON.stringify(urlList, null, 4)
		);

		res.status(200).json(responseJSON);
	}
);

app.get(
	'/:id',
	(req, res) => {

		let links = fs.readFileSync("links.json");

		const urlList = JSON.parse(links).urls;

		res.status(200).redirect(urlList[req.params.id]["original_url"]);
	}
);

app.listen(3000, function () {
	console.log(`Listening on port 3000`);
});
