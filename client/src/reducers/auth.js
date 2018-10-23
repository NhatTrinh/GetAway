import { LOGIN_USER, REGISTER_USER, LOGOUT_USER } from '../actions/types';

const INITIAL_STATE = {
  user: null
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGIN_USER:
          return {
            ...state,
            user: action.payload
          };
          
        case REGISTER_USER:
          return {
            ...state,
            user: action.payload
          };

        case LOGOUT_USER:
          return{
            ...state,
            user: null
          }

          default:
            return state;
    }
}