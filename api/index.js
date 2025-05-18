const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const mime = require("mime-types");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");

const bcryptSalt = bcrypt.genSaltSync(5);
const jwtSecret = "sizansSecret";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
mongoose.connect(process.env.MONGO_URL);

// async function uploadToS3(path, originalFilename, mimetype) {
// 	const client = new S3Client({
// 		region: "us-east-1",
// 		credentials: {
// 			accessKeyId: process.env.S3_ACCESS_KEY,
// 			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
// 		},
// 	});
// 	const parts = originalFilename.split(".");
// 	const ext = parts[parts.length - 1];
// 	const newFilename = Date.now() + "." + ext;
// 	await client.send(
// 		new PutObjectCommand({
// 			Bucket: bucket,
// 			Body: fs.readFileSync(path),
// 			Key: newFilename,
// 			ContentType: mimetype,
// 			ACL: "public-read",
// 		})
// 	);
// 	return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
// }

app.post("/register", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { name, email, password } = req.body;

	try {
		const userDoc = await User.create({
			name,
			email,
			// password: bcrypt.hashSync(password, bcryptSalt),
			password,
		});
		res.json({ userDataWithoutPass: { name, email } });
	} catch (error) {
		res.status(422).json(error);
	}
});

app.post("/login", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { email, password } = req.body;
	const userDoc = await User.findOne({ email });
	if (userDoc) {
		// const passOk = bcrypt.compareSync(password, userDoc.password);
		const passOk = password === userDoc.password;
		if (passOk) {
			jwt.sign(
				{
					email: userDoc.email,
					id: userDoc._id,
				},
				jwtSecret,
				{},
				(err, token) => {
					if (err) {
						throw err;
					} else {
						let { name, email } = userDoc;
						res.cookie("token", token, {
							httpOnly: true,
							secure: false,
							sameSite: "lax",
						}).json({ name, email });
					}
				}
			);
		} else {
			res.status(422).json("password not ok");
		}
	} else {
		res.json("not found");
	}
});

app.get("/profile", async (req, res) => {
	await mongoose.connect(process.env.MONGO_URL);

	const { token } = req.cookies;
	// res.json({ token });

	// if valid token -> valid user, so send `user-info` to frontend
	if (token) {
		jwt.verify(token, jwtSecret, {}, async (err, userData) => {
			if (err) {
				throw err;
			} else {
				const userDoc = await User.findById(userData.id);
				let { name, email, _id } = userDoc;
				res.json({ name, email, _id });
			}
		});
	} else {
		res.json(null);
	}
});

app.post("/logout", (req, res) => {
	// nullify `token` so that user can't use the token later
	res.cookie("token", "").json({
		success: true,
		message: "Logged out successfully",
	});
});

app.post("/upload-by-link", async (req, res) => {
	try {
		const { link } = req.body;
		const newName = "photo" + Date.now() + ".jpg";

		const { filename } = await imageDownloader.image({
			url: link,
			// dest: "/tmp/" + newName,
			dest: __dirname + "/uploads/" + newName,
		});
		console.log("file newname is: ", newName);
		res.json({ newName });

		// const url = await uploadToS3(
		// 	"/tmp/" + newName,
		// 	newName,
		// 	mime.lookup("/tmp/" + newName)
		// );
		// res.json(url);
	} catch (error) {
		console.log("Error in /upload-by-link API: ", error);
	}
});

const photosMiddleware = multer({ dest: "uploads" });

app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
	console.log(req.files);
	const uploadedFiles = [];
	// add extension to the files
	for (let i = 0; i < req.files.length; i++) {
		const { path, originalname, mimetype } = req.files[i];
		// const url = await uploadToS3(path, originalname, mimetype);
		const extName = originalname.substring(originalname.lastIndexOf("."));
		const newPath = path + extName;
		fs.renameSync(path, newPath);
		uploadedFiles.push(newPath.replace(/uploads\\/g, ""));
	}
	// console.log(uploadedFiles);
	res.json(uploadedFiles);
});
// app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
// 	const uploadedFiles = [];
// 	for (let i = 0; i < req.files.length; i++) {
// 		const { path, originalname, mimetype } = req.files[i];
// 		const url = await uploadToS3(path, originalname, mimetype);
// 		uploadedFiles.push(url);
// 	}
// 	res.json(uploadedFiles);
// });

app.post("/places", (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { token } = req.cookies;

	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
			throw err;
		} else {
			const {
				title,
				address,
				addedPhotos,
				description,
				price,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuests,
			} = req.body;

			const placeDoc = await Place.create({
				owner: userData.id,
				price,
				title,
				address,
				photos: addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuests,
			});
			res.json(placeDoc);
		}
	});
});

app.get("/user-places", (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { token } = req.cookies;
	// if logged-in user, send their places as response
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
			throw err;
		} else {
			const { id } = userData;
			res.json(await Place.find({ owner: id }));
		}
	});
});

app.get("/places/:id", async (req, res) => {
	// info about a particular place should be publicly available
	// so no need to check for token
	mongoose.connect(process.env.MONGO_URL);
	const { id } = req.params;
	res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { token } = req.cookies;

	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
			throw err;
		} else {
			const {
				id,
				title,
				address,
				addedPhotos,
				description,
				perks,
				extraInfo,
				checkIn,
				checkOut,
				maxGuests,
				price,
			} = req.body;

			// check if the user owns the place
			const placeDoc = await Place.findById(id);
			if (userData.id === placeDoc.owner.toString()) {
				placeDoc.set({
					title,
					address,
					photos: addedPhotos,
					description,
					perks,
					extraInfo,
					checkIn,
					checkOut,
					maxGuests,
					price,
				});
				await placeDoc.save();
				res.json("ok");
			}
		}
	});
});

app.get("/places", async (req, res) => {
	// info about all the place should be publicly available
	// so no need to check for token
	mongoose.connect(process.env.MONGO_URL);
	res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
			throw err;
		} else {
			const dataObj = {
				...req.body,
				user: userData.id,
			};
			// console.log(dataObj);
			const doc = await Booking.create(dataObj);
			res.json(doc);
		}
	});
});

app.get("/bookings", async (req, res) => {
	mongoose.connect(process.env.MONGO_URL);
	const { token } = req.cookies;
	jwt.verify(token, jwtSecret, {}, async (err, userData) => {
		if (err) {
			throw err;
		} else {
			const response = await Booking.find({ user: userData.id }).populate(
				"place"
			);
			res.json(response);
		}
	});
});

app.listen(4000);
