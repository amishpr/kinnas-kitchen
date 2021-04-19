import React from "react";
import { Box, Toast } from "gestalt";

const ToastMessage = ({ show, message }) =>
  show && (
    <Box
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 500,
          left: "50%",
          transform: "translateX(-50%)"
        }
      }}
      position="fixed"
    >
      <Toast color="purple" text={message} />
    </Box>
  );

export default ToastMessage;
