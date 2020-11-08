import React from 'react';
import axios from 'axios';
import moment from 'moment';
import DataCard from './DataCard';
import countyList from './datas/countyList.json'; // data from https://geo.api.gouv.fr/departements
import Map from './Map';
import APIContext from './APIContext';
import './style/DataByCounty.scss';
import SearchBar from './SearchBar';

class DataByCounty extends React.Component {
  constructor(props) {
    super(props);
    this.signal = axios.CancelToken.source();
    this.state = {
      // initializing the state at null
      countyCode: '', // code postal département sélectionné
      selectedDataToday: '', // données du dep sélectionné
      source: '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countyCode !== this.state.countyCode) {
      this.getCovidData(this.state.countyCode);
    }
  }

  componentWillUnmount() {
    this.signal.cancel('Api is being canceled');
  }

  handleCountyMap = (countyValue) => {
    // getting data from a child element and storing it in the state: get the selected county postal code (not the data)
    this.setState({ countyCode: countyValue });
    this.setState({ source: 'map' });
  };

  handleCountySearchBar = (countyValue) => {
    // getting data from a child element and storing it in the state: get the selected county postal code (not the data)
    this.setState({ countyCode: countyValue });
    this.setState({ source: 'searchbar' });
  };

  getCovidData = (countyCode) => {
    const countyName = countyList.find((element) => element.code === countyCode)
      .nom; // getting the county name according to its code
    const dayMinus1 = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const dayMinus2 = moment().subtract(2, 'days').format('YYYY-MM-DD');
    // const dayMinus3 = moment().subtract(3, 'days').format('YYYY-MM-DD');

    axios
      .get(
        `https://coronavirusapi-france.now.sh/AllDataByDate?date=${dayMinus1}`,
        {
          cancelToken: this.signal.token,
        }
      )
      .then((response) => response.data)
      .then((data) => {
        const dataArray = data.allFranceDataByDate;
        const filteredArray = dataArray.filter(
          (item) => item.nom === countyName
        );
        if (!Object.values(filteredArray[0]).includes(null)) {
          this.setState({
            selectedDataToday: filteredArray[0],
          });
        } else {
          axios
            .get(
              `https://coronavirusapi-france.now.sh/AllDataByDate?date=${dayMinus2}`,
              {
                cancelToken: this.signal.token,
              }
            )
            .then((response) => response.data)
            .then((data2) => {
              const dataArray2 = data2.allFranceDataByDate;
              const filteredArray2 = dataArray2.filter(
                (item) => item.nom === countyName
              );
              if (!Object.values(filteredArray2[0]).includes(null)) {
                this.setState({
                  selectedDataToday: filteredArray2[0],
                });
              }
            });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Error: ', err.message); // => prints: Api is being canceled
        }
      });
  };

  render() {
    return (
      <div className="dataByCounty">
        <h1 className="title">
          Choisissez un département pour connaître son état actuel
        </h1>
        <SearchBar
          onSelectCounty={this.handleCountySearchBar}
          source={this.state.source}
        />
        <div className="dataRow">
          <APIContext.Provider
            value={{ selectedDataToday: this.state.selectedDataToday }}
          >
            <DataCard />
          </APIContext.Provider>
          <Map onSelectCounty={this.handleCountyMap} />
        </div>
      </div>
    );
  }
}

export default DataByCounty;
