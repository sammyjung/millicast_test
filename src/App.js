import './App.css';
import Header from './components/Header';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Main from './components/Main';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Header} />
          <Route path="/master" component={Main} />
          <Route path="/subscribe" component={Header} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
