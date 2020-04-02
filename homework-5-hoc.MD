# Продвинутый React. Библиотечное API и паттерны

### Оглавление  

1.  PropTypes. Проверка типов
2.  Portals
3.  RenderProps
4.  Higher-order component(HOC)
5.  Context
6.  Forwarded Ref


## **1.** PropTypes. Проверка типов
С ростом приложения растет количество кода и сложность его взаимодействия. Компоненты используются в разных местах, и строгость в перечислении типов props может помочь в случае возникновения ошибок. Реакт предоставляет инструмент для описания типов props компонент, и выводит ошибки в консоли браузера если типы не сходятся. Строгое аннотирование типов компоненты сразу подскажет вам, что используете ее не правильно — не указали какой либо props или передали props невалидного типа.

> До react 16 PropTypes были частью реакта, а теперь они являются отдельным пакетом, для установки нужно выполнить команду:
>  **yarn add prop-types**

Для того, чтобы перечислить типы параметров компоненты можно воспользоваться несколькими способами.
1	
Добавить параметр propTypes к уже созданному классу или функции:
```js
import PropTypes from 'prop-types';
import React from 'react';

const Greeting = ({name}) =>
 <p>Hi, {name}!</p>

Greeting.propTypes = {
 name: PropTypes.string
}
```
2	
Или добавить static propTypes внутри класса компоненты:
```js
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ClassWithPropTypes extends Component {

	static propTypes = {
		email: PropTypes.string.isRequired
  }

  render () {
		const { email } = this.props
		return <p>Email: {email}</p>
	}
}
```

Если не передавать что-либо, реакт не будет показывать ошибку. Если переменная обязательна, нужно указывать isRequired для типа:

```js
Greeting.propTypes = {
 name: PropTypes.string.isRequired
}
```

Если указаны значения в defaultProps, а компонента не получила значений от родителя для PropTypes с флагом isRequired, реакт не будет ругаться, так как значение будет взято из defaultProps.

Флаг isRequired даёт уверенность, что компонента будет вызвана с правильным набором параметров, и отсутствие какого-либо параметра не приведет к ошибке в во время работы компоненты из-за пустой переменной.

А это список типов, которые доступны в PropTypes:

```js
MyComponent.propTypes = {
 // Все PropTypes опциональны, и делают проверку только на соответствие типа
 optionalArray: PropTypes.array,
 optionalBool: PropTypes.bool,
 optionalFunc: PropTypes.func,
 optionalNumber: PropTypes.number,
 optionalObject: PropTypes.object,
 optionalString: PropTypes.string,
 optionalSymbol: PropTypes.symbol,
 // Этот тип описывает любой элемент, который реакт может отрендерить в jsx
 optionalNode: PropTypes.node,
 // Реакт компонент
 optionalElement: PropTypes.element,
 // Также можно проверить, является ли тип экземпляром конкретного класса
 optionalMessage: PropTypes.instanceOf(Message),
 // Позволяет проверить, что значение является одним из списка
 optionalEnum: PropTypes.oneOf(['News', 'Photos']),
 // Переменная может быть одной из перечисленных типов
 optionalUnion: PropTypes.oneOfType([
   PropTypes.string,
   PropTypes.instanceOf(Message)
 ]),
 // Переменная должна быть списком элементов с конкретным типом
 optionalArrayOf: PropTypes.arrayOf(PropTypes.number),
 // Объект должен содержать значения определенного типа
 optionalObjectOf: PropTypes.objectOf(PropTypes.number),
 // Проверка ключей объекта на соответствие типа
 optionalObjectWithShape: PropTypes.shape({
   color: PropTypes.string,
   fontSize: PropTypes.number
 }),
 // Пометить переменную, как обязательную
 requiredFunc: PropTypes.func.isRequired,
 // Переменная может быть любого типа
 requiredAny: PropTypes.any.isRequired
};
```

Кроме PropTypes существуют другие способы делать проверку типов, такие flow или TypeScript, и в больших проектах использование flow или TypeScript предпочтительнее.

Но для разработки библиотечных компонент, или при работе в open source использование PropTypes предпочтительнее, так как механизм показа ошибок PropTypes более универсальный, а если нужно показать ошибку flow или TypeScript в библиотеке, человек который использует ее, тоже должен использовать такое же решение. PropTypes покажет ошибку, даже если у конечного пользователя он не установлен.

## **2.** Portals

Существуют ситуации, когда нужно отрендерить компонент не в текущем месте дерева компонент, а отдельно. Хорошим примером служат модальные окна, тултипы, попапы. Как правило, такого рода элементы находятся в самом конце тега body, чтобы быть выше остальных элементов. Для таких случаев служат порталы, новое api реакта, пришедшее с 16ой версии.

Обычно, компонент возвращает jsx, в случае порталов, нам необходимо вернуть ReactDOM.createPortal:

```js
class ModalWindow extends Component {
 render() {
   return ReactDOM.createPortal(this.props.children, this.props.domNode);
 }
}

class App extends Component {
 render() {
   return (
     <ModalWindow domNode={document.querySelector('#modal')}>
       <p>It is modal window</p>
     </ModalWindow>
   );
 }
}
```

Первым аргументом указываем компонент реакта, а вторым — DOM объект, в котором реакт разместит этот компонент.

События, которые появляются в модальных компонентах, можно перехватить в компонентах родителях так, словно эти реакт компоненты находятся в том месте, где их объявили. С точки зрения реакта, порталы — это простые компоненты, которые встраиваются в дерево компонент там, где их объявили. С точки зрения реального DOM, порталы размещаются в тех элементах, которые указаны при создании портала.
## **3.** RenderProps
RenderProps это простая техника разделения кода между компонентами, используя props переменную как функцию, которая возвращает jsx. Простой пример:

