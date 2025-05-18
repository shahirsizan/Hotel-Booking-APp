import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";

export default function BookingWidget({ place }) {
	// `place` state object will be
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
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [numberOfGuests, setNumberOfGuests] = useState(1);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [redirect, setRedirect] = useState("");
	const { user } = useContext(UserContext);

	// There are many states that will change.
	// we want the useEffect to run only when `user` state changes.
	useEffect(() => {
		if (user) {
			setName(user.name);
		}
	}, [user]);

	let numberOfNights = 0;
	if (checkIn && checkOut) {
		numberOfNights = differenceInCalendarDays(
			new Date(checkOut),
			new Date(checkIn)
		);
	}

	const bookThisPlace = async () => {
		const dataObj = {
			checkIn,
			checkOut,
			numberOfGuests,
			name,
			phone,
			place: place._id,
			price: numberOfNights * place.price,
		};
		const response = await axios.post("/bookings", dataObj);
		const bookingId = response.data._id;
		setRedirect(`/account/bookings/${bookingId}`);
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<div className="bg-white shadow p-4 rounded-2xl">
			<div className="text-2xl text-center">
				Price: ${place.price} / per night
			</div>

			<div className="border rounded-2xl mt-4">
				<div className="flex">
					<div className="py-3 px-4">
						<label>Check in:</label>
						<input
							type="date"
							value={checkIn}
							onChange={(ev) => setCheckIn(ev.target.value)}
						/>
					</div>

					<div className="py-3 px-4 border-l">
						<label>Check out:</label>
						<input
							type="date"
							value={checkOut}
							onChange={(ev) => setCheckOut(ev.target.value)}
						/>
					</div>
				</div>

				<div className="py-3 px-4 border-t">
					<label>Number of guests:</label>
					<input
						type="number"
						value={numberOfGuests}
						onChange={(ev) => setNumberOfGuests(ev.target.value)}
					/>
				</div>

				{/* If dates selected, show `name-phone` section */}
				{numberOfNights > 0 && (
					<div className="py-3 px-4 border-t">
						<label>Your full name:</label>
						<input
							type="text"
							value={name}
							onChange={(ev) => setName(ev.target.value)}
						/>
						<label>Phone number: </label>
						<input
							type="tel"
							value={phone}
							placeholder="018..."
							onChange={(ev) => setPhone(ev.target.value)}
						/>
					</div>
				)}
			</div>

			<button
				onClick={(ev) => {
					bookThisPlace(ev);
				}}
				className="bg-red-600 rounded-full mt-2 text-white py-2 w-full max-w-lg cursor-pointer"
			>
				Book this place
				{numberOfNights > 0 && (
					<span> ${numberOfNights * place.price}</span>
				)}
			</button>
		</div>
	);
}
