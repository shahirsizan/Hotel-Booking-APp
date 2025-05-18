import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
// import AddressLink from "../AddressLink";

export default function PlacePage() {
	const { id } = useParams();
	const [place, setPlace] = useState(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const callFunc = async () => {
			//  bujhlam na, :id param thakle tobei na ei page e ashbe.
			// alada kore `id` check korar dorkar ki?
			// if (!id) {
			// 	return;
			// }
			const response = await axios.get(`/places/${id}`);
			setPlace(response.data);
			// console.log(response.data);
			// `place` state will be
			//     {
			//     "_id": "6827059bbcf93a94687bf081",
			//     "owner": "682069ac84bf29a5bdfba366",
			//     "title": "title 1",
			//     "address": "address 1",
			//     "photos": [
			//         "photo1747387736088.jpg",
			//         "photo1747387747536.jpg",
			//         "photo1747387764020.jpg",
			//         "photo1747387774288.jpg",
			//         "photo1747387782130.jpg"
			//     ],
			//     "description": "description 1 owner sizan",
			//     "perks": [
			//         "parking",
			//         "tv",
			//         "pets",
			//         "entrance",
			//         "wifi"
			//     ],
			//     "extraInfo": "Extra info 1",
			//     "checkIn": 14,
			//     "checkOut": 11,
			//     "maxGuests": 5,
			//     "price": 100,
			//     "__v": 0
			// }
			setReady(true);
		};

		callFunc();
	}, [id]);

	if (!ready) {
		return (
			<div className="mt-14 px-5 py-3 bg-gray-200 text-black rounded-xl">
				<h1 className="text-xl text-center font-bold">Loading...</h1>
			</div>
		);
	}

	if (ready) {
		return (
			<div className="mt-2 bg-gray-100 -mx-8 px-8 pt-8">
				<h1 className="text-3xl ">{place.title}</h1>
				<h2 className="pt-2 pb-3">{place.address}</h2>

				{/* Images */}
				<PlaceGallery place={place} />

				{/* Detail */}
				<div className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
					<div>
						<div className="my-4">
							<h2 className="font-semibold text-2xl">
								Description
							</h2>
							{place.description}
						</div>
						Check-in: {place.checkIn}
						<br />
						Check-out: {place.checkOut}
						<br />
						Max number of guests: {place.maxGuests}
					</div>

					<div>
						<BookingWidget place={place} />
					</div>
				</div>

				<div className="bg-white -mx-8 px-8 py-8 border-t">
					<div>
						<h2 className="font-semibold text-2xl">Extra info</h2>
					</div>
					<div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
						{place.extraInfo}
					</div>
				</div>
			</div>
		);
	}
}
