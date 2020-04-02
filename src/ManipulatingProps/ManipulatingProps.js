import React, { Component } from 'react';
import { getLoggedInUser } from '../utils';

/*
  Манипуляция пропами

  Первый HOC который нужно написать - enchancer.
  
  Он будет принимать проп loading и в зависимости
  от его значения показывать прелоадер,
  или обёрнутый компонент
*/

const LoadingSpinner = () => <div>Loading...</div>;

export const withLoading = WrappedComponent => {
  class Enhancer extends Component {
    render() {
      if (this.props.loading) {
        return <LoadingSpinner />;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return Enhancer;
};

/*
  Следующий HOC - injector, его особенность в том,
  что он не даёт перезаписать проп, который передаёт
  в оборачиваемый компонент

  Нужно написать HOC, который передаст авторизованного
  пользователя через проп user

  Чтобы получить текущего пользователя - используйте
  метод `getLoggedInUser` из `utils`

  const user = getLoggedInUser()
*/

export const addLoggedInUser = WrappedComponent => {
  class Injector extends Component {
    static displayName = 'InjectorHOC';

    render() {
      const user = getLoggedInUser();
      return <WrappedComponent {...this.props} user={user} />;
    }
  }
  return Injector;
};

/*
  Помимо добавления новых пропов можно модифицировать те,
  что уже были переданы в компонент

  Мы будем передавать во WrappedComponent список книг
  [{title: "Harry Potter", author: "J. K. Rowling"}, ...]

  Ваша задача написать HOC, который перехватит prop books,
  отсортирует по названиям по алфавиту
  и передаст в обёрнутый компонент
*/

export const withSort = WrappedComponent => {
  class SortedBooksHOC extends Component {
    static displayName = 'SortedBooksHOC';

    render() {
      const sortedList = this.props.books;

      sortedList.sort((a, b) => {
        const left = a.title.toLowerCase(),
          right = b.title.toLowerCase();

        if (left < right) return -1;
        if (left > right) return 1;
        return 0;
      });

      return <WrappedComponent {...this.props} books={sortedList} />;
    }
  }
  return SortedBooksHOC;
};
