var mysql = require('mysql');
var ejs = require('ejs');
var title = 'Administrator Edit New Contact';

var path = require('path');

var poolH = mysql.createPool({
                             connectionLimit : 100, //important
                             host     : 'localhost',
                             user     : 'Xig514',
                             password : 'some_pass',
                             database : 'Hunsicker',
                             debug    :  false
                             

                             });

exports.handle_Input=function (req,res)
{
    
    if(!req.isAuthenticated()) {
        res.redirect('/login?error=Time_out');
        
    } else {
        
        var user = req.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){

    var ContactID  = req.params.id;
    var CompanyID= req.query.CompanyID;
    var CompanyName = req.query.CompanyName;
    var newValue  ={};
    newValue["CompanyID"]= req.body.CompanyID;
    var CompanyID1=req.body.CompanyID;
    newValue["FirstName"]= req.body.First;
    newValue["LastName"]= req.body.Last;
    newValue["PhoneNumber"]= req.body.PhoneNumber1+req.body.PhoneNumber2+req.body.PhoneNumber3;
    newValue["EmailAddress"]= req.body.Email;
    newValue["SiteAddress"]= req.body.Address;
    newValue["SiteCity"]= req.body.City;
    
    newValue["SiteState"]= req.body.State;
    newValue["SiteZip"]= req.body.Zip;
    if(req.body.ContactStatusID=="Yes"){
        newValue["ContactStatusID"]= 1;
    }
    else{
        newValue["ContactStatusID"]= 0;
    }
    console.log(newValue);
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                        //queryClause = "Select ContactID As Solution From user_Contact;";
                        queryClause="Update Contact set ? Where ContactID = "+connection.escape(ContactID)+";";
                        connection.query(queryClause, newValue,function(err,rows){
                                         if(!err)
                                         {
                                         query2="select CompanyName as cn from Company where CompanyID= "+connection.escape(req.body.CompanyID);
                                         connection.query(query2,function(err,rows){
                                                          connection.release();
                                                          if(!err){
                                                          if(rows[0]!=null && rows[0].cn!=undefined){
                                                          console.log(1);
                                                          
                                                          res.redirect('/editContactAdmin/'+ContactID+'?CompanyID='+ CompanyID1+'&CompanyName='+rows[0].cn+'&message=Successful');
                                                          }
                                                          else{
                                                          console.log(2);
                                                          
                                                           res.redirect('/editContactAdmin/'+ContactID+'?CompanyID='+ CompanyID1+'&CompanyName='+unknown+'&message=Successful but no Company with ID '+ req.body.CompanyID);
                                                          }
                                                          }
                                                          else
                                                          {
                                                          console.log(3);
                                                          
                                                           res.redirect('/editContactAdmin/'+ContactID+'?CompanyID='+ CompanyID1+'&CompanyName='+CompanyName+'&message=Successful but error in finding company name');
                                                          }
                                            });
                                                                               
                                         }
                                         else
                                         {
                                         console.log('error in Update Contact!');
                                         res.redirect('/editContactAdmin/'+ContactID+'?CompanyID='+CompanyID+'&CompanyName='+CompanyName+'&message=Failed');
                                         
                                         return;
                                         
                                         
                                         }
                                         
                                         
                                         });
                        connection.on('error', function(err) {res.json({"code" : 100, "status" : "Error in connection database"});return;});
                        });
            }
            else{
                res.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
            console.log("undefined user");
            //logged in but user is undefined? Will that happen?
            res.redirect('/login');
        }
        
    }

}





