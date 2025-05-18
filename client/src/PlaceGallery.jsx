import { useState } from "react";
import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {
	// place object will be
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
	const [showAllPhotos, setShowAllPhotos] = useState(false);

	return (
		<div className="OUTERMOST-DIV relative">
			{/* Popup div */}
			{showAllPhotos && (
				<div className="POPUP-DIV fixed inset-0 z-50 flex items-center justify-center">
					{/* Overlay Background (click outside to close) */}
					<div
						className="OVERLAY-BROTHER-DIV absolute inset-0 bg-black/60 backdrop-blur-sm z-20"
						onClick={() => setShowAllPhotos(false)}
					></div>

					{/* Modal content */}
					<div
						className="MODAL-DIV relative z-30 w-[80vw] h-[90vh] overflow-y-scroll bg-black text-white p-12 gap-4 rounded-2xl"
						onClick={(e) => e.stopPropagation()} // prevent overlay click
					>
						<div className="relative pb-5">
							<h2 className="text-2xl mr-48">
								All photos of{" "}
								<span className="text-3xl font-bold">
									{place.title}
								</span>
							</h2>

							{/* Close Button */}
							<button
								onClick={() => setShowAllPhotos(false)}
								className="fixed right-4 top-4 py-2 px-2 rounded-2xl shadow-md shadow-black bg-white text-black cursor-pointer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-8 h-8"
								>
									<path
										fillRule="evenodd"
										d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>

						{/* Photos */}
						{place.photos?.length > 0 &&
							place.photos.map((photo, idx) => (
								<div
									key={idx}
									className="flex items-center justify-center py-3 overflow-hidden"
								>
									<div key={idx}>
										<Image
											className="max-w-[500px]"
											src={photo}
											alt=""
										/>
									</div>
								</div>
							))}
					</div>
				</div>
			)}

			{/* 3-images div */}
			<div className="3-images-div grid gap-2 grid-cols-[2fr_1fr] rounded-xl overflow-hidden">
				{/* Main image */}

				{place.photos?.[0] && (
					<div>
						<Image
							onClick={() => setShowAllPhotos(true)}
							className="aspect-square object-cover cursor-pointer"
							src={place.photos[0]}
						/>
					</div>
				)}

				{/* Secondary images */}
				<div className="flex flex-col">
					{place.photos?.[1] && (
						<Image
							onClick={() => setShowAllPhotos(true)}
							className="aspect-square object-cover cursor-pointer"
							src={place.photos[1]}
							alt=""
						/>
					)}

					<div className="overflow-hidden">
						{place.photos?.[2] && (
							<Image
								onClick={() => setShowAllPhotos(true)}
								className="aspect-square object-cover cursor-pointer relative top-2"
								src={place.photos[2]}
								alt=""
							/>
						)}
					</div>
				</div>
			</div>

			{/* show-all-image button */}
			<button
				onClick={() => setShowAllPhotos(true)}
				className="show-all-image-button flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl cursor-pointer hover:shadow-lg hover:bg-gray-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-6 h-6"
				>
					<path
						fillRule="evenodd"
						d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
						clipRule="evenodd"
					/>
				</svg>
				Show more photos
			</button>
		</div>
	);
}
