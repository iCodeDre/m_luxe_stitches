import React from "react";

function Badge({ children }) {
  if (children !== 0) return <p className="badge">{children}</p>;
}

export default Badge;
