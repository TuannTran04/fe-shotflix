import React, { useState, useRef, useEffect } from "react";

// HOC
export default function withClickOutside(WrappedComponent) {
  const Component = (props) => {
    const [open, setOpen] = useState(false);

    const ref = useRef();

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!ref.current?.contains(event.target)) {
          console.log(event.target);
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
      <WrappedComponent open={open} setOpen={setOpen} ref={ref} {...props} />
    );
  };

  return Component;
}