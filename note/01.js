// //修改state的a属性
// let a={
//   a:"b",
//   b:"c"
// }
// let state={
//   a:"a",
//   b:"c"
// }
// //后面的会覆盖前面的
// //因为它会改变第一个参数的值。你必须把第一个参数设置为空对象
// console.log(Object.assign({},state,a)); 
// //
// console.log({...state,...a});


// let arr =['a','b','c']
// let iter =arr[Symbol.iterator]()//数组的遍历器

// console.log(iter.next()); 
// console.log(iter.next()); 
// console.log(iter.next());
// console.log(iter.next());


// let set =new Set().add('a').add('b').add('c');
// console.log(set);

// let [x,y] =set;
// console.log([x,y]);

// let [first,...rest] =set
// console.log([first,...rest]);




// let generator =function* (){
//   yield 1;
//   yield* [2,3,4]
//   yield 5;
// }

// var iterator = generator();

// iterator.next()

let str ="hello";

for(let s of str){
  console.log(s);
}


let paras =document.querySelectorAll("p")

for (let p of paras){
  p.classList.add("test")
}




