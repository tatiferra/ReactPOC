import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import Home1 from './Home1';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
        <div>
        {/*<NavMenu />*/}
        <Home1 />
        <Container>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
