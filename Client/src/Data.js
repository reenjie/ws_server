import React, { useState ,useEffect} from 'react'  
import Axios from 'axios'
import $ from 'jquery';



var received_data ;

const socket = new WebSocket('ws://localhost:3001','moneyheist');

/*   socket.addEventListener('open',function(event){
   //socket.send('hd');
  }); */

  socket.addEventListener('message',function(event){
  //received_data =JSON.parse(event.data);
    window.location.reload(false);   
  // $('#al').append('<div className="alert alert-danger">Data changed!</div>');
   });


 
const Data = (prop) => {

  const {name} = prop;

const [uid,setUid] = useState('');
  const [fname,setFname] = useState('');
  const [lname,setLname] = useState('');
  const [allnames,setAllnames] = useState([]);
  const [messages,setMessage] = useState([]);

  const [action,setAction] = useState('');

  //Make an effect . that checks if there are or changes or none!


  
 
   useEffect(()=>{
     Axios.get("http://localhost:3001/view").then((req)=>{
      setAllnames(req.data);
      });
  },[]);  





  const sendmessage = () =>{
    
    socket.send(messages); 
    setMessage('');
    $('#txtmsg').val('');

    
    //Send a request using axios to send UserID
  }


  /** Saving Data */
  const submitdata = ()=> {
    if(fname == '' || lname == ''){
      alert('Please Fill all Fields');
    }else {
   Axios.post("http://localhost:3001/saving",{
        fname:fname,
        lname:lname,
    
    }).then(()=>{

    
    
     
     $('#fn').val('');
     $('#ln').val('');
     setFname('');
     setLname('');

    /* 
      
    */
      
    Axios.get("http://localhost:3001/view").then((req)=>{
      setAllnames(req.data);
      });
    })
    }

  setAction('add');

 
    socket.send('adding');
 
  }

  /** Delete Data */
 

  const deletedata = (id) => {
  
 Axios.get(`http://localhost:3001/delete/${id}`);

 socket.send('imdeleting');
setAction('delete');
setTimeout(()=>{
Axios.get("http://localhost:3001/view").then((req)=>{
  setAllnames(req.data);
  });
},1000);

  }

    /** Update Data */

  const updatedata =(xid,xfname,xlname)=> {
    $('#fn').val(xfname);
    $('#ln').val(xlname);
    $('#savebtn').addClass('d-none');
    $('#updatebtns').removeClass('d-none');
    setUid(xid);
    setFname(xfname);
    setLname(xlname);


 
  }

  const update=()=>{

    Axios.post("http://localhost:3001/update",{
     id :uid,
     fname:fname,
     lname:lname,
    }).then(()=>{
      alert('updated successfully');
      $('#savebtn').removeClass('d-none');
      $('#updatebtns').addClass('d-none');
      $('#fn').val('');
      $('#ln').val('');
      setFname('');
      setLname('');

      Axios.get("http://localhost:3001/view").then((req)=>{
        setAllnames(req.data);
        });

    })

    setAction('edit');
    socket.send('update');
  
  }

const cancel = ()=>{
  $('#savebtn').removeClass('d-none');
  $('#updatebtns').addClass('d-none');
  $('#fn').val('');
  $('#ln').val('');
  setFname('');
  setLname('');
}


            return (
                        <>

              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                  <div className="card shadow-sm">
                    <div className="card-header">
                   
                      <h6 className='text-primary'>All names {name}</h6></div>
                    <div className="card-body">

                      <div className="card">
                        <div className="card-body">
                          <div id="messages">

                          </div>
                        </div>
                      </div>
                      <input type="text" id="txtmsg" onChange={(e)=>{
                        setMessage(e.target.value);
                      }}/>
                      <button className='btn btn-success' onClick={sendmessage}>Send</button>
                      <div id="al"></div>
                    <table class="table table-striped mt-4  table-sm">
  <thead>
    <tr>
      <th scope="col">First Name</th>
      <th scope="col">LastName</th>
      <th scope="col">Action</th>
     
    </tr>
  </thead>
  <tbody>
  
  {allnames.map((row)=>{
     return <tr key={row.id}>
          <td key={row.fname}>{row.fname}</td>
          <td key={row.lname}>{row.lname}</td>
          <td key={row.id}>
            <div className="btn-group">
            <button className='btn btn-success btn-sm'  onClick={()=>{
           
          updatedata(
            row.id,
            row.fname,
            row.lname,
            
            );
           
           }}>Edit</button>
            <button className='btn btn-danger btn-sm'  onClick={()=>{
           
              deletedata(row.id);
              
              }}>Delete</button>
            </div>
           
          </td>
        </tr>


                
     })}
  </tbody>
</table>
                    </div>
                  </div>
                  </div>
                  <div className="col-md-4">
                  <div className="card shadow">
                  <div className="card-body">
                    <div className="container" >
                <h5>Data Gathering</h5>
                <hr />

                  <div className="row mb-2">
                    FirstName
                    <div className="col-md-10">
                      <input type="text" id="fn" className='form-control' onChange={(e)=>{
                        setFname(e.target.value)
                      }}/>
                    </div>
                  </div>

                  <div className="row">
                    LastName
                    <div className="col-md-10">
                      <input type="text" id="ln" className='form-control'onChange={(e)=>{
                        setLname(e.target.value)
                      }}/>
                    </div>
                  </div>

                  <button onClick={submitdata} id="savebtn"   className='btn btn-primary mt-4 px-3'>Submit</button>

                  <div className="d-none btn-group mt-4" id="updatebtns">
                    <button className='btn btn-info btn-sm' onClick={()=>{
                      update();

                    }}>Update</button>
                    <button className='btn btn-danger btn-sm' id="cancel" onClick={cancel}>Cancel</button>
                  </div>

                  </div>
                  </div>
                </div>
                  </div>
                
                </div>
              
              </div>
           
 
          
                        </>
            )
}

export default Data;
