import { useState, useRef, useEffect } from "react";
import './App.css'
import { VFAASNet } from './VFAASNet'

const isInside = (point: any, rect: any) => point.x > rect.left && point.x < rect.right && point.y > rect.top && point.y < rect.bottom;

const months = ['january', 'february', 'march', "april", "may", "june", "july", "august", "september", "october", "november", "december"]
const shifts = [3,6,6,2,4,0,2,5,1,3,6,1]
const priorMonthShifts = [9,12,13,8,10,6,8,11,7,9,12,7]

// use level
let vfaasNet: any;

//@ts-ignore
let id: any;



const styles = {
  container: {
    margin: 'auto',
    display: 'inline-block',
    width: '420px',
    border: "1px solid #ddd",
    borderRadius: "5px",
    // @ts-ignore
    margin: "0px 0",
    overflow: "hidden",
  },
  // header: { display: 'flex', cursor: 'pointer', padding: '10px 15px', backgroundColor: '#f5f5f5' },
  title: { margin: 0, marginLeft: '20px', fontFamily: 'Courier',fontSize: "16px", fontWeight: "500" },
  content: { overflow: "hidden", transition: "height 0.3s ease" },
  innerContent: {
    padding: "10px 15px",
    backgroundColor: "#fff",
    width: "100%",
    height: '100%'
  },
  inputGroup: {
    margin:'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: "center",
    gap: '15px',
  },
  input: { width: "50px" },
  select: { marginLeft: "5px" },
  tabContainer: {
    top: 0,
    position: "fixed",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "space-around",
    width: "200px",
  },
  tab: {
    cursor: "pointer",
    fontSize: "16px",
    padding: "10px",
    transition: "border-bottom 0.3s ease",
  },
  containerTab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    position: "fixed",
    top: 0,
    padding: "10px 0",
  },
  chartContainer: {
    width: "330px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    padding: "10px 0",
  },
  row: {
    display: "flex",
    borderBottom: "1px solid #e0e0e0",
    padding: "8px 0",
    fontSize: "5px",
  },
  column: {
    flex: 1,
    width: "200px",
    padding: "10px",
    fontSize: "19px",
    textAlign: "center",
  },
  columnHistory: {
    flex: 1,
    width: "100px",
    padding: "5px",
    fontSize: "12px",
    textAlign: "center",
  },
  dataContainer: {
    maxHeight: "200px",
    overflowY: "auto",
  },
  label: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
  },
  checkbox: {
    opacity: "0",
    marginRight: "120px",
  },
  buttons: {
    primary: {
      fontFamily: 'Tiny5',
      backgroundColor: "blue",
    },
  },
};

