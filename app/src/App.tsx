import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import './App.css'
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

const isInside = (point: any, rect: any) => point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;

const months = ['January', 'February', 'March', "April", "May", "June", "July", "August", "september", "October", "November", "December"]
const shifts = [3,6,6,2,4,0,2,5,1,3,6,1]
const priorMonthShifts = [9,12,13,8,10,6,8,11,7,9,12,7]

function App() {
  const [collapsed, _] = useState<any>(0)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth()+1
  const [month, setMonth] = useState<any>(currentMonth)
  const [counter, setCounter] = useState<any>(0)

  const [shapes, setShapes] = useState<any>([])
  const [notes, setNotes] = useState<any>(null)

  const [addShapes, setAddShapes] = useState<any>(false)
  const [addingXShape, setAddingXShape] = useState<any>(null)
  const [addingYShape, setAddingYShape] = useState<any>(null)

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
  }, [])

  function clicked(evt: any){
      var e = evt.target;
      var dim = e.getBoundingClientRect();
      var x = evt.clientX - dim.left;
      var y = evt.clientY - dim.top;

      for(let i = 0; i < 7; i++){
      for(let j = 0; j < 7; j++){
        // console.log({x: x, y: y}, {top: j*100, bottom: (j+1)*100, left: i*100, right: (i+1)+100})
        // console.log(isInside({x: x, y: y}, {top: j*100, bottom: (j+1)*100, left: i*100, right: (i+1)*100}))
        if(isInside({x: x, y: y}, {top: j*100, bottom: (j+1)*100, left: i*100, right: (i+1)*100})){
          // alert((i+1)*(j+1))
          setAddShapes(true)
          setCounter(counter+1)

          setAddingXShape(i)
          setAddingYShape(j)
        }
      }
      }

      // alert(x + " " + y)
  }  

  const [dates, setDates] = useState<any>([])

  function daysInMonth(month: any, year: any) {
      return new Date(year, month, 0).getDate();
  }

  useEffect(() => {
    const dateNumbers = []
    let index = 0
    let days;
    console.log('month', month)

    // a hack, but a small one
    days = daysInMonth(month-1, 2024)-priorMonthShifts[month-1]

    let shift = shifts[month-1]
    for(var i = ((daysInMonth(month-1, 2025))+(-6-shift)); i <= (daysInMonth(month-1, 2025)); i++) {
      index++
      dateNumbers.push(<text x={7+(index%7 == 0 ? 6 : (index-1)%7)*100} y={23+Math.ceil(index/7)*100-100} fill="black">{days++}</text>)
    }

    index = 1

    for(var  i = 1+shift; i <= (daysInMonth(month, 2025))+shift; i++) {
      dateNumbers.push(<text x={7+(i%7 == 0 ? 6 : (i-1)%7)*100} y={123+Math.ceil(i/7)*100-100} fill="black">{index++}</text>)
    }

    shift = ((index-7)%7)+shift
    index = 1
    
    for(var  i = 1+shift-1; i <= (daysInMonth(month, 2025))+shift; i++) {
      dateNumbers.push(<text  x={7+(i%7 == 0 ? 6 : (i-1)%7)*100} y={523+Math.ceil(i/7)*100-100} fill="black">{index++}</text>)
    }
    
    setDates(dateNumbers)
    console.log(dates)
  }, [month])
  useEffect(() => {
    console.log(month)
    console.log(shapes)

    console.log(localStorage.getItem(JSON.stringify(addingXShape+":"+addingYShape)))

    setNotes(localStorage.getItem(JSON.stringify(addingXShape+":"+addingYShape)))
  }, [dates, month, shapes, counter, addShapes])

  useEffect(() => {
    const polygons = JSON.parse(localStorage.getItem(month)!)
    console.log(polygons)
      setShapes([])

    if(!polygons){
      setShapes([])
      localStorage.setItem(month, JSON.stringify([]))
    }else {

      const tempShapes = []
      for(let i = 0; i < polygons.length; i++){
        tempShapes.push(
          <polygon points={polygons[i]} style={{stroke: 'purple', fill:'transparent'}} />
        )
      }

      setShapes(tempShapes)
    }
  }, [notes, month])

  const addWindow = () => {
    const tempShapes = shapes

    setCounter(counter+1)

    console.log(addingYShape)

    tempShapes.push(
      <polygon points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${150+100*addingXShape+","+(150+(addingYShape)*100)} ${50+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
    )

    console.log(tempShapes)

    const polygons = JSON.parse(localStorage.getItem(month)!)
  
    polygons.push(`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${150+100*addingXShape+","+(150+(addingYShape)*100)} ${50+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`)
    
    console.log(polygons)

    console.log(polygons==tempShapes)

    localStorage.setItem(month,JSON.stringify(polygons))

    setShapes(tempShapes)
    setAddShapes(false)
  }

  // const addRebound = () => {
  //   setCounter(counter+1)
  //   const tempShapes = shapes

  //   tempShapes.push(
  //     <polygon points="250,50 350,20 450,50 350,80" style={{stroke: 'purple', fill:'transparent'}} />
  //   )
  //   setShapes(tempShapes)
  //         setAddShapes(false)

  // }
  
  // const addWindow = () => {
  //   setCounter(counter+1)

  //   const tempShapes = shapes

  //   tempShapes.push(
  //     <polygon points="550,30 750,30 650,150" style={{stroke: 'purple', fill:'transparent'}} />
    
  //   )
  //   setShapes(tempShapes)
  //         setAddShapes(false)

  // }

  // const addTree = () => {
  //   setCounter(counter+1)

  //   const tempShapes = shapes
  //    tempShapes.push(
  //     <polygon points="950,30 850,150 850,450 950,550 1050,450 1050,150 " style={{stroke: 'purple', fill:'transparent'}} />
  //   )
  //   setShapes(tempShapes)
  //   setAddShapes(false)

  // }

  const saveNotes = () => {
    console.log(notes)
    localStorage.setItem(JSON.stringify(addingXShape+":"+addingYShape),notes)
  }

 
  return (
    <>
    <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
      {addShapes&&<Sidebar collapsed={collapsed}>
        <Menu>
          {/* <MenuItem>✕ delete</MenuItem> */}
          <MenuItem onClick={() => setAddShapes(false)}>✍ close notes</MenuItem>
         <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{height: '200px'}}></textarea>
          <MenuItem onClick={() => saveNotes()}>save</MenuItem>

        </Menu>
      </Sidebar>}
      <main style={{ padding: 10 }}>
        <p>{months[month-1]}</p>
        <div>
          {/* <button className="sb-button" onClick={() => setCollapsed(!collapsed)}>
            notes
          </button> */}
    &nbsp;
    &nbsp;
    <br/>
    <br/>
    {addShapes && <div>
{/* <button onClick={() => addEmergence()}>emergence</button> */}

    &nbsp;
    &nbsp;
     <button onClick={() => addWindow()}>window</button>
    &nbsp;
    &nbsp;
    &nbsp;
     {/* <button onClick={() => addTree()}>tree</button> */}
    &nbsp;
    &nbsp;
     {/* <button onClick={() => addRebound()}>rebound</button> */}
    </div> }
    
     <br/>
      <button  onClick={() => setMonth(month!-1)}>prev month</button>
      &nbsp;&nbsp;
      <button onClick={() => {setMonth(month!+1)}}>next month</button>
     <br/>
     <br/>
     <br/>
     <svg onClick={clicked} height="701" width="701" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" onClick={() => alert('hi')} fill="transparent"/>
        <path d="M 100 0 L 0 0 0 100" fill="transparent" stroke="gray" stroke-width="1"/>
      </pattern>
    </defs>
    {dates}
    <rect width="100%" height="100%" fill="url(#grid)"/>
      {shapes?.map((shape: any) => shape)}

    </svg>
        </div>
      </main>
    </div>
    </>
  )
}

export default App
