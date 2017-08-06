import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

export default class Radar extends Component {
  render() {
    return(
      <div>
        <AppBar title='Радар' showMenuIconButton={false} />
      </div>
    );
  }
}
