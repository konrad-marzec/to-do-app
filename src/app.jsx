import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import React from 'react';

import theme from './utils/theme';
import ToDoApp from './routes/ToDoApp';

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <ToDoApp />
      </MuiThemeProvider>
    )
  }
}

export default App;
