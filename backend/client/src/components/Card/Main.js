import React, { Component } from 'react';

import '../../seed';
import Card from './Card';
import Title from './Title';

class Main extends Component {

    constructor() {
        super();
        
        this.state = {
          campgrounds: {}
        }
      
    }

    componentWillMount() {
        this.setState({
            campgrounds: CampgroundData
        });
    }

    render() {
        return (
            <div>
                <header className="app-header"></header>
                <Title />
                <div className="app-card-list" id="app-card-list">
                    {
                      Object
                      .keys(this.state.campgrounds)
                      .map(key => <Card key={key} index={key} details={this.state.campgrounds[key]}/>)
                    }
                </div>
            </div>
        )
  }
}

export default Main;
