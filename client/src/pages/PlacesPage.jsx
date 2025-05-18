import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "../AccountNav";
import Image from "../Image";
// import PlaceImg from "../PlaceImg";

export default function PlacesPage() {
	const [places, setPlaces] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const callFunc = async () => {
			const { data } = await axios.get("/user-places");
			setPlaces(data);
			setReady(true);
		};

		callFunc();
	}, []);

	if (!ready) {
		return (
			<div className="mt-14 px-5 py-3 bg-gray-200 text-black rounded-xl">
				<h1 className="text-xl text-center font-bold">Loading...</h1>
			</div>
		);
	}

	if (ready) {
		return (
			<div className="pt-5">
				<AccountNav />

				<div className="text-center">
					<Link
						className="flex max-w-fit gap-1 bg-red-600 text-white py-2 px-6 rounded-full"
						to={"/account/places/new"}
					>
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6"
							>
								<path
									fillRule="evenodd"
									d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
						Add new place
					</Link>
				</div>

				{/* List of the owners places */}
				<div className="mt-4">
					{places.length > 0 &&
						places.map((place, idx) => (
							<Link
								key={idx}
								to={"/account/places/" + place._id}
								className="flex cursor-pointer gap-4 bg-gray-100 p-3 mb-4 rounded-2xl"
							>
								<div className="flex items-center justify-center w-32 h-32 shrink-0 overflow-hidden">
									{/* <PlaceImg place={place} /> */}
									<Image
										className={""}
										src={place.photos[0]}
									/>
								</div>
								<div className="grow-0 shrink">
									<h2 className="text-xl font-medium">
										{place.title}
									</h2>
									<p className="text-sm mt-2">
										{place.description}
									</p>
								</div>
							</Link>
						))}
				</div>
			</div>
		);
	}
	// return (
	// 	<div className="pt-5">
	// 		<AccountNav />

	// 		<div className="text-center">
	// 			<Link
	// 				className="flex max-w-fit gap-1 bg-red-600 text-white py-2 px-6 rounded-full"
	// 				to={"/account/places/new"}
	// 			>
	// 				<span>
	// 					<svg
	// 						xmlns="http://www.w3.org/2000/svg"
	// 						viewBox="0 0 24 24"
	// 						fill="currentColor"
	// 						className="w-6 h-6"
	// 					>
	// 						<path
	// 							fillRule="evenodd"
	// 							d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
	// 							clipRule="evenodd"
	// 						/>
	// 					</svg>
	// 				</span>
	// 				Add new place
	// 			</Link>
	// 		</div>

	// 		{/* List of the owners places */}
	// 		<div className="mt-4">
	// 			{places.length > 0 &&
	// 				places.map((place) => (
	// 					<Link
	// 						// to={"/account/places/" + place._id}
	// 						className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
	// 					>
	// 						<div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
	// 							{/* <PlaceImg place={place} /> */}
	// 							<img
	// 								className="object-cover"
	// 								src={place.photos[0]}
	// 							/>
	// 						</div>
	// 						<div className="grow-0 shrink">
	// 							<h2 className="text-xl">{place.title}</h2>
	// 							<p className="text-sm mt-2">
	// 								{place.description}
	// 							</p>
	// 						</div>
	// 					</Link>
	// 				))}
	// 		</div>
	// 	</div>
	// );
}
