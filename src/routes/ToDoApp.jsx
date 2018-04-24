import React from 'react';
import { Switch } from 'react-router';

import StandardRoute from './StandardRoute';
import ToDoList from '../ToDoList';
import Home from '../Home';

const ToDoApp = () =>  (
  <Switch>
    <StandardRoute path="/tasks" component={Home} />
    <StandardRoute path="/list/:id" component={ToDoList} />
    <StandardRoute path="*" component={Home} />
  </Switch>
)

export default ToDoApp;
