let p1 = new Proxy({name: 'ahhh', age: 111}, {

  get: function (target,key,receiver) {
    console.log(`get ${key}`);

    //Reflect.get获取某个对象上的属性值
    return Reflect.get(target, key);
  }

  ,set:function(target,key,value){
    console.log(`set ${key} ${value}`);

    return Reflect.set(target, key, value);
  }
});

console.log('p1.name:',p1.name); //get name;  p1.name: ahhh
console.log('p1.age:',p1.age); //get age;  p1.age: 111
p1.name = 'ahhh2'; //set name ahhh2
console.log(p1); //Proxy {name: "ahhh2", age: 111}
