// import './mobx.js';

import React from 'react';
import ReactDOM from 'react-dom';
// spy -> 侦察；发现；暗中监视
import {observable, action, observe, spy} from 'mobx';
import {observer} from 'mobx-react';

//TODO 会监听所有，调试时用
spy(ev=>console.log(ev));

//TODO observer

// class Store {
//   @observable number = 0;
//
//   @action.bound add() {
//     this.number += 1;
//     console.log('this.number:', this.number)
//   }
// }
//
// @observer
// class Counter extends React.Component {
//   render() {
//     let {store} = this.props;
//     return (
//       <div>
//         <p>{store.number}</p>
//         <button onClick={store.add}>+</button>
//       </div>
//     )
//   }
// }
//
// let store = new Store();
// ReactDOM.render(<Counter store={store}/>, window.root);



class Store{
  @observable todos = [];
  disposers = []; //里面存放着所有取消监听的函数
  constructor(){
    //TODO 只会监听一层
    // observe(this.todos, event => {
    //   console.log(event); //{object: Proxy, type: "splice", index: 1, removed: Array(0), added: Array(1), …}
    //
    //   //其中object为observable对象
    //
    //   //TODO 监听第二层
    //   //让以前的所有取消监听函数执行
    //   this.disposers.forEach(disposer => disposer());
    //   this.disposers = [];
    //   //重新进行监听
    //   for(let todo of event.object){
    //     let disposer = observe(todo, e => {
    //       console.log(e);
    //     });
    //     this.disposers.push(disposer);
    //   }
    // });
  }
}

let store = new Store();
store.todos.push(observable({id:1,name:'ahhh'}));
//添加时可用observable包一下 也可以不
store.todos.push({id:2,name:'xxxx'});
store.todos.get(0).name = 'ahhh3';
console.log(store.todos.get(0).name); //ahhh3

