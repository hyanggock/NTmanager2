
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
var before_scene = 0;
var notebooknames = [];
var menuname = [];
var menulen = 0;
var menuloadrequest = true;
menuname[0] = '대시보드';
menuname[100] = '설정';
var database = getDatabase(app);
var currentMenu = 0;
const notebookdata = ref(database, "/Notebooks");
Initialize();

function Initialize() {
  onValue((notebookdata), (snapData) => {
    menulen = Object.keys(snapData.val()).length;
    console.log('menulen:' + Object.keys(snapData.val()).length);
      getmenu(snapData);
  });
}
function wait(sec) {
  let start = Date.now(), now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}
function getmenu(data) {
  CleanMenu();
  CleanDashCells();
  var totalStandby=0;
  notebooknames = [];
  for (var i = 0; i < menulen; i++) {
    var standbynum=0;
    notebooknames[i + 1] = Object.keys(data.val())[i];
    menuname[i + 1] = Object.keys(data.val())[i];
    console.log("value : "+data.child(notebooknames[i+1]).val().length);
    for(var j=1;j<data.child(notebooknames[i+1]).val().length;j++)
    {
      console.log(data.child(notebooknames[i+1]+'/'+j+'/notebookstatus').val().toString());
      if(data.child(notebooknames[i+1]+'/'+j+'/notebookstatus').val().toString()=='standby'){
        standbynum=standbynum+1;
      }
    }
    totalStandby+=standbynum;
    makemenu(Object.keys(data.val())[i], i + 1);
    makedashcell(notebooknames[i+1],i+1,standbynum,data.child(notebooknames[i+1]).val().length);
  }
  document.getElementById("total").innerHTML=totalStandby;
  if (document.getElementById("loadingpanel").style.display != 'none') {
    $('.loadingpanel').css('-webkit-animation-name', 'transparent');
    $('.openingpanel').css('-webkit-animation-name', 'translatetoupside');
    document.getElementById("loadingtext").innerHTML="&nbsp;";
  }
}
window.changeScene = function (scene) {
  currentMenu = scene;
  document.getElementById('title').innerHTML = menuname[scene];
  if (window.screen.width < 599) {
    sidemenu(false);
  }
  if (scene == 0) {
    document.getElementById('cell_area').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('settingPanel').style.display = 'none';
    document.getElementById('dashboard').classList.remove("loadingpanel");
    void document.getElementById('dashboard').offsetWidth;
    document.getElementById('dashboard').classList.add("loadingpanel");
    document.getElementById('dashboard').style.animationName = "";
    if (document.getElementById("dashboard").style.display != 'none') {
      $('.dashboard').css('-webkit-animation-name', 'transparentslide');
    }
  }
  else if (scene == 100) {
    document.getElementById('cell_area').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('settingPanel').style.display = 'flex';
  }
  else {
    document.getElementById('cell_area').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('settingPanel').style.display = 'none';
    if (before_scene != scene) {
      document.getElementById('loadingpanel').classList.remove("loadingpanel");
      void document.getElementById('loadingpanel').offsetWidth;
      document.getElementById('loadingpanel').classList.add("loadingpanel");
      document.getElementById('loadingpanel').style.animationName = "";
      onValue(child(notebookdata, "/" + notebooknames[scene]), (snapData) => {
        document.getElementById('connectingimage').style.opacity = 1;
        var len = Object.keys(snapData.val()).length;
        CleanCells();
        for (var i = 1; i <= len; i++) {
          var tempinfo = snapData.child(i + '/info').val().toString();
          var tempstatus = snapData.child(i + '/notebookstatus').val().toString();
          makecell(notebooknames[scene], i, tempstatus, tempinfo);
        }
        if (before_scene != scene) {
          document.getElementById('cell_area').classList.remove("cell_area");
          void document.getElementById('cell_area').offsetWidth;
          document.getElementById('cell_area').classList.add("cell_area");
        }
        if (document.getElementById("loadingpanel").style.display != 'none') {
          $('.loadingpanel').css('-webkit-animation-name', 'transparent');
        }
        console.debug("onValue run end");
        document.getElementById('connectingimage').style.opacity = 0.001;
        before_scene = scene;
      });
    }
  }
}
window.showload = function () {

}
window.getDatas = function (input, number, dataname) {
  var val;
  onValue(ref(database, input + '/' + number), (snapData) => {
    console.log(snapData.child(dataname).val().toString());
    val = snapData.child(dataname).val().toString();
  })
  return val;
}
window.updateNotebookData = function (input, number, vKey, value) {
  const updates = {};
  console.log("updatestart");

  updates['Notebooks/' + input + '/' + number + '/' + vKey] = value;
  update(ref(database), updates)
    .then(() => {
      console.log("data Updated");
    })
    .catch((error) => {
      console.log("update failed : " + error);
    })
}
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
function CleanCells() {
  document.getElementById('cell_area').innerHTML = '';
}
function CleanMenu() {
  document.getElementById('sidemenu').innerHTML = `<div id="closeSidemenuBtn" class="menubtn" onclick="sidemenu(false);"  style="background:linear-gradient(to left,rgba(0,0,0,0.5),rgba(0,0,0,0)); display: flex; justify-content:center; align-items:center; width:100%; height:52px;">
  <img src="https://cdn-icons-png.flaticon.com/512/8928/8928337.png" width="40px" height="40px" style="position: absolute; left: 0px;">
    <h2>노트북 재고관리</h2>
</div>
<div id="sidemenu_대시보드" class="sideTabBtns" onclick="changeScene(0);">
  대시보드
</div>
<div id="sidemenu_설정" class="sideTabBtns" style="position: absolute; bottom:0px" onclick="changeScene(100);">
      설정
    </div>`;
}
function CleanDashCells() {
  document.getElementById("dashcellarea").innerHTML = "";
}
function makemenu(type, num) {
  document.getElementById('sidemenu').innerHTML += '<div id="sidemenu_' + type +
    '"class="sideTabBtns" onclick="changeScene(' + num + ')">'
    + type +
    '</div>';
}
function makecell(type, number, status, info) {
  var statusTextarr = [];
  statusTextarr[0] = '준비'; statusTextarr[1] = '작업'; statusTextarr[2] = '대여'; statusTextarr[3] = '예약'; statusTextarr[4] = '수리';
  var dBStatusArr = [];
  dBStatusArr[0] = 'standby'; dBStatusArr[1] = 'processing'; dBStatusArr[2] = 'rentaled'; dBStatusArr[3] = 'booked'; dBStatusArr[4] = 'checking';
  var statusStyle = [];
  statusStyle[0] = 'background-color: rgb(93, 255, 179);';
  statusStyle[1] = 'background-color: rgb(255, 204, 132);';
  statusStyle[2] = 'color: white; background-color: rgb(62, 53, 65)';
  statusStyle[3] = 'background-color: rgb(174, 182, 191);';
  statusStyle[4] = 'color: white; background-color: red;';
  statusStyle[5] = 'color: white; background-color: blueviolet;';
  statusStyle[6] = 'background-color:white';
  var temptext = number;

  if (type.includes('NB')) {
    temptext = String(temptext).padStart(4, '0');
    temptext = '-' + temptext;
  }

  document.getElementById('cell_area').innerHTML += '<div class="notecell" id="cell_' + type + '_' + number + '"> ' +
    '<div class="devicenumber"' + 'id="devicenum_' + number + '">' + type + temptext + '</div>' +
    '<div class="btnsblank"></div>' +
    '<div class="btnsgroup"' + 'id="group_' + number + '">';
  for (var i = 0; i < 5; i++) {
    if (status == dBStatusArr[i]) {
      document.getElementById('group_' + number).innerHTML += '<div class="btns"; style="' + statusStyle[i] + '"' +
        'onclick="showload();updateNotebookData(`' + notebooknames[currentMenu] + '`,`' + number + '`,`notebookstatus`' + ',`' + dBStatusArr[i] + '`);"' + '>' + statusTextarr[i] + '</div>';
      document.getElementById('devicenum_' + number).style.cssText = statusStyle[i];
    } else {
      document.getElementById('group_' + number).innerHTML += '<div class="btns"; style="' + statusStyle[6] + '"' +
        'onclick="showload();updateNotebookData(`' + notebooknames[currentMenu] + '`,`' + number + '`,`notebookstatus`' + ',`' + dBStatusArr[i] + '`);"' + '>' + statusTextarr[i] + '</div>';

    }
    document.getElementById('group_' + number).innerHTML += '<div class="btnsblank"></div>';
  }
  document.getElementById('cell_area').innerHTML += '</div>';

}
function makedashcell(type, num, available, total) {
  document.getElementById("dashcellarea").innerHTML += `
  <div id="dashcell_`+ type + `" class="dashcells_notebook" onclick="changeScene(` + num + `)">
        <div style="height:5%; position: absolute; top:5px;"></div>
        <div style="font-size:larger;">`+ type + `</div>
        <div style="display: flex; align-items: center;">
          <div class="cell_available">`+ available + `</div>
          <div>/</div>
          <div class="cell_total">`+ total + `</div>
        </div>
      </div>`;
}


var lastScrollTop = 0;
$(window).scroll(function () {
  var scrollTop = $(this).scrollTop();
  if (scrollTop >= 10) {
    if ((scrollTop > lastScrollTop) && (lastScrollTop > 0)) {
      $(".header").css("top", "-100px");
    } else {
      $(".header").css("top", "0px");
    }
    lastScrollTop = scrollTop;
  }
})
$('html').click(function (e) {
  if (sidemenuAnimationStatus == 'open') {
    if (!$(e.target).hasClass('sidemenu') && !$(e.target).hasClass('menubtn') && $(e.target).parents('.sidemenu').length < 1) {
      $('.sidemenu').css('-webkit-animation-name', 'close');
      sidemenuAnimationStatus = 'close';
      console.log("animation close running");
    }
  }
})
window.sidemenu = function (input) {
  if (input == false) {
    $('.sidemenu').css('-webkit-animation-name', 'close');
    sidemenuAnimationStatus = 'close';
    console.log("animation close running");
  }
  else {
    $('.sidemenu').css('-webkit-animation-name', 'open');
    sidemenuAnimationStatus = 'open';
    console.log("animation open running");
  }
}
