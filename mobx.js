let {observable, observe, computed, autorun, when, reaction, action} = require('mobx');

// let o1 = observable({name:'ahhh'});
// console.log('o1:',o1);
// Proxy {Symbol(mobx administration): ObservableObjectAdministration$$1}
// - [[Handler]]:Object
// - [[Target]]:Object
// - [[IsRevoked]]:false

// let arr1 = observable([1, 2, 3]);
// console.log('arr1:',arr1);
// arr1.pop();
// arr1.push(4);
// arr1.unshift(0);
// console.log('arr1:',arr1);


//TODO observe

// let o1 = observable({name: 'ahhh'});
//
// observe(o1,change=>console.log(change))
// o1.name = 'ahhh2'; //{type: "update", object: Proxy, oldValue: "ahhh", name: "name", newValue: "ahhh2"}

//TODO
//如果是基本数据类型，会进行装箱，变成可支持observe的
//不过需要通过制定的方式获取和设置值才会被observe

// let num = observable.box(1);
// observe(num, change => console.log(change));
// console.log(num);// ObservableValue$$1 {name: "ObservableValue@1", isPendingUnobservation: false, isBeingObserved: false, observers: Set(0), diffValue: 0, …}
// console.log(num.get());
// num.set(2); //{type: "update", object: ObservableValue$$1, newValue: 2, oldValue: 1}

// let bool = observable.box(true);
// console.log(bool)

// let string = observable.box('abc');
// console.log(string)


//TODO observable与类
//如果是在类里，普通数据类型无需`.box`了
class Person {
  @observable name = 'ahhh';
  @observable age = 11;
  @observable sister = {name: 'ahhh2'};

  @observable province = '广东';
  @observable city = '深圳';

  @observable area = '010';
  @observable number = '189';

  @computed get phone() {
    return this.area + '-' + this.number;
  }

  @computed get home() {
    return this.province + '-' + this.city;
  }

  //.bound修饰符能确定this永远指向实例
  //↓ 主要是以便如下这样调用时不出错
  //let s = p1.switchPhone;
  // s('200', '300');
  @action.bound switchPhone(area, number) {
    this.area = area;
    this.number = number;
  }
}

let p1 = new Person();
// observe(p1, c => console.log(c));
// p1.name = 'ahhh3'; //{type: "update", object: Person, oldValue: "ahhh", name: "name", newValue: "ahhh3"}

// console.log('p1.phone:',p1.phone); //p1.phone: 010-189

// console.log('p1.home:',p1.home); //p1.home: 广东-深圳

// p1.area = '020'; //{type: "update", object: Person, oldValue: "010", name: "area", newValue: "020"}
// p1.number = '138'; //{type: "update", object: Person, oldValue: "189", name: "number", newValue: "138"}


//TODO computed的第二种使用方式
//这种方式的优势在于可以监听computed属性，通常在类里设置的computed，需要通过autorun才能进行监听(而不是通过observe)
// computed(()=>)

// let phone = computed(() => {
//   return p1.area + '-' + p1.number;
// });

// console.log(phone); //ComputedValue$$1 {dependenciesState: -1, observing: Array(0), newObserving: null, isBeingObserved: false, isPendingUnobservation: false, …}

// phone.observe(c => console.log(c));
// p1.area = '200'; //{type: "update", object: ComputedValue$$1, newValue: "200-189", oldValue: "010-189"}
// p1.number = '157'; //{type: "update", object: ComputedValue$$1, newValue: "200-157", oldValue: "200-189"}


//TODO autorun
//当系统启动之后自动运行此函数
//然后当它依赖的数据发生改变时又会再次执行
// autorun(() => {
//   console.log('autorun' + p1.phone);
// });
//
// setTimeout(() => {
//   p1.area = '202';
// }, 1000);


//TODO when
//when会等待条件满足，一旦满足就会执行回调并自动销毁监听
//会返回一个取消的监听函数，如果调用会直接取消监听
// let disposer = when(() => p1.age >= 18, () => {
//   console.log('when:', p1.age);
// });
// setInterval(() => {
//   p1.age++;
// }, 1000);


//TODO reaction
// reaction(()=>[p1.age, p1.name], arr => {
//   console.log(arr);
// });
// p1.age = 13;
// p1.name = 'ahhh111';


//TODO action
autorun(() => {
  console.log(p1.phone);
});
p1.area = '200';
p1.number = '300';

//TODO 会执行两次，但我们只期望一次，So我们希望它进行批处理
//switchPhone是一个@action
// p1.switchPhone('200','300');
//只会执行一次

//也可以这样调用
let s = p1.switchPhone;
//需要@action.bound
s('200', '300');


//TODO runInAction
//自定义的action
runInAction(() => {
  p1.name = 'ahh2';
  p1.age = '122';
});
