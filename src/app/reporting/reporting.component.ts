import { Component,OnInit,OnDestroy } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
var mainarray:any=[];
var type:any;

declare var google:any;
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})

export class ReportingComponent implements OnDestroy {
  title = 'app';
  dbdata:any;
  deviceId:any;
  currentDate=new Date();
  select:any;
  customdisabled:boolean=true;
  startDate=this.currentDate.getFullYear()+"-"+this.currentDate.getMonth()+"-"+this.currentDate.getDate();
  endDate=this.currentDate.getFullYear()+"-"+this.currentDate.getMonth()+"-"+this.currentDate.getDate();
  err:string="";
  UndefinedOptionValue:any;
  result:any=["Last 24 hours","Last 30 days","Last 1 year","Custom"];
  ngOnDestroy(){
    mainarray=[];
    console.log("OnDestroy called");
   }
  constructor(public router:Router,private route:ActivatedRoute,public http: Http){
    var data=this.route.snapshot.params.deviceId;
    console.log(data);
    type=data.split("~")[1];
    this.deviceId=data.split("~")[0];
    this.deviceId = this.deviceId.replace( /:/g, "" );
    console.log(this.deviceId);

  /*  this.http.post('http://localhost:3200/reporting',{param:this.query}).subscribe(data => {
      console.log(data);
      console.log(typeof(data));
      if(type==true){
      for(var i=0;i<data["length"];i++){
        var temparray=[new Date(data[i].log_time),Number(data[i].gas_level)*5];
        mainarray.push(temparray);
      }
    }
    else if(type==false){
      for(var i=0;i<data["length"];i++){
        var temparray=[new Date(data[i].log_time),Number(data[i].gas_detector)*6.25];
        mainarray.push(temparray);
      }
    }
      //console.log(mainarray);
      this.dbdata=mainarray;
      google.charts.load('current',{'packages':['line']});
      google.charts.setOnLoadCallback(this.drawChart);
    });
*/
    this.http.post('/reporting', {param:type,deviceId:this.deviceId})
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      console.log(typeof(data));
      if(type=="true"){
      for(var i=0;i<data["length"];i++){
        var temparray=[new Date(data[i].log_time),Number(data[i].gas_level)*5];
        mainarray.push(temparray);
      }
    }
    else if(type=="false"){
      for(var i=0;i<data["length"];i++){
        var temparray=[new Date(data[i].log_time),Number(data[i].gas_detector)*6.25];
        mainarray.push(temparray);
      }
    }
      console.log(mainarray);
      this.dbdata=mainarray;
      google.charts.load('current',{'packages':['line']});
      google.charts.setOnLoadCallback(this.drawChart);
    });


  }

drawChart(){
var data=new google.visualization.DataTable();
data.addColumn('date','Month');
if(type=="true")
data.addColumn('number','Gas Level');
else
data.addColumn('number','Gas Leak');

//data.addRows([[new Date("2017-12-04"),1],[new Date("2017-12-03"),2],[new Date("2017-12-02"),3],[new Date("2017-12-01"),4],[new Date("2017-11-30"),5],[new Date("2017-10-29"),6],[new Date("2017-10-28"),7],[new Date("2017-10-27"),8],[new Date("2017-09-26"),9]]);
console.log(mainarray);
if(mainarray.length==undefined || mainarray.length==0){
  data.addRows([[new Date(this.startDate),0]]);  
}
else
data.addRows(mainarray);

var options={
/*chart:{
  title:"Historical Data",
  subtitle:"All values are in corresponding parameter units"
},*/
width:(window.innerWidth*60)/100,
height:(window.innerHeight*70)/100,
};
var chart=new google.charts.Line(document.getElementById('donutchart'));
chart.draw(data,google.charts.Line.convertOptions(options));
}
onSelect(select){
var temp=[];
  var date:any=new Date();
  switch(Number(select)){
  case 0:for(var i=0;i<mainarray.length;i++){
      //console.log(date-mainarray[i][0]);                        
    if((date-mainarray[i][0])<=86400000){
      temp.push([mainarray[i][0],mainarray[i][1]]);
    console.log(temp);
    }  
    }
    var tempmain=mainarray;
    mainarray=temp;
    this.drawChart();
    mainarray=tempmain;
    this.customdisabled=true;
    break;
  case 1:for(var i=0;i<mainarray.length;i++){
    //console.log(date-mainarray[i][0]);                        
  if((date-mainarray[i][0])<=2592000000){
    temp.push([mainarray[i][0],mainarray[i][1]]);
  console.log(temp);
  }  
  }
  var tempmain=mainarray;
  mainarray=temp;
  this.drawChart();
  mainarray=tempmain;
  this.customdisabled=true;
  break;
  case 2:for(var i=0;i<mainarray.length;i++){
    //console.log(date-mainarray[i][0]);                        
  if((date-mainarray[i][0])<=31536000000){
    temp.push([mainarray[i][0],mainarray[i][1]]);
  }  
  }
  var tempmain=mainarray;
  mainarray=temp;
  this.drawChart();
  mainarray=tempmain;
  this.customdisabled=true;
  break;
  case 3:this.customdisabled=false;
}

}
onDateChange(id,date){
var currentDate=new Date(date);
  if(id==0){
  console.log("Startdate",date);
   this.startDate=date; 
}
  if(id==1){
  console.log("EndDate",date);
  this.endDate=date;
}
if(this.endDate<this.startDate && this.endDate!=this.startDate ){
this.err="End date selected is older than start date";
console.log("EndDate",this.endDate);
}
else{
  this.err="";
  var temp=[];
  var endDatemilli=new Date(this.startDate).getTime();
  var startDatemilli=new Date(this.endDate).getTime();
  console.log(endDatemilli+"-"+this.startDate);
  console.log(startDatemilli+"-"+this.endDate);
  for(var i=0;i<mainarray.length;i++){
    console.log(mainarray[i][0].getTime()+">"+startDatemilli+"&&"+mainarray[i][0].getTime()+"<"+endDatemilli);
    console.log("firsttime",mainarray[i][0].getTime());
    if(mainarray[i][0].getTime()<=startDatemilli ){
    console.log("first",mainarray[i][0].getTime());
    if(mainarray[i][0].getTime()>=endDatemilli)
    temp.push([mainarray[i][0],mainarray[i][1]]);
  }  
  }
  console.log(temp);
  if(temp.length==0){
    this.err="No entries found between "+this.startDate+" and "+this.endDate;
    var tempmain=mainarray;
    mainarray=[[new Date(this.startDate),0]];
    this.drawChart();
    mainarray=tempmain;
  }else{
    var tempmain=mainarray;
    mainarray=temp;
    this.drawChart();
    mainarray=tempmain;
  }
}
}
}