```js
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
Техникой renderProps пользуются многие библиотеки, наример у библиотеки React-router есть компоненты Route, которые отвечают за конкретный url адрес, так вот, в качестве prop render можно передать jsx, который должен быть отрендерен, когда путь Route соответствует пути браузера
<Route path="/home" render={({match, location, history}) =>
	<SomeReactComponent />
}/>
```

Паттерн renderProps часто используется библиотеками, а также как возможность разделить особенную функциональность и встроить ее в верстку вашего проекта именно там, где это нужно.

## **4.** High Order Components(HOC)

Компонент высшего порядка — аналог функций высшего порядка, которые принимают аргументами функции и возвращают их. В случае HOC аргументом служит компонент, и такая функция возвращает обёрнутый компонент.

Компоненты трасформируют данные в UI, а HOC компоненты — в расширенные компоненты.

Компоненты являются единицей функциональности в мире реакта, но существуют ситуации, когда нужно использовать одинаковую функциональность для компонент, показывающих рызный UI.

Пример:

```js
class ShowWidth extends React.Component {

 constructor(props) {
   super(props);
   this.state = {
     windowWidth: window.innerWidth
   };
 }

 componentDidMount() {
   window.addEventListener('resize', this.onResize);
 }

 componentWillUnmount() {
   window.removeEventListener('resize', this.onResize);
 }

 onResize = () => {
   this.setState({windowWidth: window.innerWidth});
 };

 render() {
   return <p>Width: {this.state.windowWidth}</p>;
 }
}
```

Компонент показывает ширину экрана. Если появляется необходимость реагировать на изменение ширины экрана, например, для скрытия блоков, появилась бы необходимость дублировать функционал методов componentDidMount, componentWillUnmount, onResize.

С HOC код будет выглядеть так:

Пример:

```js
function withWindowWidth(WrappedComponent) {
 return class extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       windowWidth: window.innerWidth
     };
   }
   componentDidMount() {
     window.addEventListener('resize', this.onResize);
   }

   componentWillUnmount() {
     window.removeEventListener('resize', this.onResize);
   }

   onResize = () => {
     this.setState({windowWidth: window.innerWidth});
   };

   render() {
     return (
       <WrappedComponent width={this.state.windowWidth} {...this.props} />
     );
   }
 };
}

const ShowWidth = props => <p>Width: {props.width}</p>;

export default withWindowWidth(ShowWidth);
```

В этом примере функционал вынесен во внешний компонент, который оборачивает компонент ShowWidth, и передает через props нужные данные. Теперь можно обернуть любой компонент с помощью HOC withWindowWidth, при этом использовать простой код в самих компонентах.

С помощью HOC и context реализованы множество интеграций внешних библиотек, в случае redux корнем проекта становится особенный компонент Provider, который передает через context связь с хранилищем всего приложения. А с помощью HOC connect компоненты, которым нужны данные из глобального хранилища, описывают, что именно нужно и получают через props нужные данные.

HOC — это паттерн программирования в мире реакта, кроме HOC существует возможность сделать то же самое с новым паттерном, называемым render prop.

## **5.** Context

Начиная с версии 16.3 в реакт появилось новое context api. Оно стало безопасным, до 16.3 context api было эксперементальным и вызывало некоторые проблемы, при пересечении данных.

Контекст это способ передать данные всем дочерним компонентам, и не беспокоится о том, что эти данные нужно пробрасывать через props промежуточных компонент.

Котнекст нужен в первую очередь для разделения данных, которые должны быть глобальными для всего приложения. Не стоит использовать контекст там, где нужно разделить данные только лишь между 2-3 компонентами. Контекст подходит для разделения темы приложения, локализации или общего состояния приложения.

Для создания контекста нужно использовать следующее api:

```js
const {Provider, Consumer} = React.createContext(defaultValue);
```

Provider и Consumer это компоненты для задания и получения данных. Пара Provider и Consumer связаны, для предоставления данных поддереву компонент, нужно разместить Provider в корне поддерева, а для получения данных, Consumer. Consumer использует паттерн renderProps, для предоставления данных:
const {Provider, Consumer} = React.createContext({background: '#eee'});

```js
const Root = () => 
  <Provider>
		<IntermediateComponent>
			<ThemedButton />
		</IntermediateComponent>
	</Provider>

const ThemedButton = () =>
	<Consumer>
		{({background}) =>
			<button style={{background: background}}>Кнопка</button>
		}
	</Consumer>
  ```

### Provider
Провайдеру можно передать через props новые данные, с помощью поля value, таким образом, можно изменять данные, которые транслируются через context. При создании контекста указываются значения по умолчанию.

### Consumer
Консъюмер предоставляет данные с помощью renderProps, только в случае компоненты Consumer используется рендер функция, передачу которой компонент ожидает в children.

## **6.** Forwarded Ref
При использовании HOC теряется возможность закреплять ref у компоненты, которую оборачивает HOC. HOC захватывает ref, и закрепляется за HOC, но такое поведение не правильно, с точки зрения прозрачности HOC.

Чтобы исправить такую ситуацию, начиная с react 16.3, появилось новое API — React.forwardRef.

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  return React.forwardRef(forwardRef);
}
```

Функция React.forwardRef принимает рендер функцию, в которую вторым аргументом, после props приходит ref. Этот ref можно передать оборачиваемой компоненте, так, чтобы ref не потерялся за HOC компонентой.
