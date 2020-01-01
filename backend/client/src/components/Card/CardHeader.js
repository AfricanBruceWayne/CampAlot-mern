import React, { Component } from 'react';

class CardHeader extends Component {
    render() {
      const { image, title } = this.props;
      var style = { 
          backgroundImage: 'url(' + image + ')',
      };
      return (
        <header style={style} className="card-header">
          <h4 className="card-header--title">{title}</h4>
        </header>
      )
    }
}

export default CardHeader;