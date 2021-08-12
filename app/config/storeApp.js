import { createStore } from 'redux'

const defaultState = {
  isLogin: false,
  uid: '',
  pid: '',
  dbid: '',
  cid: '',
  cidOrigin: '',
  uEmail: null,
  uNama: null,
  uNamaUsaha: null,

  isLoading:false,

  notifDisplay: false,
  notifType: '',
  notifMessage: '',

  docId: 0,
  docData: [],

  userTabId: 0,


};

//rejuicer
const storeApp = (state = defaultState, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {...state,
          isLogin: action.payload.isLogin,
          uid: action.payload.uid,
          pid: action.payload.pid,
          dbid: action.payload.dbid,
          cid: action.payload.cid,
          cidOrigin: action.payload.cidOrigin,
          uEmail: action.payload.uEmail,
          uNama: action.payload.uNama,
          uNamaUsaha: action.payload.uNamaUsaha,
        };
    case 'LOADING':
      return {...state,
          isLoading: action.payload.isLoading,
        };
    case 'NOTIF':
      return {...state,
          notifDisplay: action.payload.notifDisplay,
          notifType: action.payload.notifType,
          notifMessage: action.payload.notifMessage, 
        };
    case 'DETAIL':
      return {...state,
          docId: action.payload.docId,
          docData: action.payload.docData,
        };
    
    case 'USERTAB':
      return {...state,
          userTabId: action.payload.userTabId,
        };
    
  }
};

export default createStore(storeApp);
