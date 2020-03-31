import React, { Component } from 'react';

/*
  Напишите простой HOC и укажите для него displayName
*/

export const withDisplayName = WrappedComponent => {
  console.log(Component);
  return class extends Component {
    static displayName = `HOC${WrappedComponent.displayName || 'Component'}`;
    render() {
      return <WrappedComponent />;
    }
  };
};
