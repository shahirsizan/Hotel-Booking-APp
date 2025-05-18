import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [redirect, setRedirect] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const [showPass, setShowPass] = useState(false);

	async function handleLoginSubmit(e) {
		e.preventDefault();
		try {
			const { data } = await axios.post(
				"/login",
				{ email, password },
				{ withCredentials: true }
			);
			setUser(data);
			alert("Login successful");
			setRedirect(true);
			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			alert("Login failed");
		}
	}

	useEffect(() => {
		if (user) {
			setRedirect(true);
		}
	}, [user]);

	if (redirect) {
		return <Navigate to={"/account"} />;
	}

	return (
		<div className="mt-20 flex items-center justify-around ">
			<div className="mb-64">
				<h1 className="text-4xl text-center mb-5">Login</h1>

				<form
					className="max-w-lg mx-auto"
					onSubmit={(e) => {
						handleLoginSubmit(e);
					}}
				>
					<input
						type="email"
						value={email}
						placeholder="email"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
					<input
						type={showPass ? "text" : "password"}
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<span>
						<input
							type="checkbox"
							checked={showPass}
							onChange={() => {
								setShowPass((prev) => !prev);
							}}
						/>
						Show Password
					</span>
					<button
						type="submit"
						className="p-2 w-full rounded-full bg-red-600 text-white"
					>
						Login
					</button>

					<div className="text-center py-2">
						Don't have an account?{" "}
						<Link className="underline text-black" to={"/register"}>
							Register now
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
