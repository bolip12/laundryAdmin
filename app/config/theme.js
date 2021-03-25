import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "green",
    accent: "black",
    background: "white",
    surface: "white",
    text: "green",
    placeholder: "green",
    disabled: "green",
  },
  //fonts: "regular",
};

export default theme;

