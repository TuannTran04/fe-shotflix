import React from "react";

const Heading = ({ content, styleDiv, styleTitle }) => {
  return (
    <div className={styleDiv}>
      <h3 className={styleTitle}>{content || "ten o day"}</h3>
    </div>
  );
};

export default Heading;
