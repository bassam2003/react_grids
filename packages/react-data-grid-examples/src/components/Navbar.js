import React, {PropTypes} from 'react';
import ExampleList from './ExampleList';

class Navbar extends React.Component {
  render() { 
    return (
      <div className="navbar navbar-fixed-top headroom" >
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span> </button>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav pull-right">
              <li className="active"><a href="index.html">Home</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Documentation <b className="caret"></b></a>
                <ul className="dropdown-menu">
                  <li><a href="documentation.html#/gettingstarted">Getting Started</a></li>
                  <li><a href="documentation.html#/apireference">API Reference</a></li>
                  <li><a href="documentation.html#/componentsDocs">Documentation</a></li>
                </ul>
              </li>

              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Grids <b className="caret"></b></a>
                <ExampleList links={this.props.exampleLinks} className="dropdown-menu" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  exampleLinks: PropTypes.array.isRequired
};

export default Navbar;
