import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";
import PlacesPage from "./PlacesPage.jsx";

export default function ProfilePage() {
	const [redirect, setRedirect] = useState(null);
	const { user, setUser, ready } = useContext(UserContext);
	// console.log("useparams called in ProfilePage.jsx: ", useParams());
	// `/account` page e gele `useParams() -> undefined` thakbe.
	let { subpage } = useParams();

	const logout = async () => {
		await axios.post("/logout"); // erase user-login-data data in backend
		setRedirect("/");
		setUser(null); // then erase user-login-data in browser
	};

	if (subpage === undefined) {
		subpage = "profile";
	}

	if (!ready) {
		return "Loading...";
	}

	if (ready && !user && !redirect) {
		return <Navigate to={"/login"} />;
	}

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<div>
			<AccountNav />

			{subpage === "profile" && (
				<div className="text-center max-w-lg mx-auto">
					Logged in as {user.name} ({user.email})<br />
					<button
						className="bg-red-600 rounded-full mt-2 text-white py-2  w-full max-w-lg "
						onClick={() => {
							logout();
						}}
					>
						Logout
					</button>
				</div>
			)}

			{subpage === "places" && <PlacesPage />}
		</div>
	);
}
