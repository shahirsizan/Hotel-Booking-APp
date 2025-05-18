import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function IndexPage() {
	const [places, setPlaces] = useState([]);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const callFunc = async () => {
			const response = await axios.get("/places");
			setPlaces(response.data);
			console.log("response.data in index.jsx: ", response.data);
			setReady(true);
		};

		callFunc();
	}, []);

	if (!ready) {
		return (
			<div className="mt-14 px-5 py-3 bg-gray-200 text-black rounded-xl">
				<h1 className="text-xl text-center font-bold">
					Loading all the places...
				</h1>
			</div>
		);
	}

	if (ready) {
		return (
			<div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{places.length > 0 &&
					places.map((place, idx) => {
						return (
							<Link key={idx} to={"/place/" + place._id}>
								<div className="bg-gray-500 mb-2 rounded-2xl overflow-hidden flex">
									{place.photos?.[0] && (
										<Image
											className="object-cover aspect-square"
											src={place.photos?.[0]}
											alt=""
										/>
									)}
								</div>

								<h2 className="font-bold">{place.address}</h2>
								<h3 className="text-sm text-gray-500">
									{place.title}
								</h3>
								<div className="mt-1">
									<span className="font-bold">
										${place.price}
									</span>{" "}
									per night
								</div>
							</Link>
						);
					})}
			</div>
		);
	}
}
