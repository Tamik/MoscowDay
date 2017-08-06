import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import { Main, Favorites, Radar } from './pages';

const eventsIcon = <FontIcon className='material-icons'>home</FontIcon>;
const favoritesIcon = <FontIcon className='material-icons'>f</FontIcon>;
const radarIcon = <FontIcon className='material-icons'>r</FontIcon>;

class Application extends Component {
  state = {
    selectedIndex: 0,
    redirect: false,
    route: '/',
  }
  select(index, route) {
    this.setState({
      selectedIndex: index,
      redirect: true,
      route: route,
    });
  }
  render() {
    return (
      <Router>
        <div>
          <div>
            <Route exact path='/' component={Main} />
            <Route path='/favorites' component={Favorites} />
            <Route path='/radar' component={Radar} />
          </div>
          <div>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
               <Link to='/' replace> 
                <BottomNavigationItem label='1' icon={eventsIcon} onTouchTap={() => this.select(0, '/')} />
               </Link> 
               <Link to='/favorites' replace> 
                <BottomNavigationItem label='2' icon={favoritesIcon} onTouchTap={() => this.select(1, '/favorites')} />
               </Link> 
               <Link to='/radar' replace> 
                <BottomNavigationItem label='3' icon={radarIcon} onTouchTap={() => this.select(2, '/radar')} />
               </Link> 
            </BottomNavigation>
          </div>
        </div>
      </Router>
    );
  }
}

export default Application;
