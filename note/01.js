//修改state的a属性
let a={
  a:"b",
  b:"c"
}
let state={
  a:"a",
  b:"c"
}
//后面的会覆盖前面的
//因为它会改变第一个参数的值。你必须把第一个参数设置为空对象
console.log(Object.assign({},state,a)); 
//
console.log({...state,...a});