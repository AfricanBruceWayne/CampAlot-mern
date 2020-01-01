import React, { Component } from 'react';

import CardHeader from './CardHeader';
import CardBody from './CardBody';

class Card extends Component {
    render() {
      return (
        <article className="card">
          <CardHeader category={this.props.details.category} image={this.props.details.image}/>
          <CardBody title={this.props.details.title} description={this.props.details.description}/>
        </article>
      )
    }
}

export default Card;