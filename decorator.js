//TODO 装饰类

// @testable
// class Person{
//
// }
//
// function testable(target){
//   target.testable = true;
// }

// console.log('Person.testable:',Person.testable);

//->相当于
// testable(Person);


//TODO 装饰类的属性

// class Circle{
//   @readonly
//   PI = 3.14; //实例上的属性而不是原型上
// }
//
// let c1 = new Circle();

//target为装饰的类
//key为装饰的类的属性
//discriptor同Object.defineProperty方法的第三个参数
// function readonly(target,key,discriptor){
//   discriptor.writable = false;
// }
// c1.PI = 3.15;
// console.log('c1.PI:',c1.PI);


//TODO 修饰类的方法

class Calculator{
  @logger
  add(a,b){   //原型上的
    return a + b;
  }
}

function logger(target,key,discriptor){
  let oldVal = discriptor.value; //获取老函数
  discriptor.value = function () {
    console.log(`${key}(${Array.from(arguments).join(',')})`);
    return oldVal.apply(this, arguments);
  };
}

let c1 = new Calculator();
let ret = c1.add(1, 2);
console.log(ret);

//->等同于
//Object.getOwnPropertyDescriptor 获取某个对象上的属性的描述器
// logger(Calculator.prototype, 'add', Object.getOwnPropertyDescriptor(Calculator.prototype, 'add'));