exports.show=function (req,res,app,dirPath)
{
    
    if(!req.isAuthenticated()) {
         app.set('views', path.join(dirPath, 'views'));
        res.redirect('/login?error=Time_out');
        
    } else {
        
        var user = req.user;
        if(user!=undefined){
            var keys = Object.keys(user);
            
            
            var val = user[keys[0]];
            var username=val.username;
            //  console.log(val.username);
            if(username=="adminBob"){
                

    var ContactID = req.params.id;
    var CompanyID= req.query.CompanyID;
    var CompanyName = req.query.CompanyName;
    var dataForShowing1=new Array(12);
    
    poolH.getConnection(function(err,connection){
                        if (err) {
                        connection.release();
                        res.json({"code" : 100, "status" : "Error in connection database"});
                        return;
                        }
                    
                        var ContactName;
                        var queryClause2 = "Select ContactID as ci, FirstName as fn, LastName as ln, PhoneNumber as pn, EmailAddress as ea, SiteAddress as sa, SiteCity as sc, SiteState as ss,SiteZip as sz, ContactStatusID as csid From Contact WHERE ContactID = "+connection.escape(ContactID);
                       //  console.log(queryClause2);
                        connection.query(queryClause2,function(err,rows,fields){
                                         
                                         connection.release();
                                         if(!err)
                                         {
                                         if(rows[0]!=null && rows[0].ci !=undefined){
                                         
                                         
                                        
                                         ContactName = "";
                                         
                                         dataForShowing1=new Array(12);
                                         ContactID=rows[0].ci;
                                         ContactName=rows[0].fn +" " + rows[0].ln;
                                         dataForShowing1[0]=rows[0].ci;
                                         
                                         dataForShowing1[1]=rows[0].fn;
                                         dataForShowing1[2]=rows[0].ln;
                                         dataForShowing1[3]=rows[0].pn;
                                         dataForShowing1[4]=rows[0].ea;
                                         dataForShowing1[5]=rows[0].sa;
                                         dataForShowing1[6]=rows[0].ss;
                                         
                                         dataForShowing1[7]=rows[0].sc;
                                         dataForShowing1[8]=rows[0].sz;
                                         dataForShowing1[9]=rows[0].csid;
                                         dataForShowing1[10] = CompanyID;
                                         
                                         dataForShowing1[11]=CompanyName;
                                         //console.log(CompanyName);
                                         if(req.query.message!=undefined){
                                         if(req.query.backURL!=undefined){
                                         backURL ='http://localhost:9000/jobConclusion?JobID='+req.query.JobID+'&ContactID='+req.params.id+'&VIN='+req.query.VIN+'&DPFID='+req.query.DPFID+'&message=1&CompanyID='+req.query.CompanyID;
                                         res.render('editContactAdmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of specific Contact you want to edit',CompanyName:CompanyName, CompanyID: CompanyID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1,errorMessage:req.query.message,backURL:backURL,backURL_mark:1});
                                          app.set('views', path.join(dirPath, 'views'));
                                         return;
                                         }
                                         else{
                                         
                                         res.render('editContactAdmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of specific Contact you want to edit',CompanyName:CompanyName, CompanyID: CompanyID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1,errorMessage:req.query.message,backURL_mark:0});
                                         app.set('views', path.join(dirPath, 'views'));
                                         return;
                                         
                                         }
                                         }
                                         else{
                                         if(req.query.backURL!=undefined){
                                          backURL ='http://localhost:9000/jobConclusion?JobID='+req.query.JobID+'&ContactID='+req.params.id+'&VIN='+req.query.VIN+'&DPFID='+req.query.DPFID+'&message=1&CompanyID='+req.query.CompanyID;
                                         res.render('editContactAdmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of specific Contact you want to edit',CompanyName:CompanyName, CompanyID: CompanyID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1,backURL:backURL, backURL_mark:1});
                                         app.set('views', path.join(dirPath, 'views'));
                                         return;
                                         }
                                         else
                                         {
                                         res.render('editContactAdmin', {h1:'Select Contact',use:{username:'Administrator'},title:'The result of specific Contact you want to edit',CompanyName:CompanyName, CompanyID: CompanyID,ContactID:ContactID,ContactName:ContactName,dataForShowingE:dataForShowing1,backURL_mark:0});
                                         app.set('views', path.join(dirPath, 'views'));
                                         return;
                                         }
                                         }
                                         }
                                         
                                         
                                         else{
                                         console.log("no contact records");
                                         //Here go direct to add new Contact for this company pape.
                                         app.set('views', path.join(dirPath, 'views'));
                                         res.render('addNewContactAdmin',{title:'Add New Contact Admin',CompanyName:CompanyName,CompanyID:CompanyID});
                                         
                                         }
                                         
                                         }
                                         
                                         else{
                                         console.log('error in Select Contact Info!');
                                          app.set('views', path.join(dirPath, 'views'));
                                         res.render('errorPage', {usernameE: 'Administrator',h1:'Error in Select Contact Infomation',title:"Error in Select ComapnyInfo",errorMessage :'Error in Select Contact Info!'});
                                         return;
                                         }
                                         
                                         
                                         
                                         
                                         
                                         
                                         });
                        });
            }
            
            else{
                 app.set('views', path.join(dirPath, 'views'));
                res.redirect('/userPage/'+username);
                
            }
        }
        
        
        
        
        else{
             app.set('views', path.join(dirPath, 'views'));
            console.log("undefined user");
            //logged in but user is undefined? Will that happen?
            res.redirect('/login');
        }
        
    }

    

}
