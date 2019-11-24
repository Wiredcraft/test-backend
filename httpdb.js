//import modules
var http = require('http');
var httpserver = http.createServer()
var fs = require('fs')
var url = require('url')

var couchdb = require('felix-couchdb')
var dbname = 'mytestdb'
var dbclient = couchdb.createClient(5984,"127.0.0.1")
var db = dbclient.db(dbname)

//temporary user data template for creating user
var _temp_userdata = {
    "id": "123",                  	        // user ID 
    "name": "tempUser",               	    // user name
    "dob": "1900-1-1",                      // date of birth
    "address": "China",                	    // user address
    "description": "This is a temp info!",  // user description
    "createdAt": "1900-1-1"                 // user created date
};

//http server
httpserver.on('request',function(req,res){
    var curUrl = req.url
    //client page sends an adding user request
    if(curUrl=='/addUser'){
        fs.readFile('./views/addUser.html','utf8',function(err,data){
            if(err){
                console.log(err)
                res.end(JSON.stringify(err))
                return;
            }
            res.end(data)
        })
    }
    else if(curUrl.indexOf('/doadd')===0)//handle the user data
    {
        var paramObj = url.parse(req.url,true)
        var date = new Date()
        var date = date.getFullYear() + '-' + (date.getMonth()+1) +'-'+ date.getDate()
        //get user data for creating user in db
        _temp_userdata.id = paramObj.query.userid
        _temp_userdata.name = paramObj.query.name
        _temp_userdata.dob = paramObj.query.dob
        _temp_userdata.address = paramObj.query.address
        _temp_userdata.description = paramObj.query.description
        _temp_userdata.createdAt = date
        //create user data document; supposed db exists always.
        db.saveDoc(_temp_userdata.id,_temp_userdata,function(err,doc){
            if(err){
                console.log(JSON.stringify(err))
                res.end(JSON.stringify(err))
            }else{
                console.log('create user data successfully! id:'+_temp_userdata.id);
                res.end( 'create user data successfully!\r\n' + JSON.stringify(_temp_userdata) );
            }
        });
    }
    //client sends an updating user data request
    else if(curUrl=='/updateUser'){
        fs.readFile('./views/updateUser.html','utf8',function(err,data){
            if(err){
                console.log(err)
                res.end(JSON.stringify(err))
                return;
            }
            res.end(data)
        })
    }
    else if(curUrl.indexOf('/doupd')===0)
    {
        var paramObj = url.parse(req.url,true)
        //update user data in db; supposed db exists always.
        db.getDoc(paramObj.query.userid,function(err,doc){
            if(err)
            {
                console.log(err)
                res.end(JSON.stringify(err))
            }else{
                //get new user data
                doc.name = paramObj.query.name
                doc.dob = paramObj.query.dob
                doc.address = paramObj.query.address
                doc.description = paramObj.query.description
                db.saveDoc(paramObj.query.userid,doc); //update new user data
            
                //get revised data and response.
                db.getDoc(paramObj.query.userid,function(revisederr,revisedDoc){
                    if(revisederr){
                        console.log(JSON.stringify(revisederr));
                        res.end(JSON.stringify(revisederr))
                    }else{
                        console.log('update user data successfully!\r\n' + JSON.stringify(revisedDoc));
                        res.end('update user data successfully!\r\n' + JSON.stringify(revisedDoc));
                    }
                });
            }
        });
    }
    //client sends a getting user data request
    else if(curUrl=='/getUser'){
        fs.readFile('./views/getUser.html','utf8',function(err,data){
            if(err){
                console.log(err)
                res.end(JSON.stringify(err))
                return;
            }
            res.end(data)
        })
    }
    else if(curUrl.indexOf('/doget')===0)
    {
        var paramObj = url.parse(req.url,true)
        var userid = paramObj.query.userid
        //get user data in db; supposed db exists always.
        db.getDoc(userid,function(err,doc){
            if(err){
                console.log(JSON.stringify(err));
                res.end(JSON.stringify(err))
            }else{
                console.log('get user data:%s',userid);
                console.log(doc);
                res.end('get user data:\r\n' + JSON.stringify(doc));
            }
        });
    }
    //client sends a deleting user data request
    else if(curUrl=='/deleteUser'){
        fs.readFile('./views/deleteUser.html','utf8',function(err,data){
            if(err){
                console.log(err)
                res.end(JSON.stringify(err))
                return;
            }
            res.end(data)
        })
    }
    else if(curUrl.indexOf('/dodel')===0)
    {
        var paramObj = url.parse(req.url,true)
        var userid = paramObj.query.userid
        //delete user data in db; supposed db exists always.
        db.getDoc(userid,function(err,doc) {
            if(err)
            {
                console.log(err)
                res.end(JSON.stringify(err))
                return;
            }
            return db.removeDoc(doc._id,doc._rev,function(delerr,deldoc){
                if(delerr){
                    console.log(JSON.stringify(delerr));
                    res.end(JSON.stringify(delerr))
                }else{
                    console.log('delete user data successfully! id:%s', userid);
                    res.end('delete user data successfully! id:' + userid);
                }
            });
        });
    }
    else{
        res.end("404, page not found!")//default page
    }
})
httpserver.listen(5985);
console.log('httpserver is running at http://127.0.0.1:5985/');