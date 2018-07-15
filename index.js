import React from 'react';
import ReactDOM from 'react-dom';
import {observable,observe,action,computed,toJS} from 'mobx';
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

  @action.bound load(todos){
    todos.forEach(todo => {
      this.todos.push(new Todo(todo.text, todo.completed));
    });
  }

  cancelObserves = [];

  constructor(){
    observe(this.todos,(ev)=>{
      this.save();
      this.cancelObserves.forEach(d => d());
      this.cancelObserves = [];
      for(let todo of ev.object){
        this.cancelObserves.push(observe(todo, this.save));
      }
    })
  }

  @action.bound save(){
    let todos = toJS(this.todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

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

@observer
class TodoHeader extends React.Component{
  state = {
    text: ''
  };

  handleChange = (ev) => {
    this.setState({
      text: ev.target.value
    })
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    let text = this.state.text;
    this.props.store.addTodo(text);
    this.setState({text: ''});
  };

  render(){
    return (
      <form action="" onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.text}/>
      </form>
    )
  }
}

@observer
class TodoItems extends React.Component{
  render(){
    return (
      <ul>
        {
          this.props.store.filterTodos.map(todo=>(
            <li key={todo.id}>
              <TodoItem todo={todo}/>
              <span onClick={()=>this.props.store.removeTodo(todo)}>X</span>
            </li>
          ))
        }
      </ul>
    )
  }
}

@observer
class TodoFooter extends React.Component{
  render(){
    return (
      <div>
        <p>你还有{this.props.store.reminder}待办事项</p>
        <p>
          <button
            onClick={()=>this.props.store.changeFilter('all')}
            style={{color:this.props.store.filter==='all'?'red':'black'}}>全部</button>
          <button
            onClick={()=>this.props.store.changeFilter('uncompleted')}
            style={{color:this.props.store.filter==='uncompleted'?'red':'black'}}>未完成</button>
          <button
            onClick={()=>this.props.store.changeFilter('completed')}
            style={{color:this.props.store.filter==='completed'?'red':'black'}}>已完成</button>
        </p>
      </div>
    )
  }
}

//会观察仓库中数据变化，从而自动调用setState重新渲染
@observer
class Todos extends React.Component {
  componentDidMount(){
    let todosStr = localStorage.getItem('todos');
    let todos = todosStr ? JSON.parse(todosStr) : [];
    this.props.store.load(todos);
  }

  render() {
    let {store} = this.props;
    return (
      <div>
        <TodoHeader store={store}/>
        <TodoItems store={store}/>
        <TodoFooter store={store}/>
      </div>
    )
  }
}

ReactDOM.render(<Todos store={store}/>, window.root);
