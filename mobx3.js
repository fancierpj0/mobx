import React from 'react';
import ReactDOM from 'react-dom';
import {observable,action,computed} from 'mobx';
import {observer} from 'mobx-react';

class Todo {
  id = Math.random();
  @observable text = '';
  @observable completed = false;
  constructor(text){
    this.text = text;
  }
  //切换checkbox
  @action.bound toggle(){
    this.completed = !this.completed;
  }
}

class Store {
  @observable todos = [];
  @observable filter = 'all';
  @action.bound changeFilter(filter){
    this.filter = filter;
  }
  @action.bound addTodo(text){
    //push为mobx扩展的
    this.todos.push(new Todo(text));
  }
  @action.bound removeTodo(todo){
    this.todos.remove(todo);
  }
  @computed get filterTodos(){
    return this.todos.filter(todo => {
      switch(this.filter){
        case 'completed':
          return todo.completed;
        case 'uncompleted':
          return !todo.completed;
        default:
          return true;
      }
    });
  }
  @computed get reminder(){
    return this.todos.reduce((count,todo)=>{
      count = count + (todo.completed ? 0 : 1);
      return count;
    },0)
  }
}

let store = new Store();

class TodoItem extends React.Component{
  render(){
    return (
      <React.Fragment>
        <input
          type="checkbox"
          onChange={this.props.todo.toggle}
          checked={this.props.todo.completed}
        />
        <span style={{textDecoration:this.props.todo.completed?'line-through':''}}>{this.props.todo.text}</span>
      </React.Fragment>
    )
  }
}

//会观察仓库中数据变化，从而自动调用setState重新渲染
@observer
class Todos extends React.Component {
  state = {
    text: ''
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    let text = this.state.text;
    this.props.store.addTodo(text);
    this.setState({text: ''});
  };

  handleChange = (ev) => {
    this.setState({
      text: ev.target.value
    })
  };

  render() {
    let {store} = this.props;
    return (
      <div>
        <form action="" onSubmit={this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.text}/>
        </form>
        <ul>
          {
            store.filterTodos.map(todo=>(
              <li key={todo.id}>
                <TodoItem todo={todo}/>
                <span onClick={()=>store.removeTodo(todo)}>X</span>
              </li>
            ))
          }
        </ul>
        <div>
          <p>你还有{store.reminder}待办事项</p>
          <p>
            <button
              onClick={()=>store.changeFilter('all')}
              style={{color:store.filter==='all'?'red':'black'}}>全部</button>
            <button
              onClick={()=>store.changeFilter('uncompleted')}
              style={{color:store.filter==='uncompleted'?'red':'black'}}>未完成</button>
            <button
              onClick={()=>store.changeFilter('completed')}
              style={{color:store.filter==='completed'?'red':'black'}}>已完成</button>
          </p>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Todos store={store}/>, window.root);
