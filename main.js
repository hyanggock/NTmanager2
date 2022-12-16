
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
    if (menuloadrequest == true) {
      getmenu(snapData);
    }
  }, { onlyOnce: true });
}

function getmenu(data) {
  CleanMenu();
  notebooknames = [];
  for (var i = 0; i < menulen; i++) {
    notebooknames[i + 1] = Object.keys(data.val())[i];
    menuname[i + 1] = Object.keys(data.val())[i];
    console.log(Object.keys(data.val())[i]);
    makemenu(Object.keys(data.val())[i], i + 1);
  }
  if (document.getElementById("loadingpanel").style.display != 'none') {
    $('.loadingpanel').css('-webkit-animation-name', 'transparent');
  }
  menuloadrequest = false;
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
    
  }
  else if (scene == 100) {
    document.getElementById('cell_area').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
  }
  else {
    document.getElementById('cell_area').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    if (before_scene != scene) {
      document.getElementById('loadingpanel').classList.remove("loadingpanel");
      void document.getElementById('loadingpanel').offsetWidth;
      document.getElementById('loadingpanel').classList.add("loadingpanel");
      document.getElementById('loadingpanel').style.animationName = "";
      onValue(child(notebookdata, "/" + notebooknames[scene]), (snapData) => {
        console.debug("onValue running");

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
        before_scene = scene;
      });
    }
  }
}
window.showload = function()
{
  document.getElementById('connectingimage').style.visibility="visible";
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
    document.getElementById('connectingimage').style.visibility="hidden";
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
<div id="sidemenu_설정" class="sideTabBtns" style="position: absolute; bottom:0px">
      설정
    </div>`;
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
