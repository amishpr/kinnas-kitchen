import React from "react";
import { ScaleLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = ({ show }) =>
  show && (
    <Box
      position="fixed"
      dangerouslySetInlineStyle={{
        __style: {
          top: 300,
          left: "50%"
        }
      }}
    >
      <ScaleLoader color="purple" size={25} margin={5} />
    </Box>
  );

export default Loader;
