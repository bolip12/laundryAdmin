import * as React from 'react';
import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  Appbar: {
    backgroundColor: theme.colors.background,
  },
  AppbarBack: {
    marginRight: -10,
  },
  FlatList: {
    backgroundColor: theme.colors.background,
  },
  TextInput: {
    marginHorizontal:10,
    backgroundColor: theme.colors.background,
  },
  HelperText: {
    marginHorizontal:10,
  },
  Button: {
  	margin:10,
  },
  ButtonDelete: {
    marginHorizontal:10,
  },
  FAB: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  },
  Chip: {
    borderColor: theme.colors.primary,
    margin: 5,
  },
  Caption: {
    fontSize: 14,
  },
  Subheading: {
    fontSize: 17, 
    textAlign: 'right',
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  ScrollView: {
    backgroundColor: '#ffffff',
  }
});

