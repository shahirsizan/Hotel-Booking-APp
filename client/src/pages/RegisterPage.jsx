import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
	const [redirect, setRedirect] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const { user, setUser } = useContext(UserContext);

	async function registerUser(e) {
		e.preventDefault();
		try {
			const { data } = await axios.post("/register", {
				name,
				email,
				password,
			});

			console.log(
				"data.userDataWithoutPass after registration is: ",
				data.userDataWithoutPass
			);

			if (data.userDataWithoutPass) {
				setRedirect(true);
			}

			alert("Registration successful. You can now log in");
		} catch (error) {
			alert("Registration failed: ", error);
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
			<div className="mb-64 ">
				<h1 className="text-4xl text-center mb-5">Register</h1>

				<form
					className="max-w-lg mx-auto"
					onSubmit={(e) => {
						registerUser(e);
					}}
				>
					<input
						type="text"
						placeholder="John Doe"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="your@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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

					<button className="p-2 w-full rounded-full bg-red-600 text-white">
						Register
					</button>

					<div className="text-center py-2">
						Already a member?{" "}
						<Link className="underline text-black" to={"/login"}>
							Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
