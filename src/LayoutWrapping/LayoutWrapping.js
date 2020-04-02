import React, { Component } from 'react';

/*
  Напишите HOC, который обернёт компонент в `div`,
  со стилем 'position: absolute'
*/

export const wrapWithAbsolutePosition = WrappedComponent => {
  const Layout = ({ render }) => (
    <div style={{ position: 'absolute' }}>{render()}</div>
  );

  return class extends Component {
    render() {
      return <Layout render={() => <WrappedComponent {...this.props} />} />;
    }
  };

  // Тоже рабочий вариант
  // class DivHoc extends Component {
  //   static displayName = 'DivHoc';

  //   render() {
  //     return (
  //       <div style={{ position: 'absolute' }}>
  //         <WrappedComponent {...this.props} />
  //       </div>
  //     );
  //   }
  // }
  // return DivHoc;
};
