

# 介绍

dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。

## 特性

- **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://umijs.org/guide/with-dva.html)后更是降低为 0 API
- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) 实现 components、routes 和 models 的 HMR

## fetch()基本用法

`fetch()`的功能与 XMLHttpRequest 基本相同，但有三个主要的差异。

（1）`fetch()`使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。

（2）`fetch()`采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。

（3）`fetch()`通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来。

在用法上，`fetch()`接受一个 URL 字符串作为参数，默认向该网址发出 GET 请求，返回一个 Promise 对象。它的基本用法如下。

> ```javascript
> fetch(url)
>   .then(...)
>   .catch(...)
> ```

下面是一个例子，从服务器获取 JSON 数据。

> ```javascript
> fetch('https://api.github.com/users/ruanyf')
>   .then(response => response.json())
>   .then(json => console.log(json))
>   .catch(err => console.log('Request Failed', err)); 
> ```

上面示例中，`fetch()`接收到的`response`是一个 [Stream 对象](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)，`response.json()`是一个异步操作，取出所有内容，并将其转为 JSON 对象。

Promise 可以使用 await 语法改写，使得语义更清晰。

> ```javascript
> async function getJSON() {
>   let url = 'https://api.github.com/users/ruanyf';
>   try {
>     let response = await fetch(url);
>     return await response.json();
>   } catch (error) {
>     console.log('Request Failed', error);
>   }
> }
> ```

上面示例中，`await`语句必须放在`try...catch`里面，这样才能捕捉异步操作中可能发生的错误。

后文都采用`await`的写法，不使用`.then()`的写法。



HMR：热更新



## 前置知识

### redux



![image-20210624164358282](C:\Users\23034\AppData\Roaming\Typora\typora-user-images\image-20210624164358282.png)

心智模式是简化的知识结构认识表征，人们常用它来理解周围世界以及与周围世界进行互动



#### action

除了 `type` 字段外，action 对象的结构完全由你自己决定。参照 [Flux 标准 Action](https://github.com/acdlite/flux-standard-action) 获取关于如何构造 action 的建议。

这时，我们还需要再添加一个 action index 来表示用户完成任务的动作序列号。因为数据是存放在数组中的，所以我们通过下标 `index` 来引用特定的任务。而实际项目中一般会在**新建数据的时候生成唯一的 ID 作为数据的引用标识**。

```js
{
  type: TOGGLE_TODO,
  index: 5
}
```

**我们应该尽量减少在 action 中传递的数据**。比如上面的例子，传递 `index` 就比把整个任务对象传过去要好。



##### 例子：Action 创建函数

**Action 创建函数** 就是生成 action 的方法。“action” 和 “action 创建函数” 这两个概念很容易混在一起，使用时最好注意区分。

在 Redux 中的 action 创建函数只是简单的返回一个 action:

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```



#### Reducer

reducer 就是一个纯函数，接收旧的 state 和 action，返回新的 state。

```js
(previousState, action) => newState
```

**永远不要**在 reducer 里做这些操作：

- 修改传入参数；
- 执行有副作用的操作，如 API 请求和路由跳转；
- 调用非纯函数，如 `Date.now()` 或 `Math.random()`。



例子：

```js
import { VisibilityFilters } from './actions'
const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
};
function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```

这里一个技巧是使用 [ES6 参数默认值语法](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters) 来精简代码

```js
function todoApp(state = initialState, action) {
  // 这里暂不处理任何 action，
  // 仅返回传入的 state。
  return state
}
```



**函数默认参数**允许在没有值或`undefined`被传入时使用默认形参。这里 b=1就是默认形参

```js
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(5, 2));
// expected output: 10

console.log(multiply(5));
// expected output: 5

```



例子：改变 state 中的 `visibilityFilter`。

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

注意:

1. **不要修改 `state`。** 使用 [`Object.assign()`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 新建了一个副本。不能这样使用 `Object.assign(state, { visibilityFilter: action.filter })`，因为它会改变第一个参数的值。你**必须**把第一个参数设置为空对象。你也可以开启对ES7提案[对象展开运算符](https://www.redux.org.cn/docs/recipes/UsingObjectSpreadOperator.html)的支持, 从而使用 `{ ...state, ...newState }` 达到相同的目的。
2. **在 `default` 情况下返回旧的 `state`。**遇到未知的 action 时，一定要返回旧的 `state`。



例子：两种方法  修改state的a属性 

```js
let a={
  a:"b",
  b:"c"
}
let state={
  a:"a",
  b:"c"
}
//Object.assign()，后面的会覆盖前面的，
//因为它会改变第一个参数的值。你必须把第一个参数设置为空对象
console.log(Object.assign({},state,a)); //{ a: 'b', b: 'c' }
//ES7提案 对象展开运算符 达到相同的目的
console.log({...state,...a}); //{ a: 'b', b: 'c' }
```



#### Store 

Store 有以下职责：

- 维持应用的 state；
- 提供 [`getState()`](https://www.redux.org.cn/docs/api/Store.html#getState) 方法获取 state；
- 提供 [`dispatch(action)`](https://www.redux.org.cn/docs/api/Store.html#dispatch) 方法更新 state；
- 通过 [`subscribe(listener)`](https://www.redux.org.cn/docs/api/Store.html#subscribe) 注册监听器;
- 通过 [`subscribe(listener)`](https://www.redux.org.cn/docs/api/Store.html#subscribe) 返回的函数注销监听器。

**Redux 应用只有一个单一的 store**。当需要拆分数据处理逻辑时，你应该使用 [reducer 组合](https://www.redux.org.cn/docs/basics/Reducers.html#splitting-reducers) 而不是创建多个 store。