import { combineReducers } from 'redux';
import optimist from 'redux-optimist';

import characters from '../ducks/characters';

export default optimist(
  combineReducers({
    characters,
  })
);
