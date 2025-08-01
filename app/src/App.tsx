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

//@ts-ignore
let userEmail: any;

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
  title: { margin: 0, marginLeft: '20px', fontFamily: 'Courier',fontSize: "16px", fontWeight: "500" },
  content: { 
    paddingLeft: '-28px',
    overflow: "hidden", transition: "height 0.3s ease" },
  innerContent: {
    padding: "10px 15px",
    backgroundColor: "#fff",
    width: "100%",
    height: '100%',
  },
  header: {
    display: "flex",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    padding: "10px 0",
  }
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
        if(isInside({x: x, y: y}, {top: j*100, bottom: (j+1)*100, left: i*100, right: (i+1)*100})){
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
    const dateNumbers = []
    let index = 0
    let days;
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
  }, [month])

  useEffect(() => {
    setNotes(localStorage.getItem(JSON.stringify(addingXShape+":"+addingYShape)))
  }, [dates, month, shapes, addShapes])

  useEffect(() => {

  }, [notes])

  useEffect(() => {

    // TODO: change month and user / other to get polygons with selected colors data structure
    const polygons = JSON.parse(localStorage.getItem(month)!)
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

    // create a temporary variable
    const tempShapes = shapes

    // create a reactable variable
    setCounter(counter+1)

    // add shapes to temprorary structure
    tempShapes.push(
      //@ts-ignore
      <polygon id={tempShapes.length-1} points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${150+100*addingXShape+","+(150+(addingYShape)*100)} ${50+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
    )

    // get polygons from localstorage
    const polygons = JSON.parse(localStorage.getItem(month)!)
  
    // add new shape and coords
    polygons.push(`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${150+100*addingXShape+","+(150+(addingYShape)*100)} ${50+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`)
    
    // set back to local storage
    localStorage.setItem(month,JSON.stringify(polygons))

    // render
    setShapes(tempShapes)
    setAddShapes(false)
  }
  
  const addEmergence = () => {
    setCounter(counter+1)

    const tempShapes = shapes

    tempShapes.push(
      //@ts-ignore
      <polygon id={tempShapes.length-1} points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
    )

    const polygons = JSON.parse(localStorage.getItem(month)!)

    polygons.push(`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`)

    localStorage.setItem(month,JSON.stringify(polygons))

    setShapes(tempShapes)
    setAddShapes(false)
  }

    const addRebound = () => {
    setCounter(counter+1)
    const tempShapes = shapes

    tempShapes.push(
      //@ts-ignore
      // <polygon id={tempShapes.length-1} points={`${50+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*addingXShape+","+(30+(addingYShape)*100)} ${250+100*(addingXShape-1)+","+(150+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
      
      <polygon points={`${100+50*addingXShape+","+(50+(addingYShape)*100)} ${200+50*addingXShape+","+(20+(addingYShape)*100)} ${300+50*addingXShape+","+(50+(addingYShape)*100)} ${200+50*addingXShape+","+(80+(addingYShape)*100)}`} style={{stroke: 'purple', fill:'transparent'}} />
    )
    setShapes(tempShapes)
          setAddShapes(false)
           const polygons = JSON.parse(localStorage.getItem(month)!)

    polygons.push(`${100+50*addingXShape+","+(50+(addingYShape)*100)} ${200+50*addingXShape+","+(20+(addingYShape)*100)} ${300+50*addingXShape+","+(50+(addingYShape)*100)} ${200+50*addingXShape+","+(80+(addingYShape)*100)}`)

    localStorage.setItem(month,JSON.stringify(polygons))

    setShapes(tempShapes)
    setAddShapes(false)

  }

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
    localStorage.setItem(JSON.stringify(addingXShape+":"+addingYShape),notes)
    setAddShapes(null)
  }

  const [allowlist, setAllowlist] = useState<any>([{id: 0, name: 'morgan.moskalyk@protonmail.ch'}])
  const [newUser, setNewUser] = useState<any>(null)

  useEffect(() => {
  }, [newUser, allowlist, notes])

  useEffect(() => {


    // await wait(1000)
    // console.log(vfaasNet.notConnected)
  }, [])

  //@ts-ignore
  const [hasRecvEmail, setHasRecvEmail] = useState(false)
  const [hasEmailValidated, setHasEmailValidated] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const [otpEmailSend, setOtpEmailSend] = useState(null)
  const [otpCodeSend, setOtpCodeSend] = useState(null)
  // const [reminderTime, setReminderTime] = useState('2025-06-18T00:00')
  // const [reminderNote, setReminderNote] = useState(null)
  const [OTPCodePrompt,setOTPCodePrompt] =useState(null)

  //@ts-ignore
  const [socketId, setSocketId] = useState(null)
  const [emailOTPLoading, setEmailOTPLoading] = useState(false)
  // const [userEmail, setUserEmail] = useState(null)

  const sendEmail = async () => {
    setEmailOTPLoading(true)
    vfaasNet.webSocket.send('init', {id: socketId, email: otpEmailSend})
    console.log(otpEmailSend)
    // setUserEmail(otpEmailSend)
    userEmail = otpEmailSend

    // get expiry from local storage
    let otpExpiry = JSON.parse(localStorage.getItem('otp-expiry')!)

    console.log(otpExpiry)

    // see if expired
    if(otpExpiry==null||(otpExpiry && (new Date().getTime() > otpExpiry.expiry))){
      const res = await fetch('http://localhost:3000/run', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                bundleID: "OTPEmail", // TODO: use unique bundle id to network
                functionName: 'serverless',
                args: [otpEmailSend],
            })
        })

      const jsonRes = await res.json()
      console.log(jsonRes)
      setOTPCodePrompt(jsonRes.response)
      setEmailOTPLoading(false)

      if(jsonRes.response == 'complete'){
        setHasEmailValidated(true)
        setHasRecvEmail(true)
        console.log('test')
      }else {
        setHasRecvEmail(true)
        const now = new Date();

        // Add 11 minutes to the current time
        now.setMinutes(now.getMinutes() + 11);
        localStorage.setItem('otp-expiry', JSON.stringify({otp: jsonRes.response, expiry: now.getTime()}))
        // setOtpEmailSend(null)
      }
    } else {
      console.log('else')
      setEmailOTPLoading(false)
      setHasEmailValidated(true)
      setHasRecvEmail(true)
      setIsSignedIn(true)
    }
  }

  const sendValidation = async () => {
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
        setIsSignedIn(true)
      }
      setOtpCodeSend(null)

  }

  // const onChangeReminderTime = (evt: any) => {
  //   setReminderTime(evt)
  // }

  // const saveReminder = async () => {
  //   const res = await fetch('http://localhost:3000/run', {
  //         method: 'POST',
  //         headers: {
  //             "Content-Type": "application/json",
  //           },
  //         body: JSON.stringify({
  //             bundleID: "ReminderSet", // TODO: use unique bundle id to network
  //             functionName: 'serverless',
  //             args: [otpEmailSend, reminderTime, reminderNote],
  //         })
  //     })
  //     const resJson = await res.json()
  //     console.log(resJson)
  // }


  useEffect(() => {

    // if(runOnce == 0) {
      // runOnce++
      vfaasNet = new VFAASNet({host: 'localhost', port: 8079})

      // const onPeerMessage = (message: any) => {
      //   // use message
      //   console.log(message)
      //   vfaasNet.webSocket.send('message', {datum: 'howdy'})
      // }

      const ack = (ack: any) => {
        id = ack.datum
        setSocketId(ack.datum)
      }

      const init = (message: any) => {
        console.log(message)
        console.log(socketId)
        console.log(otpEmailSend)
        vfaasNet.webSocket.send('init', {id: socketId, email: otpEmailSend})
      }

      const sharing = (data: any) => {
        // check if offline or not
        // check if initiator or not

        //TODO: store in localstorage in a certain data structure
        console.log(data)
        console.log(userEmail)
        console.log('in sharing callback')

        // TODO: check if email is in allow list, if so, pass along sharing
        if(JSON.parse(data).isInitiator) vfaasNet.webSocket.send('sharing', {color: selectedColor, isInitiator: false, initiator: JSON.parse(data).initiator, email: JSON.parse(data).initiator, geometry: [1,2,3,4,5,6,7,8,9,10,11,12].map(el => localStorage.getItem(JSON.stringify(el)))})
      }

      vfaasNet.aPath(ack)
      vfaasNet.aPath(init)
      vfaasNet.aPath(sharing)

      vfaasNet.aBoot()
    // }
  }, [])

  // TODO: create a local storage listener

  // TODO: later create hex input for colors

  // TODO: show user email on shape inspection

  const share = async () => {
    console.log('gunna send')
    const polygons = [1,2,3,4,5,6,7,8,9,10,11,12].map((el: any) => JSON.parse(localStorage.getItem(el)!))
    console.log({isInitiator: true, initiator: userEmail, email: newUser, geometry: polygons})

    await vfaasNet.webSocket.send('sharing', {isInitiator: true, initiator: userEmail, email: newUser, geometry: polygons, color: selectedColor})
    setAllowlist((allowlist: any) => [...allowlist, {name: newUser, id: allowlist.length}]); 
    setNewUser(null)
  }

  useEffect(()=>{

  },[socketId, otpCodeSend,otpEmailSend])
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
      </div>
      <div>
        {
          menu != 3 && <>
            <span id="menu" style={{padding: '20px', cursor: 'pointer', textDecoration:   menu == 0 ? 'underline': ''}} onClick={() => setMenu(0)}><span style={{textDecoration: 'line-through'}}>U</span> calenda(t)</span>
            <span id="menu" onMouseLeave={() => isSignedIn&&setHoverMenu(false)} onMouseEnter={() =>isSignedIn&&setHoverMenu(true)} style={{padding: '20px',  cursor: 'pointer', color: !isSignedIn ? 'lightgrey': '', textDecoration: hoverMenu || menu == 2 ? 'underline': ''}}onClick={() => isSignedIn && setMenu(2)}>⚔ allowlist</span>
          </>
        }
      </div>
      <br/>
      {
        menu == 3 &&<div>
          <div style={{position: `fixed`, left: '30%', cursor: 'pointer'}} onClick={() => setMenu(0)}>{`< back`}</div>
          {!hasEmailValidated && <><p>sign in 
            {/* &nbsp; */}
            {/* {<>
          (<div className="circle">
</div> <span>offline)</span></>} */}
</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/></>}
          
{
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
              <p>{OTPCodePrompt}</p>
              {/* @ts-ignore" */}
              <input  style={{border: '0px', padding: '8px',borderRadius: '3px',height: '22px'}} placeholder='otp code' value={otpCodeSend} onChange={(evt) => setOtpCodeSend(evt.target.value)}></input>
              <button style={{height: '38px'}} onClick={() => sendValidation()}>validate otp</button>
            </>
            }
            </>
            
          }
          </> : <>
          {/* TODO: use secure otp password session stored in browser cookie, maybe jwt */}
          <p>validate your email</p>
          {
              emailOTPLoading 
            ? 
              <>
                <p>loading...</p>
              </> 
            : 
              <>
                {/* @ts-ignore" */}
                <input placeholder='email' style={{border: '0px', padding: '8px',borderRadius: '3px',height: '22px'}} value={otpEmailSend} onChange={(evt: any) => setOtpEmailSend(evt.target.value)}></input>
                &nbsp;&nbsp;
                <button style={{height: '38px'}} onClick={() => sendEmail()}>send otp</button>
              </>
          }
          </>
      }
          <br/>
          <br/>
          <p>stats'</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/>
          {shapes.length} # of shapes
          <br/>
          <br/>
          <p>calenda(t) themes</p>
          <hr style={{width: '50px', marginBottom: '15px'}}/>
          <div style={{margin: 'auto', display: 'inline-block'}}>

          <button className="circle-button-1" style={{border: selectedColor == 0 ? '1px solid black':'', height: selectedColor == 0 ? '38px': ''}}  onClick={() => setSelectedColor(0)}></button>
          <button className="circle-button-2" style={{border: selectedColor == 1 ? '1px solid black':'', height: selectedColor == 1 ? '38px': ''}} onClick={() => setSelectedColor(1)}></button>
          <button className="circle-button-3" style={{border: selectedColor == 2 ? '1px solid black':'', height: selectedColor == 2 ? '38px': ''}} onClick={() => setSelectedColor(2)}></button>
          <button className="circle-button-4" style={{border: selectedColor == 3 ? '1px solid black':'', height: selectedColor == 3 ? '38px': ''}} onClick={() => setSelectedColor(3)}></button>
          <button className="circle-button-5" style={{border: selectedColor == 4 ? '1px solid black':'', height: selectedColor == 4 ? '38px' : ''}} onClick={() => setSelectedColor(4)}></button>
          </div>
        </div>
      }
      {
        menu == 2 && <div >
          <br/>
          <p style={{color: 'grey'}}>add a friend by identifier</p>
          <input style={{border: '0px', padding: '8px',borderRadius: '3px',height: '22px'}} placeholder="user@domain.tld" onChange={(evt: any) => setNewUser(evt.target.value)}></input>
          &nbsp;&nbsp;
          <button onClick={async () => {
            await share()
          }
            }>share</button>
          <br/>
          {userOffline && <p style={{color: 'red'}}>user offline</p>}
          {/* TODO: delete from localstorage and in memory*/}
          <ul>{allowlist.map((person: any, id: any) => {
            return <li style={{textAlign: 'center', width: '332px', padding: '5px'}}>
              <div className="circle"></div>&nbsp;
              {person.name} <span id='x-remove' style={{float: 'right', cursor: 'pointer'}} onClick={() => setAllowlist((prevItems: any) => prevItems.filter((item: any) => item.id !== id))}>❌</span></li>
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
                style={{
                  position: "relative",
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
              <br/>
              <CollapsibleCard
                passedInheight={'0'}
                title={'geometry'}
                key={0}
                style={{
                  position: "relative",
                  height: '180px',
                  margin: '20px',
                  paddingLeft: '-70px'
                }}
              >
                <button onClick={() => addEmergence()}>emergence</button>
                &nbsp;
                <button onClick={() => addWindow()}>window</button>
                &nbsp;
                <button onClick={() => addRebound()}>rebound</button>
                <br/>
                <br/>
              </CollapsibleCard>
            </div>
          }
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