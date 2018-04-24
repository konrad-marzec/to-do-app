import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';
// import { debounce } from 'lodash';

import theme from './utils/theme';
import ToDoApp from './routes/ToDoApp';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};

    // this.debOnLightChange = debounce(this.onLightChange, 16);
  }

  // componentDidMount = () => {
  //   // debugger;
  //   // window.addEventListener('devicelight',
  //   // function(event) {
  //   //   debugger;
  //   //   if (event.value < 50) {
  //   //     // html.classList.add('darklight');
  //   //     // html.classList.remove('brightlight');
  //   //   } else {
  //   //     // html.classList.add('brightlight');
  //   //     // html.classList.remove('darklight');
  //   //   }
  //   // });
  //   window.addEventListener('devicelight', function(event) {
  //     console.log(event.value);
  //   });
  // }

  // componentWillUnmount() {
    // window.removeEventListener('devicelight', this.debOnLightChange)
  // }


  // onLightChange = (e) => {
  //   debugger;
  // }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <ToDoApp />
      </MuiThemeProvider>
    )
  }
}

export default App;
