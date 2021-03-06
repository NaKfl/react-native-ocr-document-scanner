import {createStore, applyMiddleware} from 'redux';
import {Alert} from 'react-native';
import {Page} from 'react-native-scanbot-sdk';
import thunk from 'redux-thunk';
import axios from 'axios';
import {AsyncStorage} from 'react-native';

export type ScannedPagesState = {
  pages: Page[],
};

const LOCAL_IP = '192.168.1.2';

import * as actionType from './actionType';

const reducer = (state: ScannedPagesState = {pages: []}, action) => {
  switch (action.type) {
    case actionType.ACTION_ADD_PAGES:
      return addPages(action.pages, state);
    case actionType.ACTION_REMOVE_ALL_PAGES:
      return removeAllPages();
    case actionType.ACTION_REMOVE_PAGE:
      return removePage(action.page, state);
    case actionType.ACTION_UPDATE_OR_ADD_PAGE:
      return updateOrAddPage(action.page, state);
    case actionType.ACTION_SIGN_UP:
      return signUp(action.user, action.navigation, state);
    case actionType.ACTION_LOGIN:
      return login(action.user, action.navigation, state);
    default:
      return state;
  }
};

function addPages(pages: Page[], state: ScannedPagesState): ScannedPagesState {
  return {pages: state.pages.concat(pages)};
}

function removeAllPages(): ScannedPagesState {
  return {pages: []};
}

function removePage(page: Page, state: ScannedPagesState): ScannedPagesState {
  let pages = state.pages;
  const index = pages.findIndex(p => p.pageId === page.pageId);
  if (index !== -1) {
    pages = [...pages];
    pages.splice(index, 1);
  }
  return {pages};
}

function updateOrAddPage(
  page: Page,
  state: ScannedPagesState,
): ScannedPagesState {
  let updated = false;
  const pages = [...state.pages];
  for (let i = 0; i < pages.length; ++i) {
    if (pages[i].pageId === page.pageId) {
      pages[i] = page;
      updated = true;
      break;
    }
  }
  if (!updated) {
    pages.push(page);
  }
  return {pages};
}

function signUp(user, navigation, state) {
  axios({
    method: 'post',
    url: `http://${LOCAL_IP}:3000/account/signup`,
    data: user,
  })
    .then(result => {
      console.log(result.data);
      showAlert('Congratulations', `${result.data}`);
      navigation.goBack();
    })
    .catch(err => {
      console.log(err.response.data);
      showAlert('Warning !', `${err.response.data}`);
    });
}

function login(user, navigation, state) {
  axios({
    method: 'post',
    url: `http://${LOCAL_IP}:3000/account/login`,
    data: user,
  })
    .then(async result => {
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
      navigation.push('Home');
    })
    .catch(err => {
      console.log(err.response.data);
      showAlert('Warning !', `${err.response.data}`);
    });
}

function showAlert(title: string, message: string, delayed: boolean = false) {
  if (delayed) {
    setTimeout(() => {
      Alert.alert(title, message);
    }, 200);
  } else {
    Alert.alert(title, message);
  }
}

export default createStore(reducer, applyMiddleware(thunk));
