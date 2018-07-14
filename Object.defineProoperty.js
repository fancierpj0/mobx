let obj = {};
obj.name = 'ahhh';
//第三个参数为discriptor 描述器
Object.defineProperty(obj,'age',{
  value:9
  // ,set(){}
  // ,get(){}

  //以下都为【默认值】

  //是否可枚举，被for in遍历到
  ,enumerable:false

  //是否可修改
  ,writable:true

  //是否可配置，可通过delete obj.xx
  ,configurable:true
});

console.log('obj.age:', obj.age);
