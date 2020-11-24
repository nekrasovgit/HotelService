import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Register from './Components/Register';
import Authenticate from './Components/Authenticate';
import Welcome from './Components/Welcome';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/authenticate" component={Authenticate} />
          <Route path="/" component={Welcome} />
        </Switch>
      </div>
    </Router>

    
  );
}

export default App;