// CollapsibleCard component
const CollapsibleCard = ({ title, children }: any) => {
  const [isOpen, setIsOpen] = useState<any>(false);
  const [height, setHeight] = useState<any>(0);
  const contentRef = useRef<any>(null);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      setHeight(contentRef.current.scrollHeight + 20);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header} onClick={toggleCollapse}>
          <h3 style={styles.title}>{title} {title=='reminders' && <>
          (<div className="circle">
</div> <span>offline)</span></>}
          </h3>
        </div>

        <div
          ref={contentRef}
          style={{
            ...styles.content,
            height: `${height}px`,
            transition: "height 0.3s ease",
          }}
        >
          <div style={styles.innerContent}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const [menu, setMenu] = useState(0)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth()+1
  const [month, setMonth] = useState<any>(currentMonth)
  const [counter, setCounter] = useState<any>(0)

  const [shapes, setShapes] = useState<any>([])
  const [notes, setNotes] = useState<any>(null)

  const [addShapes, setAddShapes] = useState<any>(false)
  const [addingXShape, setAddingXShape] = useState<any>(null)
  const [addingYShape, setAddingYShape] = useState<any>(null)

  const [canDelete, setCanDelete] = useState<any>(null)
  //@ts-ignore
  const [selectedColor, setSelectedColor] = useState(JSON.parse(localStorage.getItem(JSON.stringify('selected color'))))

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

  const [dates, setDates] = useState<any>([])

  function daysInMonth(month: any, year: any) {
      return new Date(year, month, 0).getDate();
  }

  useEffect(() => {

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

    let color;

    if(selectedColor == 0){
      color = 'rgb(0, 255, 234)'
    } else if(selectedColor == 1) {
      color = 'rgb(164, 0, 164)'

    }else if(selectedColor == 2) {
      color = 'blue'

    }else if(selectedColor == 3) {
      color = 'rgb(255, 71, 86)'

    }else if(selectedColor == 4) {
      color = 'gold'
    }

    if(!polygons){
      setShapes([])
      localStorage.setItem(month, JSON.stringify([]))
    }else {

      const tempShapes = []
      for(let i = 0; i < polygons.length; i++){
        tempShapes.push(
          //@ts-ignore
          <polygon key={i} id={i} points={polygons[i]} style={{stroke: color, fill:'transparent'}} />
        )
      }

      setShapes(tempShapes)
    }
  }, [month, selectedColor])

  const addWindow = () => {
    const tempShapes = shapes

    setCounter(counter+1)

    console.log(addingYShape)

    tempShapes.push(
      //@ts-ignore
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
  
  const addEmergence = () => {
    setCounter(counter+1)

    const tempShapes = shapes

    tempShapes.push(
      //@ts-ignore
      <polygon id={tempShapes.length-1} points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />

      // <polygon points="550,30 750,30 650,150" style={{stroke: 'purple', fill:'transparent'}} />
    )

    const polygons = JSON.parse(localStorage.getItem(month)!)

    polygons.push(`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`)

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

  const [allowlist, setAllowlist] = useState<any>([{id: 0, name: 'morgan.moskalyk@protonmail.ch'}])
  const [newUser, setNewUser] = useState<any>(null)

  useEffect(() => {

  }, [newUser, allowlist, notes])

  //@ts-ignore
  const [hasRecvEmail, setHasRecvEmail] = useState(false)
  const [hasEmailValidated, setHasEmailValidated] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const [otpEmailSend, setOtpEmailSend] = useState(null)
  const [otpCodeSend, setOtpCodeSend] = useState(null)
  const [reminderTime, setReminderTime] = useState('2025-06-18T00:00')
  const [reminderNote, setReminderNote] = useState(null)
  //@ts-ignore
  const [socketId, setSocketId] = useState(null)

  const sendEmail = async () => {
    console.log(otpEmailSend)
    console.log(socketId)
    vfaasNet.webSocket.send('init', {id: socketId, email: otpEmailSend})

      // const res = await fetch('http://localhost:3000/run', {
      //       method: 'POST',
      //       headers: {
      //           "Content-Type": "application/json",
      //         },
      //       body: JSON.stringify({
      //           bundleID: "OTPEmail", // TODO: use unique bundle id to network
      //           functionName: 'serverless',
      //           args: [otpEmailSend],
      //       })
      //   })

      // const jsonRes = await res.json()
      //   console.log(jsonRes)
      // if(jsonRes.response == 'complete'){
      //   setHasEmailValidated(true)
      //   setHasRecvEmail(true)
      //   console.log('test')
      // }else {
      //   setHasRecvEmail(true)
      //   // setOtpEmailSend(null)
      // }
  }

  const sendValidation = async () => {
    console.log(otpEmailSend)
      const res = await fetch('http://localhost:3000/run', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                bundleID: "OTPCodeValidation", // TODO: use unique bundle id to network
                functionName: 'serverless',
                args: [otpEmailSend,otpCodeSend],
            })
        })
        const resJson = await res.json()
        console.log(resJson)
      if(!Boolean(resJson.response)){
        setValidationError(true)
      } else {
        setHasEmailValidated(true)
      }
      setOtpCodeSend(null)

  }

  const onChangeReminderTime = (evt: any) => {
    console.log((new Date(evt)).getMilliseconds())

    setReminderTime(evt)
  }

  const saveReminder = async () => {

    console.log((new Date(reminderTime)).getMilliseconds())

    const res = await fetch('http://localhost:3000/run', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
            },
          body: JSON.stringify({
              bundleID: "ReminderSet", // TODO: use unique bundle id to network
              functionName: 'serverless',
              args: [otpEmailSend, reminderTime, reminderNote],
          })
      })
      const resJson = await res.json()
      console.log(resJson)
  }


  useEffect(() => {
    vfaasNet = new VFAASNet({host: 'localhost', port: 8079})

    // const onPeerMessage = (message: any) => {
    //   // use message
    //   console.log(message)
    //   vfaasNet.webSocket.send('message', {datum: 'howdy'})
    // }

    // const ack = (ack: any) => {
    //   id = ack.datum
    //   console.log(ack)
    //   setSocketId(ack.datum)
    // }
    // const init = (message: any) => {
    //   console.log(socketId)
    //   console.log(otpEmailSend)
    //   vfaasNet.webSocket.send('init', {id: socketId, email: otpEmailSend})
    // }

    // const sharing = (data: any) => {

      // check if offline or not
      // check if initiator or not

      // console.log(data)
      // vfaasNet.webSocket.send('sharing', {isInitiator: false, email: otpEmailSend, geo: [1,2,3,4,5,6,7,8,9,10,11,12].map(el => localStorage.getItem(JSON.stringify(el)))})
    // }

    // vfaasNet.aPath(ack)
    // vfaasNet.aPath(init)
    // vfaasNet.aPath(sharing)

  }, [])

  // const share = () => {
  //   console.log('gunna send')
  //   vfaasNet.webSocket.send('sharing', {isInitiator: true, email: otpEmailSend, geo: localStorage.getItem(JSON.stringify(6))})
  // }

  useEffect(()=>{

  },[socketId, otpCodeSend,otpEmailSend, reminderTime])
  // @ts-ignore
  const [userOffline, setUserOffline] = useState(false)
  // @ts-ignore
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [hoverMenu, setHoverMenu] = useState(false)

  useEffect(() => {
    localStorage.setItem(JSON.stringify('selected color'), JSON.stringify(selectedColor))
  }, [selectedColor])
 
  return (
    <>
          <br/>
      <br/>
      {
        <div id="menu" style={{cursor: 'pointer', position: 'fixed', top: '50px', right: '100px'}}><span style={{fontSize: '25px', bottom: '-20px'}}>☻</span> <span style={{marginBottom: '20px'}} onClick={() => setMenu(3)}>profile</span></div>
      }
      <br/>
      <div style={{margin: 'auto'}}>

    {/* <input placeholder="search user"></input> */}
      </div>

      
      <div>
        {
          menu != 3 && <>
          <span id="menu" style={{padding: '20px', cursor: 'pointer', textDecoration:   menu == 0 ? 'underline': ''}} onClick={() => setMenu(0)}><span style={{textDecoration: 'line-through'}}>U</span> calenda(t)</span>
        {/* <span id="menu" style={{padding: '20px',  cursor: 'pointer', textDecoration: menu == 1 ?'underline': ''}}onClick={() => setMenu(1)}>⇆ sharing (soon)</span> */}
        <span id="menu" onMouseLeave={() => isSignedIn&&setHoverMenu(false)} onMouseEnter={() =>isSignedIn&&setHoverMenu(true)} style={{padding: '20px',  cursor: 'pointer', color: !isSignedIn ? 'lightgrey': '', textDecoration: hoverMenu || menu == 2 ? 'underline': ''}}onClick={() => isSignedIn && setMenu(2)}>⚔ allowlist</span>
          </>
        }
        
      </div>
      <br/>
      {
        menu == 3 &&<div>
          <div style={{position: `fixed`, left: '30%', cursor: 'pointer'}} onClick={() => setMenu(0)}>{`< back`}</div>
          <p>sign in &nbsp;
            {<>
          (<div className="circle">
</div> <span>offline)</span></>}
            {/* {<>
          (<div class="circle">
</div> <span>offline)</span></>} */}

</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/>
          
{false && <>
          hasRecvEmail ? <>
          {
          !hasEmailValidated && validationError ? 
            <>{hasEmailValidated.toString()}
              <p>try validation again</p>
            </>
            : 
            <>
            {
              hasEmailValidated ? <>
                </>:
              <>
              <p>?validate your otp code</p>
              {/* @ts-ignore" */}
              <input placeholder='otp code' value={otpCodeSend} onChange={(evt) => setOtpCodeSend(evt.target.value)}></input>
              <button onClick={() => sendValidation()}>validate otp</button>
            </>
            }
            </>
            
          }
          </> : <>
          {/* TODO: use secure otp password session stored in browser cookie */}
          <p>!please validate your email</p>
          {/* @ts-ignore" */}
          <input placeholder='email' style={{height: '25px'}} value={otpEmailSend} onChange={(evt: any) => setOtpEmailSend(evt.target.value)}></input>
          &nbsp;&nbsp;
          <button style={{height: '35px'}} onClick={() => sendEmail()}>send otp</button>
          </>
</>
      }
          <br/>
          <p>stats'</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/>
          {shapes.length} # of shapes
          <br/>
          <br/>
          {/* {shapes.length} # of friends */}
          {/* <br/> */}
          {/* <br/> */}
          {/* <br/> */}
          <p>calenda(t) themes</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/>
          <div style={{margin: 'auto', display: 'inline-block'}}>

          <button className="circle-button-1" style={{border: selectedColor == 0 ? '1px solid black':'', height: selectedColor == 0 ? '38px': ''}}  onClick={() => setSelectedColor(0)}></button>
          <button className="circle-button-2" style={{border: selectedColor == 1 ? '1px solid black':'', height: selectedColor == 1 ? '38px': ''}} onClick={() => setSelectedColor(1)}></button>
          <button className="circle-button-3" style={{border: selectedColor == 2 ? '1px solid black':'', height: selectedColor == 2 ? '38px': ''}} onClick={() => setSelectedColor(2)}></button>
          <button className="circle-button-4" style={{border: selectedColor == 3 ? '1px solid black':'', height: selectedColor == 3 ? '38px': ''}} onClick={() => setSelectedColor(3)}></button>
          <button className="circle-button-5" style={{border: selectedColor == 4 ? '1px solid black':'', height: selectedColor == 4 ? '38px' : ''}} onClick={() => setSelectedColor(4)}></button>
          </div>
          
          {/* <button className="circle-button-6" onClick={() => {}}></button> */}
        </div>
      }
      {
        menu == 2 && <div >
          <br/>
          <p style={{color: 'grey'}}>add a friend by identifier</p>
          <input style={{padding: '7px', width: '232px', textAlign: 'center'}} placeholder="user@domain.tld" onChange={(evt: any) => setNewUser(evt.target.value)}></input>
          &nbsp;&nbsp;
          <button onClick={() => {console.log(newUser);setAllowlist((allowlist: any) => [...allowlist, {name: newUser, id: allowlist.length}]); setNewUser(null)}}>share</button>
          <br/>
          {
            userOffline && <p style={{color: 'red'}}>user offline</p>
          }
          <ul>{allowlist.map((person: any, id: any) => {
            return <li style={{textAlign: 'center', width: '332px', padding: '5px'}}>{person.name} <span id='x-remove' style={{float: 'right', cursor: 'pointer'}} onClick={() => setAllowlist((prevItems: any) => prevItems.filter((item: any) => item.id !== id))}>❌</span></li>
          })}</ul>
        </div>
      }

      {
        menu == 1 && <div >
          <br/>
          <input style={{padding: '7px', width: '232px', textAlign: 'center'}} placeholder="enter email" onChange={(evt: any) => setNewUser(evt.target.value)}></input>
          &nbsp;&nbsp;
          <button onClick={() => {console.log(newUser);setAllowlist((allowlist: any) => [...allowlist, {name: newUser, id: allowlist.length}]); setNewUser(null)}}>enter</button>
          <br/>
          <br/>
          <p style={{color: 'lime'}}>one-time shared</p>
        </div>
      }
          <br/>
      {menu == 0 && 
      <main style={{ padding: 10 }}>
        <span><button id='controls' onClick={() => setMonth(month!-1)}>prev</button></span><span style={{display: 'inline-block'}}><p>&nbsp;&nbsp;{months[month-1]}&nbsp;&nbsp;</p></span><span><button id='controls' onClick={() => {setMonth(month!+1)}}>next</button></span>
          <br/>
          <br/>
          {
            addShapes &&
            <div>
              <CollapsibleCard
                title={'notes'}
                key={0}
                // onRecord={handleRecord}
                style={{
                  position: "relative",
                  // left: "50%",
                  // transform: "translateX(-50%)",
                }}
              >
                <div>
                  <p style={{color: 'grey'}}>add notes to the day</p>
                  <textarea value={notes} onChange={(evt) => {console.log(evt.target.value);setNotes(evt.target.value)}} style={{height: '50px', width: '250px'}}></textarea>
                  <br/>
                  <br/>

                  <button onClick={() => saveNotes()}>&nbsp;save&nbsp;</button>
                </div>
                {canDelete && <><button style={{background: 'red'}} onClick={() => {setCanDelete(false);setShapes((prevItems: any) => prevItems.filter((item: any) => {
                  if(item.key === canDelete){
                    let polygons = JSON.parse(localStorage.getItem(month)!)
                    delete polygons[item.key]
                    polygons = polygons.filter((el: any) => el == null)
                    localStorage.setItem(month, JSON.stringify(polygons))
                  }
                  return item.key !== canDelete
                }))}}>delete</button></>}
              </CollapsibleCard>
              {isSignedIn && <><br/><CollapsibleCard
                title={'reminders'}
                key={0}
                // onRecord={handleRecord}
                style={{
                  position: "relative",
                  // left: "50%",
                  // transform: "translateX(-50%)",
                }}
              >
                <div style={{margin: 'auto'}}>
                  <span id="menu" style={{cursor: 'pointer', textDecoration: ''}}onClick={() => setMenu(3)}>⏲ reminders</span>
                  <br/>
                  <br/>
                  {
                    <>
                    <input
                    type="datetime-local"
                    id="meeting-time"
                    name="meeting-time"
                    value={reminderTime}
                    onChange={(evt: any) => onChangeReminderTime(evt.target.value)}
                    />
                    <br/>
                    <br/>
                    <textarea style={{height: '60px', width: '175px'}} onChange={(evt: any) => setReminderNote(evt.target.value)}></textarea>
                    <br/>
                    <br/>

                    <button onClick={saveReminder}>set reminder</button>
                    <br/>
                    </>
                  }
                </div>
              </CollapsibleCard> </>}
              <br/>
              <CollapsibleCard
                passedInheight={'0'}
                title={'geometry'}
                key={0}
                // onRecord={handleRecord}
                style={{
                  position: "relative",
                  height: '180px',
                  margin: '20px'
                  // left: "50%",
                  // transform: "translateX(-50%)",
                }}
              >
                <button onClick={() => addEmergence()}>emergence</button>
                &nbsp;
                &nbsp;
                <button onClick={() => addWindow()}>window</button>
                &nbsp;
                &nbsp;
                <br/>
                <br/>
              </CollapsibleCard>
            </div>
          }
   
        {/* {
          <button onClick={() => share()}>share</button>
        } */}
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

      </main>}
    </>
  )
}

export default App