import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    "html, body": {
      color: "#0d0f45",
    },
  },
};

const components = {};

const fonts = {
  heading: `'Open Sans', sans-serif`,
  body: `'Raleway', sans-serif`,
};

const theme = extendTheme({ styles, fonts });
export default theme;
