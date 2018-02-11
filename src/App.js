import React from 'react';
import { Provider } from 'react-redux';
import store, { loadFromStorage } from './redux/store';
import Main from './components/Main';

class App extends React.Component {
  componentWillMount() {
    loadFromStorage(store);
  }
  
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
