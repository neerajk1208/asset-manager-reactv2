var React = require('react');
var ReactDOM = require('react-dom');
var rd3 = require('react-d3');

//Above are the dependencies required to render React components. 
//The dependencies also includes react-d3, which is the source of the pie chart. 


//AssetManager is the main container class for this application. 
//I've initialize an initial state which includes the following: 

  //Risk
  //Expected asset allocation - data associated with the graph
  //actual assets - $ value for each asset

//handleChange calls setState to update the risk and expected asset allocation
//handleUpdate called setState to update the actual asset allocation
//handleSubmit generates insights by doing the following
  //tabulating total money allocated in assets
  //generating actual percentages by comparing money allocated to total allocation
  //compare actual to expected percentages to generate insights
  //included a 5% buffer so that insights aren't rendered for minor differences
  //5% is arbitrary and can be easily modified upon application accuracy needs


//ListofInsights is a nested component which refers to the state provided from AssetManager
//List of Insights renders by mapping out the data of insights, which is included as a key/value pair in the state object
//When there are no insights, ListofInsights maps out an empty array, so nothing renders


var AssetManager = React.createClass({
        getInitialState: function() {
          return {
            risk: 5, 
            expected: {
              bonds: 15, 
              stocks: 15, 
              etfs: 10, 
              realEstate: 10, 
              cash: 50
            }, 
            actualBonds: 0, 
            actualStocks: 0, 
            actualEtfs: 0, 
            actualRealEstate: 0, 
            actualCash: 0, 
            insights: []
          }
        }, 
        handleChange: function(e) {
          this.setState({
            risk: e.target.value, 
            expected: {
              bonds: this.props.possibilities[e.target.value][0],
              stocks: this.props.possibilities[e.target.value][1],
              etfs: this.props.possibilities[e.target.value][2],
              realEstate: this.props.possibilities[e.target.value][3],
              cash: this.props.possibilities[e.target.value][4]
            }
          })
        }, 
        handleUpdate: function(name, e) {
          console.log('here is name', name, 'here is e', e.target.value)
          var newState = {};
          newState[name] = Number(e.target.value);
          this.setState(newState)
          console.log(this.state)
        },

        handleSubmit: function(e) {
          e.preventDefault()

          var actualPercents = {
          }
          var totalAmount = 0;
          for (var key in this.state) {
            if (key !== 'risk' && key !== 'expected' && key !== 'insights') {
              totalAmount += this.state[key];
            }
          }

          for (var key in this.state) {
            if (key !== 'risk' && key !== 'expected' && key !== 'insights') {
              actualPercents[key] = Math.round(this.state[key]/totalAmount * 100);
              console.log('hello');
            }
          }
          var insights = [];
          
          if (actualPercents.actualBonds > this.state.expected.bonds + 5) {
            var diff = actualPercents.actualBonds - this.state.expected.bonds;
            insights.push("Decrease your bonds by " + diff + "%.");
          } else if (actualPercents.actualBonds < this.state.expected.bonds - 5 ) {
            var diff = this.state.expected.bonds - actualPercents.actualBonds;
            insights.push("Increase your bonds by " + diff + "%.");
          }

          if (actualPercents.actualStocks > this.state.expected.stocks + 5) {
            var diff = actualPercents.actualStocks - this.state.expected.stocks;
            insights.push("Decrease your stocks by " + diff + "%.");
          } else if (actualPercents.actualStocks < this.state.expected.stocks - 5 ) {
            var diff = this.state.expected.stocks - actualPercents.actualStocks;
            insights.push("Increase your stocks by " + diff + "%.");
          }

          if (actualPercents.actualEtfs > this.state.expected.etfs + 5) {
            var diff = actualPercents.actualEtfs - this.state.expected.etfs;
            insights.push("Decrease your etfs by " + diff + "%.");
          } else if (actualPercents.actualEtfs < this.state.expected.etfs - 5 ) {
            var diff = this.state.expected.etfs - actualPercents.actualEtfs;
            insights.push("Increase your etfs by " + diff + "%.");
          }

          if (actualPercents.actualRealEstate > this.state.expected.realEstate + 5) {
            var diff = actualPercents.actualStocks - this.state.expected.realEstate;
            insights.push("Decrease your real estate by " + diff + "%.");
          } else if (actualPercents.actualRealEstate < this.state.expected.realEstate - 5 ) {
            var diff = this.state.expected.realEstate - actualPercents.actualRealEstate;
            insights.push("Increase your real estate by " + diff + "%.");
          }

          if (actualPercents.actualCash > this.state.expected.cash + 5) {
            var diff = actualPercents.actualCash - this.state.expected.cash;
            insights.push("Decrease your cash by " + diff + "%.");
          } else if (actualPercents.actualCash < this.state.expected.cash - 5 ) {
            var diff = this.state.expected.cash - actualPercents.actualCash;
            insights.push("Increase your cash by " + diff + "%.");
          }

          console.log('here are the insights', insights);
          this.setState({
            insights: insights
          })

          console.log('what is the state obj', this.state);
        },
        render: function() {
          return (
            <div className="assetManager">
              <h1 className="jumbotron"> Asset Manager </h1>

              <p> What does your risk profile look like? </p>
              <button className="btn btn-primary" type="button">
                Risk <span className="badge">{this.state.risk}</span>
              </button>
              <input type="range" name='risk' min='0' max='10' onChange={this.handleChange} />
              <output for="risk" onforminput="value = risk.valueAsNumber;"></output>
              <div>
              <PieChart
                data={[
                  {label: 'Bonds', value: this.props.possibilities[this.state.risk][0]}, 
                  {label: 'Stocks', value: this.props.possibilities[this.state.risk][1]}, 
                  {label: 'ETfs', value: this.props.possibilities[this.state.risk][2]}, 
                  {label: 'Real Estate', value: this.props.possibilities[this.state.risk][3]}, 
                  {label: 'Cash', value: this.props.possibilities[this.state.risk][4]}
                  ]}
                width={400}
                height={300}
                radius={100}
                innerRadius={20}
                sectorBorderColor="white"
                title="Pie Chart"/>
              <span className="testing"> Bonds: {this.props.possibilities[this.state.risk][0]}% </span>
              <span> Stocks: {this.props.possibilities[this.state.risk][1]}% </span>
              <span> ETFs: {this.props.possibilities[this.state.risk][2]}% </span>
              <span> Real Estate: {this.props.possibilities[this.state.risk][3]}% </span>
              <span> Cash: {this.props.possibilities[this.state.risk][4]}% </span>
              </div>
              <h6> <i> What does your current portfolio look like? Please provide $ value for all categories. </i> </h6>
              <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={this.handleUpdate.bind(this, 'actualBonds')} placeholder="Bonds"/>
                <input type="text" onChange={this.handleUpdate.bind(this, 'actualStocks')} placeholder="Stocks"/>
                <input type="text" onChange={this.handleUpdate.bind(this, 'actualEtfs')} placeholder="ETFs"/>
                <input type="text"  onChange={this.handleUpdate.bind(this, 'actualRealEstate')} placeholder="Real Estate"/>
                <input type="text"  onChange={this.handleUpdate.bind(this, 'actualCash')} placeholder="Cash"/>
                <input type="submit"/>
                </form>
              <ListOfInsights {...this.props} data={this.state.insights} />
            </div>
            );
        }
      });

      var Slider = React.createClass({
        render: function() {
          console.log("what is the state now", this.state)
          return (
            <div className="slider">
              Here is the slider
              <input type="text" placeholder="risk number"/>
              <input type="submit"> Hello </input>
            </div>
          );
        }
      });

