import * as React from 'react';
import { DefaultTheme } from 'react-native-paper';

const thousandFormat = (value) => {
    //const numberText = value ? value.toString().replace(/,/g, '') : 0;
    let numberText = value ? value.toString().replace(/\D/g,'') : '';
    numberText = numberText.toString().replace(/\\./g,'');
    let numberLength = numberText.length;

    let numberList = [];
    let increment = 1;
    let lastPos = numberLength;
    let idx=0;
    for(idx=(numberLength-1); idx>=0; idx-=3) {
      let textLen = lastPos > 3 ? 3 : lastPos;
      
      let textPos = numberLength - (increment*3);
      textPos = textPos > 0 ? textPos : 0;
      lastPos = textPos;
      
      numberList.unshift(numberText.substr(textPos, textLen));
      increment++;
    }
    
    const result = numberList.join(',');
    return result;
}

export default thousandFormat;

