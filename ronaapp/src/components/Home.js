import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete"
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  Legend,
  Title,
  AreaSeries,
  BarSeries
} from "@devexpress/dx-react-chart-material-ui";
import { ValueScale, Stack } from "@devexpress/dx-react-chart";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
      minWidth: 35
    }
  },
  select: {
    marginBottom: theme.spacing(1)
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latest: {},
      daily: {},
      countries: [],
      selectedCountry: "All countries"
    }
  }

  componentDidMount() {
    this.fetchData("All countries");
    this.fetchCountries();
  }

  fetchCountries() {
    fetch("https://covid19-api.com/help/countries?format=json")
      .then((res) => res.json())
      .then((json) => {
        this.setState({ countries: [
          {
            name: "All countries",
            alpha2code: ""
          }, ...json
        ]});
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async fetchData(country) {
    if (country === "All countries") {
      fetch("https://covid19-api.com/totals?format=json")
        .then((res) => res.json())
        .then((json) => {
          let data = json[0];
          this.setState({ latest: { [country]: data } });
        })
        .catch((err) => {
          console.error(err);
        });

      var today = new Date(new Date().setDate(new Date().getDate() - 1));
      var date = new Date(new Date().setDate(today.getDate() - 30));
      
      if (!(country in this.state.daily)) {
        var daily = [];
        while (date < today) {
          let dateString = date.toISOString().split('T')[0];
          await fetch(`https://covid19-api.com/report/totals?date=${dateString}&date-format=YYYY-MM-DD&format=json`)
            .then((res) =>res.json())
            .then((json) => {
              let data = json[0];
              daily.push(data);
            })
            .catch((err) => {
              console.error(err);
            });
          date.setDate(date.getDate() + 1);
        }
        daily.push({
          date: "today",
          recovered: this.state.latest[country].recovered,
          deaths: this.state.latest[country].deaths,
          active: this.state.latest[country].confirmed - this.state.latest[country].recovered - this.state.latest[country].deaths
        });
        this.setState({ daily: { [country] : daily }});
        console.log(this.state.daily)
      }
    }
    else {
      fetch(`https://covid19-api.com/country?name=${country}&format=json`)
        .then((res) => res.json())
        .then((json) => {
          let data = json[0];
          this.setState({ latest: { [country]: data } });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  changeCountry(name) {
    this.setState({ selectedCountry: name });
    this.fetchData(name);
    console.log(this.state.selectedCountry)
  }

  render() {
    const { classes } = this.props;
    const latest = this.state.latest[this.state.selectedCountry];
    const daily = this.state.daily[this.state.selectedCountry];
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3">COVID-19 Stats</Typography>
            <Typography variant="subtitle1">
              All data retrieved from <a href="https://covid19-api.com">covid19-api.com</a>
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4} xl={3}>
            <Paper className={classes.paper} elevation={2}>
              <Typography variant="h5">

              </Typography>
              <Autocomplete
                id="country-select"
                options={this.state.countries}
                className={classes.select}
                classes={{
                  option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(option) => (
                  <>
                    <span>{option.alpha2code}</span>
                    {option.name}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a country"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                  />
                )}
                onChange={(_,option) => {if (option) this.changeCountry(option.name)}}
              />
              <Typography variant="h5">Latest data for <b>{this.state.selectedCountry}</b></Typography>
              {latest ? 
                <Typography variant="body2">Last change: {new Date(latest.lastChange).toLocaleString()}</Typography>
                : <Typography variant="body2">Loading...</Typography>
              }
              <Typography><b>Confirmed:</b> {latest ? latest.confirmed : "..."}</Typography>
              <Typography><b>Recovered:</b> {latest ? latest.recovered : "..."}</Typography>
              <Typography><b>Critical:</b> {latest ? latest.critical : "..."}</Typography>
              <Typography><b>Deaths:</b> {latest ? latest.deaths : "..."}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={8} xl={9}>
            <Paper>
              <Chart data={daily ? daily : []}>
                <ValueScale name="number"/>
                <ValueAxis scaleName="number"/>
                <Title text={`Data for the last 30 days in all countries ${daily ? '' : '(Loading...)'}`}  />
                <AreaSeries name="Recovered" valueField="recovered" argumentField="date" scaleName="number"/>
                <AreaSeries name="Deaths" valueField="deaths" argumentField="date" scaleName="number"/>
                <AreaSeries name="Active" valueField="active" argumentField="date" scaleName="number"/>
                <Stack
                  stacks={[
                    { series: ['Recovered', 'Deaths', 'Active'] },
                  ]}
                />
                <Legend />
              </Chart>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Home);