import React, { Component } from 'react';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './App.css';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Spinner from './spinner.svg'
import TimeKeeper from 'react-timekeeper';
import LandingPage from './LandingPage.js';


/*
You have the concept of a todo list, as well as an anti-todo list.
Whenever you do something on your todo list, cross it off.
Whenever you do something that wasn't on your todo list, write it on
your anti-todo list and then cross it off.

A object todo has the following keys:
content: string
completed: boolean
key: unique string

A taskList is an array of todo objects.


todo_data: {
  '2019-01-01': {
    todos: [{}, {}, ...],
    anti_todos: [{}, {}, ...]
  }
}


*/

// logging the API server's endpoint
const API_URL = 'http://localhost:8000';
console.log(`Using API URL: ${API_URL}`)


// test habits used for debugging
const habits = [
  {
    habit: "Lift weights for 45 min",
    days: [
      moment()
    ]
  },
  {
    habit: "Eat 3,000 calories",
    days: [
      moment()
    ]
  },
  {
    habit: "Meditate for 20 min",
    days: [
      moment()
    ]
  },

]

const taskList = []
//   {
//     content: "Eat ramen first",
//     completed: false,
//     key: "a"
//   },
//
// ];

const antiTaskList = [

]


function generateDateArray(daysInMonth) {
  // generates an integer array from 1 through daysInMonth, inclusive
  let dates = Array(daysInMonth).fill().map((x,i)=>i)
  // adding the last day of the month
  dates.push(dates.length)
  // removing the 0 date
  dates.shift()
  return dates
}

