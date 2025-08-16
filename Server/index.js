const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const server = require('http').createServer(app);
const mysql = require('mysql');
const WebSocket = require('ws');

/** Db connection */
const db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password : '',
        database : 'test',
})
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());


const wss = new WebSocket.Server({server:server});

const clients = {};
const getUniqueID= ()=>{
        const s4 = () => Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
        return s4()+s4() +'-'+s4();
}
wss.on('connection',function connection(ws){
       
        var user = getUniqueID(); 
                 clients[user]=ws;
        
 
ws.on('message', function(message){
                console.log('Message : %s',message,'|| From:  ' ,user);    
});

});




/**Creating Names and save it to DB. */
app.post("/saving",(req,res)=>{
        const fname = req.body.fname;
        const lname = req.body.lname;

        const sqlStatement = "Insert into names (fname,lname) Values(?,?)";
        db.query(sqlStatement,[fname,lname],(err,result)=>{
            res.send('It is Inserted');
        });
})

/** Displaying Data */
app.get("/view",(req,res)=>{
        res.send('Hello World');
        // const sqlStatement = "Select * from names";
        // db.query(sqlStatement,(err,result)=>{
        //     res.send(result);
        // });
})

/** Deleting Data */
app.get("/delete/:id",(req,res)=>{
        const id = req.params.id;
        const sqlStatement = "DELETE FROM names WHERE id = ? ";
        db.query(sqlStatement,id,(err,result)=>{
       if(err) console.log(err);
        });

})

/**Updating Data */

app.post("/update",(req,res)=>{
        const fname = req.body.fname;
        const lname = req.body.lname;
        const id = req.body.id;

        const sqlStatement = "UPDATE `names` SET `fname`=?,`lname`=? WHERE id = ?";
        db.query(sqlStatement,[fname,lname,id],(err,result)=>{
            res.send('It is Inserted');
        });

})



app.get("/",(req , res)=>{
    res.send('Hello World');
       
})

server.listen(3001,()=>console.log('listening on port 3001'))
//app.listen(3001,()=>{
  
//})

