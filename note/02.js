let todos = [
  {
    id: 1,
    content: "1",
    status: false,
  },
  {
    id: 2,
    content: "2",
    status: false,
  },
  {
    id: 3,
    content: "3",
    status: false,
  },
];

const remove = ({ type, payload }) => {
  todos = todos.filter((v) => v.id !== payload.id);
};

const add = ({ type, payload }) => {
  todos = [
    ...todos,
    payload
  ];
};

const update = ({type,payload}) => {
  return todos.map( v => {
    if(v.id == payload.id)
      return Object.assign(v,payload) 
  })
}

const getAll =({type,payload})=>{
  return todos
}


const getById =({type,payload})=>{
  todos.forEach(v=>{
    if(v.id == payload.id)
    return v
  })
}



//remove({type:'remove', payload: {id: 2}})

// add({ type: "add", payload: { id: 10, content: "10", status: true }});

update({type:"update",payload:{ id: 2, content: 10, status: true }})

console.log(todos);






// console.log(a);