function randomString(len) {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todo_data: {},
      taskList: taskList,
      antiTaskList: antiTaskList,
      habits: null,
      today: moment(),
      taskInput: "",
      antiTaskInput: "",
      active_date: moment()  // the date that we show the data for
    };

    // binding the event handlers
    this.onTodoCreate = this.onTodoCreate.bind(this);
    this.onAntiTodoCreate = this.onAntiTodoCreate.bind(this);
    this.onToggleCheck = this.onToggleCheck.bind(this);
    this.onTaskInputChange = this.onTaskInputChange.bind(this);
    this.onAntiTaskInputChange = this.onAntiTaskInputChange.bind(this);
    this.onDateArrowClick = this.onDateArrowClick.bind(this);
    this.onJumpTodayClick = this.onJumpTodayClick.bind(this);
    this.onTaskChange = this.onTaskChange.bind(this);
    this.onAntiTaskChange = this.onAntiTaskChange.bind(this);
    this.onTaskSubmit = this.onTaskSubmit.bind(this);
    this.onAntiTaskSubmit = this.onAntiTaskSubmit.bind(this);
  }

  componentDidMount() {

    // updating the API endpoint
    axios.get(`${API_URL}/api/todo/get-today/`,
           {withCredentials: true}
          )
    .then(res => {
      // on successful response, we should log it
      console.log(res.data)
      this.setState({})
    })
    .catch((error) => {  // TODO: set the state for an error
      console.log(error)
      this.setState({})
    });

    // populating the habits
    axios.get(`${API_URL}/api/habits/get-habits/`,
           {withCredentials: true}
          )
    .then(res => {
      // on successful response, we should log it
      console.log(res.data.habits)
      this.setState({habits: res.data.habits})
    })
    .catch((error) => {  // TODO: set the state for an error
      console.log(error)
      this.setState({})
    });


  }


  onTaskSubmit(e) {
    // this is the onKeyDown handler for an already saved task item
    const key = e.currentTarget.dataset.key
    console.log(e.key)

    if (e.key === 'Enter' && e.target.value === "") {
      console.log('deleting..')
      // if enter is pressed and the input is blank
      // the task should be deleted
      // creating a new todos array
      let newTodos = JSON.parse(JSON.stringify(this.state.taskList))

      // deleting the task
      for(let i = 0; i < newTodos.length; i++) {
        if (newTodos[i].key === key) {
          // deleting the task
          newTodos.splice(i, 1);
          break;
        }
      }

      // updating the state with the new todos list
      const newState = {
        ...this.state,
        taskList: newTodos,
      }
      this.setState(newState);
    }

  }

  onAntiTaskSubmit(e) {
    // this is the onKeyDown handler for an already saved anti-task item
    const key = e.currentTarget.dataset.key
    console.log(e.key)

    if (e.key === 'Enter' && e.target.value === "") {
      console.log('deleting..')
      // if enter is pressed and the input is blank
      // the task should be deleted
      // creating a new todos array
      let newTodos = JSON.parse(JSON.stringify(this.state.antiTaskList))

      // deleting the task
      for(let i = 0; i < newTodos.length; i++) {
        if (newTodos[i].key === key) {
          // deleting the task
          newTodos.splice(i, 1);
          break;
        }
      }

      // updating the state with the new todos list
      const newState = {
        ...this.state,
        antiTaskList: newTodos,
      }
      this.setState(newState);
    }
  }



  onJumpTodayClick(e) {
    this.setState({active_date: this.state.today})
  }

  onDateArrowClick(e) {
    const orientation = e.currentTarget.dataset.orientation
    console.log(orientation)

    let new_date;
    if (orientation === "right") {
      new_date = this.state.active_date.add(1, 'days')


    } else if (orientation === "left") {
      new_date = this.state.active_date.subtract(1, 'days')
    }

    this.setState({active_date: new_date})

  }

  onTaskChange(e) {
    // when we edit an existing task
    const key = e.currentTarget.dataset.key

    // creating a new todos array
    let newTodos = JSON.parse(JSON.stringify(this.state.taskList))

    // updating the task
    for(let i = 0; i < newTodos.length; i++) {
      if (newTodos[i].key === key) {
        newTodos[i].content = e.target.value
      }
    }

    // updating the state with the new todos list
    const newState = {
      ...this.state,
      taskList: newTodos,
    }
    this.setState(newState);
  }

  onAntiTaskChange(e) {
    // when we edit an existing anti-task
    const key = e.currentTarget.dataset.key

    // creating a new todos array
    let newTodos = JSON.parse(JSON.stringify(this.state.antiTaskList))

    // getting the task
    for(let i = 0; i < newTodos.length; i++) {
      if (newTodos[i].key === key) {
        newTodos[i].content = e.target.value
      }
    }

    // updating the state with the new anti todos list
    const newState = {
      ...this.state,
      antiTaskList: newTodos,
    }
    this.setState(newState);
  }

  onTaskInputChange(e) {
    this.setState({taskInput: e.target.value})
  }

  onAntiTaskInputChange(e) {
    this.setState({antiTaskInput: e.target.value})
  }

  onTodoCreate(e) {

    // ensuring the string is not just whitespace
    if (e.key !== 'Enter' || !/\S/.test(this.state.taskInput)) {
      return
    }
    // creating a new todos array
    let newTodos = JSON.parse(JSON.stringify(this.state.taskList))
    newTodos.push({
      content: this.state.taskInput,
      completed: false,
      key: randomString(32)
    })
    // updating the state
    const newState = {
      ...this.state,
      taskList: newTodos,
      taskInput: ""
    }
    this.setState(newState);

  }

  onAntiTodoCreate(e) {

    // ensuring the string is not just whitespace
    if (e.key !== 'Enter' || !/\S/.test(this.state.antiTaskInput)) {
      return
    }
    // creating a new todos array
    let antiNewTodos = JSON.parse(JSON.stringify(this.state.antiTaskList))
    let new_todo = {
      content: this.state.antiTaskInput,
      completed: false,
      key: randomString(32)
    }
    antiNewTodos.push(new_todo)
    // updating the state
    const newState = {
      ...this.state,
      antiTaskList: antiNewTodos,
      antiTaskInput: ""
    }
    this.setState(newState);

    // data to POST to API
    let post_data = {
      anti_todo: true,
      key: new_todo.key,
      body: new_todo.content,
      date: this.state.active_date,
      order: antiNewTodos.length,
      completed: false
    }

    // updating the API endpoint
    axios.post(`${API_URL}/api/todo/create/`,
           post_data,
           {withCredentials: true}
          )
    .then(res => {
      // on successful response, we should log it
      this.setState({})
    })
    .catch((error) => {  // TODO: set the state for an error
      console.log(error)
      this.setState({})

    });


  }

  onToggleCheck(e) {
    const key = e.currentTarget.dataset.key
    const completed = e.currentTarget.dataset.completed
    console.log(completed)

    // creating a new todos array
    const newTodos = JSON.parse(JSON.stringify(this.state.taskList))

    let update_me;
    for (let i = 0; i < this.state.taskList.length; i++) {
      if (this.state.taskList[i].key === key) {
        update_me = Object.assign(this.state.taskList[i])

        // deleting the old object from the array
        newTodos.splice(i, 1);

        // updating the new object
        update_me.completed = !update_me.completed
        // placing the new object in the cloned array at the end
        // the new object MUST be at the end otherwise it will mess up dragging and dropping
        newTodos.splice(this.state.taskList.length - 1, 0, update_me)
      }
    }

    // updating the state
    const newState = {
      ...this.state,
      taskList: newTodos
    }
    console.log(newState)
    this.setState(newState);
  }

  onDragEnd = (result) => {
    // the only one that is required
    console.log(result)

    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    // we do nothing if the item has not been moved
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
          return
    }

    // if we have an anti todo, we handle it accordingly
    if (source.droppableId === "droppable3") {
      // first we create a new deep copy of the old taskList
      const newAntiTodos = JSON.parse(JSON.stringify(this.state.antiTaskList))
      // then we delete the element from source index
      let delete_index;
      // finding the element of the index to delete
      for (let i = 0; i < this.state.antiTaskList.length; i++) {
        if (this.state.antiTaskList[i].key === draggableId) {
          delete_index = i;
        }
      }
      newAntiTodos.splice(delete_index, 1);
      // then we add the element to the new array at the destination index
      console.log(this.state.antiTaskList)

      // getting the element to add
      let move_me;
      for (let i = 0; i < this.state.antiTaskList.length; i++) {
        if (this.state.antiTaskList[i].key === draggableId) {
          move_me = Object.assign(this.state.antiTaskList[i])
        }
      }

      // adding the element to the new array's destination index
      newAntiTodos.splice(destination.index, 0, move_me)
      const newState = {
        ...this.state,
        antiTaskList: newAntiTodos
      }
      console.log(newState)

      this.setState(newState);
      return;
    }

    let completed = destination.droppableId === "droppable2"
    console.log("completed: " + completed)


    console.log('prepping to replace...')

    // first we create a new deep copy of the old taskList
    const newTodos = JSON.parse(JSON.stringify(this.state.taskList))
    console.log(this.state.taskList)
    console.log(newTodos)
    // then we delete the element from source index
    let delete_index;

    // finding the element of the index to delete
    for (let i = 0; i < this.state.taskList.length; i++) {
      if (this.state.taskList[i].key === draggableId) {
        delete_index = i;
      }
    }
    newTodos.splice(delete_index, 1);
    console.log(newTodos)
    // then we add the element to the new array at the destination index
    console.log("original")
    console.log(this.state.taskList)

    // getting the element to add
    let move_me;
    for (let i = 0; i < this.state.taskList.length; i++) {
      if (this.state.taskList[i].key === draggableId) {
        move_me = Object.assign(this.state.taskList[i])
      }
    }

    if (!move_me) {
      for (let i = 0; i < this.state.antiTaskList.length; i++) {
        if (this.state.antiTaskList[i].key === draggableId) {
          move_me = Object.assign(this.state.antiTaskList[i])
        }
    }
  }

    if (move_me['completed']) {
      move_me['completed'] = completed
    }
    // adding the element to the new array's destination index
    newTodos.splice(destination.index, 0, move_me)

    console.log(newTodos)
    const newState = {
      ...this.state,
      taskList: newTodos
    }
    console.log(newState)

    this.setState(newState);


  };



  render() {

    let TodayItem = this.state.active_date.format("YYYY-MM-DD") === this.state.today.format("YYYY-MM-DD") ? null : <p onClick={this.onJumpTodayClick} className="jump-today">Today</p>
    return (

      <div className="outer-wrapper">
      <div className="wrapper">
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >


        <div className="day-container">


        <div className="day-container-header">
          <h3 data-orientation="left" onClick={this.onDateArrowClick} className="arrow date-arrow-left">&#8592;</h3>
          <h3 data-orientation="right" onClick={this.onDateArrowClick} className="arrow date-arrow-right">&#8594;</h3>
          <h3 className="date-header">{this.state.active_date.format('dddd MMMM Do')}</h3>
          {TodayItem ? TodayItem : null }

        </div>


          <div className='flex-container'>
          <div className="notecard">
          <p className="notecard-header">Todo List</p>
          <p className="notecard-subheader">
          A short list of 3 to 5 things you plan on doing today.
          </p>
          <div className="notecard-body">

          <Droppable

          type="TASK"
          droppableId="droppable1">
          {(provided, snapshot) => (
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            >
            <div className="notecard-row add-item-container">

            <div className="checkmark-container">
              <p className="plus-sign">+</p>
            </div>
            <input
            onChange={this.onTaskInputChange}
            value={this.state.taskInput}
            onKeyPress={this.onTodoCreate}
            rows="1"
            placeholder="Add new todo"
            className="textarea-input add-item"></input>
            </div>
            {this.state.taskList.filter(function (task) {
              return !task.completed
            }).map((task, index) => (
              <Draggable
              key={task.key}
              draggableId={task.key}
              index={index}
              >
              {(provided, snapshot) =>  (
                <div
                className={snapshot.isDragging ? "notecard-row notecard-row-dragging" : "notecard-row"}
                ref={provided.innerRef}
                {...provided.draggableProps}
                >
                  <div
                  className="drag-handle"
                  {...provided.dragHandleProps}
                  >&#9776;</div>
                  <div data-key={task.key} onClick={this.onToggleCheck} className="checkmark-container">
                    <p className="checkmark">&#10004;</p>
                  </div>
                  <input
                  onKeyDown={this.onTaskSubmit}
                  data-key={task.key}
                  onChange={this.onTaskChange}
                  defaultValue={task.content}
                  rows="1"
                  className="textarea-input" />
                </div>
              )}

              </Draggable>
            ))}
            {provided.placeholder}
            </div>

          )}
          </Droppable>
          <Droppable
          type="TASK"
          droppableId="droppable2">
          {(provided, snapshot) => (
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            >
            <p className="todo-completed">Completed</p>
            {this.state.taskList.filter(function (task) {
              return task.completed
            }).length === 0 ?
            <p className="notecard-subheader no-completed-tasks">
            No completed tasks.
            </p>
            : null}
            {this.state.taskList.filter(function (task) {
              return task.completed
            }).map((task, index) => (
              <Draggable
              key={task.key}
              draggableId={task.key}
              index={index}
              >
              {(provided, snapshot) =>  (
                <div
                className={snapshot.isDragging ? "notecard-row notecard-row-dragging" : "notecard-row"}
                ref={provided.innerRef}
                {...provided.draggableProps}
                >
                  <div
                  className="drag-handle"
                  {...provided.dragHandleProps}
                  >&#9776;</div>
                  <div data-key={task.key} onClick={this.onToggleCheck} className="checkmark-container checkmark-container-green">
                    <p className="checkmark checkmark-green">&#10004;</p>
                  </div>
                  <input
                  defaultValue={task.content}
                  rows="1"
                  className="textarea-input notecard-row-completed" />
                </div>
              )}

              </Draggable>
            ))}
            {provided.placeholder}
            </div>

          )}
          </Droppable>


          </div>
          </div>


          <div className="notecard">
          <p className="notecard-header">Anti-Todo List</p>
          <p className="notecard-subheader">
          Whenever you do something useful that isn't on your todo list,
          write it down here.
          </p>
          <div className="notecard-body">

          <Droppable
          type="ANTI_TASK"
          droppableId="droppable3">
          {(provided, snapshot) => (
            <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            >
            <div className="notecard-row add-item-container">

            <div className="checkmark-container">
              <p className="plus-sign">+</p>
            </div>
            <input
            onChange={this.onAntiTaskInputChange}
            onKeyPress={this.onAntiTodoCreate}
            value={this.state.antiTaskInput}
            rows="1"
            placeholder="Add new anti-todo"
            className="textarea-input add-item"></input>
            </div>
            {this.state.antiTaskList.filter(function (task) {
              return !task.completed
            }).map((task, index) => (
              <Draggable
              key={task.key}
              draggableId={task.key}
              index={index}
              >
              {(provided, snapshot) =>  (
                <div
                className={snapshot.isDragging ? "notecard-row notecard-row-dragging" : "notecard-row"}
                ref={provided.innerRef}
                {...provided.draggableProps}
                >
                  <div
                  className="drag-handle"
                  {...provided.dragHandleProps}
                  >&#9776;</div>
                  <div className="checkmark-container checkmark-container-green">
                    <p className="checkmark checkmark-green">&#10004;</p>
                  </div>
                  <input
                  data-key={task.key}
                  onKeyDown={this.onAntiTaskSubmit}
                  onChange={this.onAntiTaskChange}
                  defaultValue={task.content}
                  rows="1"
                  className="textarea-input" />
                </div>
              )}

              </Draggable>
            ))}
            {provided.placeholder}
            </div>

          )}
          </Droppable>
          </div>
          </div>
          </div>
          </div>
          <TimeKeeper />
          <div className="notecard deep-work">
          <p className="notecard-header">Deep Work</p>
          <p className="notecard-subheader">
          A heatmap of your time spent doing deep work. The scale ranges from 0-4 hours.
          </p>
          <div className="notecard-body deep-work-body">
          <CalendarHeatmap
            startDate={new Date('2019-01-01')}
            endDate={new Date('2019-12-31')}
            values={[
              { date: '2019-01-01', count: 0 },
              { date: '2019-01-02', count: 1 },
              { date: '2019-01-03', count: 2 },
              { date: '2019-01-04', count: 3 },
              { date: '2019-01-05', count: 4 },
              // ...and so on
            ]}
            classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${value.count}`;
          }}
          />
          </div>
          </div>

          <div className="notecard data-input">
          <p className="notecard-header">Deep Hours</p>
          <p className="notecard-subheader">
          Update the number deep work hours you got done today.
          </p>
          <div className="notecard-body deep-work-body flex-container">

          <div className="div-button float-left">-</div>
          <div className="data-value-integer">2<br/><span className="hours-subtext">hours</span></div>

          <div className="div-button float-right">+</div>


          </div>
          </div>


          <div className="notecard habit-tracker">
          <p className="notecard-header">Habit Engineering</p>
          <p className="notecard-subheader">
          A way to engineer new habits.
          </p>
          <div className="notecard-body">
          <table className="habit-table">
          <tbody>
          <tr>
            <th className="habit-header">Habit</th>
            <HabitDates today={this.state.today}/>
          </tr>
          <Habits habits={this.state.habits} />


          </tbody>
          </table>
          </div>
          </div>
        </DragDropContext>

      </div>
      </div>
    );
  }

}


function HabitDates(props) {
// generates the dates for the habit table
  const dates = generateDateArray(moment().daysInMonth()).map((date, index) =>
  <th key={index} className={props.today.date() === date ? "date-table-header today-highlight" : "date-table-header"}>{date}</th>)

  return dates;
}

function Habits(props) {
  // populates the rows for the habit table
  let habits = props.habits

  if (habits == null) {
    return <tr>
    <th colSpan="999">
    <img
    className="spinner"
    src={Spinner} alt=""/>
    </th>
    </tr>
  } else if (habits.length === 0) {
    return <tr>
    <th colSpan="999">
    <p className="no-habits">No habits</p>
    </th>
    </tr>
  } else {
    const HabitRows =  habits.map((habit, index) =>
      <tr key={index}>
      <td className={index % 2 === 0 ? "date-table-header habit-header" : "date-table-header habit-header even-row"}>{habit.habit}</td>
      {generateDateArray(moment().daysInMonth()).map((date, index) =>
        <th key={index} className={habit.completed ? "date-table-header did-habit" : "date-table-header"}>
        </th>
      )}
      </tr>)
    return HabitRows
  }

}

export default App;
