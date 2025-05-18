import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { data } from "autoprefixer";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
	const [user, setUser] = useState();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const callTheFunc = () => {
			if (!user) {
				axios.get("/profile").then(({ data }) => {
					setUser(data);
					setReady(true);
					console.log("userData from UserContext.jsx: ", data);
					// `console.log(anyStateVariable)` will print null because it is async.
					// log takes place even before the value gets assigned
				});
			}
		};

		callTheFunc();
	}, [user]);

	return (
		<UserContext.Provider value={{ user, setUser, ready }}>
			{children}
		</UserContext.Provider>
	);
}
