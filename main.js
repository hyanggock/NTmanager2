
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getDatabase, ref, child, set, get, onValue, update } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOqv98aE8azlDirDTzJL1OECLHhKwXLWA",
  authDomain: "ntmanagerdb.firebaseapp.com",
  databaseURL: "https://ntmanagerdb-default-rtdb.firebaseio.com",
  projectId: "ntmanagerdb",
  storageBucket: "ntmanagerdb.appspot.com",
  messagingSenderId: "864743611198",
  appId: "1:864743611198:web:fc0191b11bf693bbce6a6f",
  measurementId: "G-0TEJYZKVQ1"
};

const app = initializeApp(firebaseConfig);

var database = getDatabase(app);
var currentMenuNumber=0;

window.getDatas = function (input, number, dataname) {
  var val;
  onValue(ref(database, input + '/' + number), (snapData) => {
    console.log(snapData.child(dataname).val().toString());
    val = snapData.child(dataname).val().toString();
  })
  return val;
}

window.updateData = function (input, number, vKey, value) {
  const updates = {};

}
onValue(ref(database,'교육재정-노-'),(snapData)=>{
  var len=Object.keys(snapData.val()).length;
  console.log(Object.keys(snapData.val()).length);
  CleanCells();
  for(var i=1;i<len+1;i++){
    var tempinfo=snapData.child(i+'/info').val().toString();
    var tempstatus=snapData.child(i+'/notebookstatus').val().toString();
    makecell('교육재정-노-',i,tempstatus,tempinfo);
  }
})

var sidemenuAnimationStatus = "close";

window.changeElementShowStatusById = function (id, value) {
  if (document.getElementById(id).style.display == "none") {
    document.getElementById(id).style.display = value;
  }
  else {
    document.getElementById(id).style.display = "none";
  }
  console.log("element edited");
}
function CleanCells(){
  document.getElementById('cell_area').innerHTML='';
}

function makecell(type,number,status,info){
  var statusTextarr = [];
  statusTextarr[0]='준비';  statusTextarr[1]='작업';  statusTextarr[2]='대여';  statusTextarr[3]='예약';  statusTextarr[4]='수리';
  var dBStatusArr=[];
  dBStatusArr[0]='standby'; dBStatusArr[1]='processing'; dBStatusArr[2]='rentaled'; dBStatusArr[3]='booked'; dBStatusArr[4]='checking';
  var statusStyle = [];
  statusStyle[0]='background-color: rgb(93, 255, 179);';
  statusStyle[1]='background-color: rgb(255, 204, 132);';
  statusStyle[2]='color: white; background-color: rgb(62, 53, 65)';
  statusStyle[3]='background-color: rgb(174, 182, 191);';
  statusStyle[4]='color: white; background-color: red;';
  statusStyle[5]='color: white; background-color: blueviolet;';
  statusStyle[6]='background-color:white';

  document.getElementById('cell_area').innerHTML+='<div class="notecell" id="cell_'+ type + '_'+number+'"> ' +
  '<div class="devicenumber"'+'id="devicenum_'+number+'">'+ type+number +'</div>'+
  '<div class="btnsblank"></div>'+
  '<div class="btnsgroup"'+'id="group_'+number+'">';
  for(var i=0;i<5;i++)
  { 
    if(status==dBStatusArr[i]){
    document.getElementById('group_'+number).innerHTML+='<div class="btns"; style="'+statusStyle[i]+'">'+statusTextarr[i]+'</div>';
    document.getElementById('devicenum_'+number).style.cssText=statusStyle[i];
    }else{
      document.getElementById('group_'+number).innerHTML+='<div class="btns";>'+statusTextarr[i]+'</div>';
      
    }
    document.getElementById('group_'+number).innerHTML+='<div class="btnsblank"></div>';
  }
  document.getElementById('cell_area').innerHTML+='</div>'; 
  
}

var lastScrollTop=0;
$(window).scroll(function(){
  var scrollTop = $(this).scrollTop();
  if(scrollTop>=200){
    if((scrollTop>lastScrollTop) && (lastScrollTop>0)){
      $(".header").css("top","-100px");
    } else {
      $(".header").css("top","0px");
    }
    lastScrollTop=scrollTop;
  }
})
$(function () {
  $('.menubtn').click(function () {
    if (sidemenuAnimationStatus == 'open') {
      $('.sidemenu').css('-webkit-animation-name', 'close');
      sidemenuAnimationStatus = 'close';
      console.log("animation close running");
    }
    else {
      $('.sidemenu').css('-webkit-animation-name', 'open');
      sidemenuAnimationStatus = 'open';
      console.log("animation open running");
    }
  })
})
$('html').click(function (e) {
  if (sidemenuAnimationStatus == 'open') {
    if (!$(e.target).hasClass('sidemenu')&&!$(e.target).hasClass('menubtn')&&$(e.target).parents('.sidemenu').length<1) {
      $('.sidemenu').css('-webkit-animation-name', 'close');
      sidemenuAnimationStatus = 'close';
      console.log("animation close running");
    }
  }
})
