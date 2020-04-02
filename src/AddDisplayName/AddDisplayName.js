import React, { Component } from 'react';

/*
  Напишите простой HOC и укажите для него displayName
*/

export const withDisplayName = WrappedComponent => {
  return class extends Component {
    static displayName = `HOC${WrappedComponent.displayName || 'Component'}`;
    render() {
      return <WrappedComponent />;
    }
  };
};
