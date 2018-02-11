import { applyMiddleware, createStore } from 'redux';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage-map';
import optimistPromiseMiddleware from 'redux-optimist-promise';

import debounceDecorator from 'redux-storage-decorator-debounce';
import objectToPromise from 'redux-object-to-promise';

import reducer from './reducers';

const storedDucks = ['characters'];

let engine = createEngine({
  got_search_engine: storedDucks,
});

// This is a decorator so we don't call the expensive REDUX_STORAGE_SAVE action too much
engine = debounceDecorator(engine, 1000);

const middlewares = [
  storage.createMiddleware(engine),
  objectToPromise({
    axiosOptions: { baseURL: 'https://api.got.show/api', timeout: 10000 },
  }),
  optimistPromiseMiddleware({ throwOnReject: false }),
];

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const store = createStoreWithMiddleware(storage.reducer(reducer));

export const loadFromStorage = _store => {
  return storage.createLoader(engine)(_store);
};

export default store;
