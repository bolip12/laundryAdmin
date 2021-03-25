import * as React from 'react';

const clearPhoneNumber = (param) => {
    const value = param ? param : '';
    const number = value ? value.toString().replace(/\D/g,'') : 0;
    const result = number.length > 0 && number.substring(0, 2) == '62' ? number.replace('62','0') : number;
    return result;
}

export default clearPhoneNumber;