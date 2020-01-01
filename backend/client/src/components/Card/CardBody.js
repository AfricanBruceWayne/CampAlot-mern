import React, { Component } from 'react';

import Button from './Button';

class CardBody extends Component {
    render() {
      return (
        <div className="card-body">
          <p className="date">March 20 2015</p>
          
          <h2>{this.props.title}</h2>
          
          <p className="body-content">{this.props.description}</p>
          
          <Button />
        </div>
      )
    }
}

export default CardBody;