import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

export default class Favorites extends Component {
  render() {
    return(
      <div>
        <AppBar title='Избранное' showMenuIconButton={false} />
        <div>This is Favs.</div>
      </div>
    );
  }
}
