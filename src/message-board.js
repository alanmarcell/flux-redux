import { createStore, combineReducers } from 'redux';
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';


const defaultState = {
  messages: [{
    date: new Date('2016-10-10 10:11:55'),
    postedBy: 'Stan',
    content: 'I <3 the new productivity app!'
  },
  {
    date: new Date('2016-11-11 11:11:55'),
    postedBy: 'Alan',
    content: 'The new productivity app is awesome!'
  },
  {
    date: new Date('2016-12-12 12:11:55'),
    postedBy: 'Angelo',
    content: 'It have no bugs!'
  }, {
    date: new Date('2016-7-7 7:11:55'),
    postedBy: 'Pedro',
    content: 'Nice app!'
  }, ],
  userStatus: ONLINE
}

const userStatusReducer = (state = defaultState.userStatus, { type, value }) => {
  switch (type) {
    case UPDATE_STATUS:
      return value
      break;
  }
  return state;
}

const messagesReducer = (state = defaultState.messages, { type, value, postedBy, date }) => {
  switch (type) {
    case CREATE_NEW_MESSAGE:
      const newState = [{ date, postedBy, content: value }, ...state]
      return newState;
  }
  return state;
}

const combinedReducer = combineReducers({
  userStatus: userStatusReducer,
  messages: messagesReducer
})

const store = createStore(combinedReducer);

document.forms.newMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = e.target.newMessage.value;
  const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).username : 'Alan';
  store.dispatch(newMessageAction(value, username));
})

const render = () => {
  const {
    messages,
    userStatus
  } = store.getState();

  document.getElementById("messages").innerHTML = messages
    .sort((a, b) => b.date - a.date)
    .map(message => (
      `<div> 
                ${message.postedBy} : ${message.content}
            </div>`
    )).join('');

  document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
  document.forms.newMessage.newMessage.value = '';
}

const stausUpdateAction = (value) => {
  return {
    type: UPDATE_STATUS,
    value
  }
}
const newMessageAction = (content, postedBy) => {
  const date = new Date();
  return {
    type: CREATE_NEW_MESSAGE,
    value: content,
    postedBy,
    date
  }
}

document.forms.selectStatus.status.addEventListener('change', (e) => {
  store.dispatch(stausUpdateAction(e.target.value));
})

render();

store.subscribe(render);
