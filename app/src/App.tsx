import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import './App.css'
import { io } from "socket.io-client";
import * as ethers from 'ethers';

const isInside = (point: any, rect: any) => point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;

const months = ['january', 'february', 'march', "april", "may", "june", "july", "august", "september", "october", "november", "december"]
const shifts = [3,6,6,2,4,0,2,5,1,3,6,1]
const priorMonthShifts = [9,12,13,8,10,6,8,11,7,9,12,7]

function App() {
  const [menu, setMenu] = useState(0)
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

  const [canDelete, setCanDelete] = useState(null)

  function clicked(evt: any){
      var e = evt.target;
      console.log(e.id)

      for(let i = 0; i < shapes.length; i++){
        if(shapes[i].key == e.id){
          setCanDelete(e.id)
        }
      }

      var dim = e.getBoundingClientRect();
      var x = evt.clientX - dim.left;
      var y = evt.clientY - dim.top;


      for(let i = 0; i < 7; i++){
      for(let j = 0; j < 7; j++){
        console.log()
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
  }  

  function is_in_triangle (px: any,py: any,ax: any,ay: any,bx: any,by: any,cx: any, cy: any){
    //credit: http://www.blackpawn.com/texts/pointinpoly/default.html

    var v0 = [cx-ax,cy-ay];
    var v1 = [bx-ax,by-ay];
    var v2 = [px-ax,py-ay];

    var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
    var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
    var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
    var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
    var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

    var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return ((u >= 0) && (v >= 0) && (u + v < 1));
}

  const [dates, setDates] = useState<any>([])

  function daysInMonth(month: any, year: any) {
      return new Date(year, month, 0).getDate();
  }

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
  }, [])

  useEffect(() => {
    const dateNumbers = []
    let index = 0
    let days;
    console.log('month', month)

    // a hack, but a small one
    days = daysInMonth(month-1, 2024)-priorMonthShifts[month-1]

    let shift = shifts[month-1]
    for(var i = ((daysInMonth(month-1, 2025))+(-6-shift)); i <= (daysInMonth(month-1, 2025)); i++) {
      console.log(i)
      index++
      dateNumbers.push(<text x={7+(index%7 == 0 ? 6 : (index-1)%7)*100} y={23+Math.ceil(index/7)*100-100} fill="black">{days++}</text>)
    }

    index = 1

    for(var  i = 1+shift; i <= (daysInMonth(month, 2025))+shift; i++) {
      console.log(i)
      dateNumbers.push(<text x={7+(i%7 == 0 ? 6 : (i-1)%7)*100} y={123+Math.ceil(i/7)*100-100} fill="black">{index++}</text>)
    }

    shift = ((index-7)%7)+shift
    index = 1
    
    for(var  i = 1+shift-1; i <= (daysInMonth(month, 2025))+shift; i++) {
      console.log(i)
      dateNumbers.push(<text  x={7+(i%7 == 0 ? 6 : (i-1)%7)*100} y={523+Math.ceil(i/7)*100-100} fill="black">{index++}</text>)
    }
    
    setDates(dateNumbers)
    console.log(dates)
  }, [month])
  useEffect(() => {
    console.log(month)
    console.log(shapes)

    setNotes(localStorage.getItem(JSON.stringify(addingXShape+":"+addingYShape)))
  }, [dates, month, shapes, addShapes])

  useEffect(() => {

  }, [notes])

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
          <polygon key={i} id={i} points={polygons[i]} style={{stroke: 'purple', fill:'transparent'}} />
        )
      }

      setShapes(tempShapes)
    }
  }, [month])

  const addWindow = () => {
    const tempShapes = shapes

    setCounter(counter+1)

    console.log(addingYShape)

    tempShapes.push(
      <polygon id={tempShapes.length-1} points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${150+100*addingXShape+","+(150+(addingYShape)*100)} ${50+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
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
    setAddShapes(null)
  }

  const [allowlist, setAllowlist] = useState([{id: 0, name: 'morgan'},{ id: 1, name: '~zod'}])
  const [newUser, setNewUser] = useState(null)

  useEffect(() => {

  }, [newUser, allowlist, notes])
 
  return (
    <>
          <br/>
      <br/>
      <br/>
      <div style={{margin: 'auto'}}>

    {/* <input placeholder="search user"></input> */}
      </div>

      
      <div>
        <span id="menu" style={{padding: '20px', cursor: 'pointer', textDecoration: menu == 0 && 'underline'}} onClick={() => setMenu(0)}><span style={{textDecoration: 'line-through'}}>U</span> calenda(t)</span>
        <span id="menu" style={{padding: '20px',  cursor: 'pointer', textDecoration: menu == 1 &&'underline'}}onClick={() => setMenu(1)}>⇆ sharing (soon)</span>
        <span id="menu" style={{padding: '20px',  cursor: 'pointer', textDecoration: menu == 2 && 'underline'}}onClick={() => setMenu(2)}>⚔ allowlist</span>
      </div>
      <br/>
      {
        menu == 2 && <div style={{width: '300px', margin: 'auto'}}>
          <br/>
          <p style={{color: 'grey'}}>add a friend by identifier</p>
          <input style={{padding: '7px', width: '232px', textAlign: 'center'}} placeholder="user.eth, user@domain, ~zod ..." onChange={(evt: any) => setNewUser(evt.target.value)}></input>
          <br/>
          <br/>
          <button onClick={() => {console.log(newUser);setAllowlist((allowlist) => [...allowlist, {name: newUser, id: allowlist.length}]); setNewUser(null)}}>enter</button>
          <br/>

          <ul>{allowlist.map((person: any, id: any) => {
            return <li style={{textAlign: 'center', width: '232px', padding: '5px'}}>{person.name} <span id='x-remove' style={{float: 'right', cursor: 'pointer'}} onClick={() => setAllowlist((prevItems) => prevItems.filter((item) => item.id !== id))}>❌</span></li>
          })}</ul>
        </div>
      }

      {
        menu == 1 && <div>
          <br/>
          <input style={{padding: '7px', width: '232px', textAlign: 'center'}} placeholder="user.eth, user@domain, ~zod ..." onChange={(evt: any) => setNewUser(evt.target.value)}></input>
          &nbsp;&nbsp;
          
          <button onClick={() => {console.log(newUser);setAllowlist((allowlist) => [...allowlist, {name: newUser, id: allowlist.length}]); setNewUser(null)}}>enter</button>
          <br/>
          <br/>
          <p style={{color: 'lime'}}>one-time shared</p>
          <p style={{color: 'red'}}>user offline</p>
        </div>
      }

      {menu == 0 && <main style={{ padding: 10 }}>
        <span><button id='controls' onClick={() => setMonth(month!-1)}>prev</button></span><span style={{display: 'inline-block'}}><p>&nbsp;&nbsp;{months[month-1]}&nbsp;&nbsp;</p></span><span><button id='controls' onClick={() => {setMonth(month!+1)}}>next</button></span>
        <div>
          {/* <button className="sb-button" onClick={() => setCollapsed(!collapsed)}>
            notes
          </button> */}
          {addShapes && <div>

          <p style={{color: 'grey'}}>add notes to the day</p>
          <textarea value={notes} onChange={(evt) => {console.log(evt.target.value);setNotes(evt.target.value)}} style={{height: '50px', width: '250px'}}></textarea>
          <br/>
          <br/>

          <button onClick={() => saveNotes()}>&nbsp;save&nbsp;</button>
          </div>}
          <br/>
          {addShapes && <hr/>}
          <br/>
          {canDelete && <><br/><button style={{background: 'red'}} onClick={() => {setCanDelete(false);setShapes((prevItems) => prevItems.filter((item) => {
            if(item.key === canDelete){
              let polygons = JSON.parse(localStorage.getItem(month))
              delete polygons[item.key]
              polygons = polygons.filter((el) => el == null)
              localStorage.setItem(month, JSON.stringify(polygons))
            }
            return item.key !== canDelete
          }))}}>delete</button></>}
          <br/>
          <br/>

    {addShapes && <div style={{margin: 'auto'}}>
    {/* <button onClick={() => addEmergence()}>emergence</button> */}
    &nbsp;
    &nbsp;
     <button onClick={() => addWindow()}>window</button>
     &nbsp;
    &nbsp;
     {/* <button onClick={() => addRebound()}>&nbsp;rebound&nbsp;</button> */}
    </div> }
    
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
      </main>}
    </>
  )
}

export default App
