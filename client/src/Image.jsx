import React from "react";

const Image = ({ src, ...rest }) => {
	src =
		src && (src.startsWith("http://") || src.startsWith("https://"))
			? src
			: "http://localhost:4000/uploads/" + src;

	return <img {...rest} src={src} />;
};

export default Image;
