import React from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import DataCard from './DataCard';
import countyList from './countyList.json'; //data from https://geo.api.gouv.fr/departements
import Map from './Map';
import moment from 'moment';

class DataByCounty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //initializing the state at null
      countyCode: null, //code postal département sélectionné
      selectedDataToday: null, //données du dep sélectionné
    };
  }

  handleCounty = (countyValue) => {
    //getting data from a child element and storing it in the state: get the selected county postal code (not the data)
    this.setState({ countyCode: countyValue });
  };

  getCovidData = (countyCode) => {
    let countyName = countyList.find((element) => element.code === countyCode)
      .nom; //getting the county name according to its code
    //ici, gérer les cas d'erreur, si les données sont nulles notamment
    let dayMinus1 = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let dayMinus2 = moment().subtract(2, 'days').format('YYYY-MM-DD');
    let dayMinus3 = moment().subtract(3, 'days').format('YYYY-MM-DD');

    //let urlSpecificCounty = `https://coronavirusapi-france.now.sh/LiveDataByDepartement?Departement=${countyName}`;
    axios
      .get(
        `https://coronavirusapi-france.now.sh/AllDataByDate?date=${dayMinus1}`
      )
      .then((response) => response.data)
      .then((data) => {
        let dataArray = data.allFranceDataByDate;
        let filteredArray = dataArray.filter((item) => item.nom === countyName);
        if (!Object.values(filteredArray[0]).includes(null)) {
          console.log(`got data from ${dayMinus1}`);
          this.setState({
            selectedDataToday: filteredArray[0],
          });
        } else {
          axios
            .get(
              `https://coronavirusapi-france.now.sh/AllDataByDate?date=${dayMinus2}`
            )
            .then((response) => response.data)
            .then((data) => {
              let dataArray = data.allFranceDataByDate;
              let filteredArray = dataArray.filter(
                (item) => item.nom === countyName
              );
              if (!Object.values(filteredArray[0]).includes(null)) {
                console.log(`got data from ${dayMinus2}`);
                this.setState({
                  selectedDataToday: filteredArray[0],
                });
              }
            });
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countyCode !== this.state.countyCode) {
      this.getCovidData(this.state.countyCode);
    }
  }

  render() {
    return (
      <div>
        <SearchBar onSelectCounty={this.handleCounty} />
        {this.state.selectedDataToday && (
          <DataCard selectedDataToday={this.state.selectedDataToday} />
        )}
        <Map onSelectCounty={this.handleCounty} />
      </div>
    );
  }
}

export default DataByCounty;