//Including chart component to modularize code in next iteration
      var Chart = React.createClass({
        render: function() {
          return (
            <div className="chart">
              Here is the chart!
              Here is the set of associated data
            </div>
          );
        }
      });

//Including portfolio component to modularize code in next iteration
      var Portfolio = React.createClass({
        render: function() {
          return (
            <div className="portfolio">
              Please fill in your portfolio inputs
              <input type="text" placeholder="Bonds"/>
              <input type="text" placeholder="Stocks"/>
              <input type="text" placeholder="ETFs"/>
              <input type="text" placeholder="Real Estate"/>
              <input type="text" placeholder="Cash"/>
            </div>
          );
        }
      });

      var ListOfInsights = React.createClass({
        render: function() {
          console.log('here are the insights', this.props.data);
          var list = this.props.data.map(function(insight) {
            return (
              <li className="list-group-item">{insight}</li>
            )
          });

          return (
            <div className="panel panel-default">
              <div className="panel-heading">Recommendations</div>
              <ul className="list-group">
                {list}
              </ul>
            </div>
          );
        }
      });

//Options is the props associated with the application with preset allocations paired with possible risks from 1 - 10
//Options is ordered by the following assets
  //1. Bonds
  //2. Stocks
  //3. ETFs
  //4. Real Estate
  //5. Cash

      var options = {
        possibilities: {
          1: [10, 0, 0, 0, 90],
        2: [10, 10, 0, 0, 80], 
        3: [10, 10, 10, 0, 70], 
        4: [20, 10, 10, 0, 60], 
        5: [15, 15, 10, 10, 50], 
        6: [15, 15, 15, 15, 60], 
        7: [10, 20, 20, 20, 30], 
        8: [5, 30, 10, 30, 20], 
        9: [0, 40, 5, 35, 20], 
        10: [5, 40, 5, 40, 10]
        },
        insights: []
      }

      //Here, I am instantiating the AssetManager and linking the options object to it
      var element = React.createElement(AssetManager, options);

//The virtual DOM renders the AssetManager within the body of the HTML page
//Associated nested components render as well. 
ReactDOM.render(element, document.body);
