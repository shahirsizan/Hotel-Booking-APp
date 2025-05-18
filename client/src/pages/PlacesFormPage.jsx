import PhotosUploader from "../PhotosUploader.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";

export default function PlacesFormPage() {
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [photoLink, setPhotoLink] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [description, setDescription] = useState("");
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [maxGuests, setMaxGuests] = useState(1);
	const [price, setPrice] = useState(100);
	const [ready, setReady] = useState(false);

	const [redirect, setRedirect] = useState(false);

	const { id } = useParams();
	useEffect(() => {
		// no `id`, means new place, do nothing
		if (id === undefined) {
			setReady(true);
		}
		// `id` exists, means existing place, so edit
		else {
			axios.get("/places/" + id).then((response) => {
				const { data } = response;
				setTitle(data.title);
				setAddress(data.address);
				setAddedPhotos(data.photos);
				setDescription(data.description);
				setPerks(data.perks);
				setExtraInfo(data.extraInfo);
				setCheckIn(data.checkIn);
				setCheckOut(data.checkOut);
				setMaxGuests(data.maxGuests);
				setPrice(data.price);
				setReady(true);
			});
		}
	}, [id]);

	const savePlace = async (ev) => {
		ev.preventDefault();
		const placeData = {
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
		};

		// new place
		// await axios.post("/places", placeData);
		// setRedirect(true);

		if (id) {
			// update place
			await axios.put("/places", {
				id,
				...placeData,
			});
			setRedirect(true);
		} else {
			// new place
			await axios.post("/places", placeData);
			setRedirect(true);
		}
	};

	function preInput(header, description) {
		return (
			<>
				<h2 className="text-2xl mt-4">{header}</h2>
				<p className="text-gray-500 text-sm">{description}</p>
			</>
		);
	}

	// After form submission, `redirect -> true`, Thus navigate to `places` page
	if (redirect) {
		return <Navigate to={"/account/places"} />;
	}

	if (!ready) {
		return (
			<div className="mt-14 px-5 py-3 bg-gray-200 text-black rounded-xl">
				<h1 className="text-xl text-center font-bold">Loading...</h1>
			</div>
		);
	}

	if (ready) {
		return (
			<div>
				<AccountNav />

				<form
					onSubmit={(ev) => {
						savePlace(ev);
					}}
				>
					{preInput("Title", "Title for your place.")}
					<input
						type="text"
						value={title}
						onChange={(ev) => setTitle(ev.target.value)}
						placeholder="title, for example: My lovely apt"
					/>

					{preInput("Address", "Address to this place")}
					<input
						type="text"
						value={address}
						onChange={(ev) => setAddress(ev.target.value)}
						placeholder="address"
					/>

					{preInput("Photos", "more = better")}
					<PhotosUploader
						addedPhotos={addedPhotos}
						setAddedPhotos={setAddedPhotos}
						photoLink={photoLink}
						setPhotoLink={setPhotoLink}
					/>

					{preInput("Description", "description of the place")}
					<textarea
						value={description}
						onChange={(ev) => setDescription(ev.target.value)}
					/>

					{preInput("Perks", "select all the perks of your place")}
					<div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
						<Perks perks={perks} setPerks={setPerks} />
					</div>

					{preInput("Extra info", "house rules, etc")}
					<textarea
						value={extraInfo}
						onChange={(ev) => setExtraInfo(ev.target.value)}
					/>

					{preInput(
						"Check-in & Check-out times",
						"add check-in and check-out times, max guests"
					)}
					<div className="grid gap-2 grid-cols-2 md:grid-cols-4">
						{/* check-in time */}
						<div>
							<h3 className="mt-2 -mb-1">Check in time</h3>
							<input
								type="text"
								value={checkIn}
								onChange={(ev) => setCheckIn(ev.target.value)}
								placeholder="14:00"
							/>
						</div>
						{/* check-out time */}
						<div>
							<h3 className="mt-2 -mb-1">Check out time</h3>
							<input
								type="text"
								value={checkOut}
								onChange={(ev) => setCheckOut(ev.target.value)}
								placeholder="11:00"
							/>
						</div>
						{/* Max guest */}
						<div>
							<h3 className="mt-2 -mb-1">Max number of guests</h3>
							<input
								type="number"
								value={maxGuests}
								onChange={(ev) => setMaxGuests(ev.target.value)}
							/>
						</div>
						{/* price */}
						<div>
							<h3 className="mt-2 -mb-1">Price per night</h3>
							<input
								type="number"
								value={price}
								onChange={(ev) => setPrice(ev.target.value)}
							/>
						</div>
					</div>

					<button className="bg-red-600 px-8 py-3 rounded-full w-full text-white my-4">
						Save
					</button>
				</form>
			</div>
		);
	}
}
