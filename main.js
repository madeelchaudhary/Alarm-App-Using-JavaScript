const alarmInput = document.getElementById("alarm");
const alarmBtn = document.getElementById("alarmBtn");
const alarmType = document.getElementById("alarmType");

// Function to Set Alarms
alarmBtn.addEventListener("click", setAlarm);

function setAlarm(e) {
  e.preventDefault();

  let alarms = localStorage.getItem("alarms");
  if (alarms == null) {
    alarmsArray = [];
  } else {
    alarmsArray = JSON.parse(alarms);
  }

  // Number:1 Verifying that the user can only save 5 maximum alarms
  if (alarmsArray.length < 5) {
    //Number:2 Verifying that the user Input all the Fields Correctly
    if (alarmType.value != "" && alarmInput.value != "") {
      let date = new Date(alarmInput.value);
      let nowDate = new Date();
      let expiry = date.getTime() - nowDate.getTime();

      //Number:3   Verifying that the alarm date is new  If the user input an old date or date greater than 2 days this will show an error
      if (expiry < 0 || expiry > 172800000) {
        //   It will show an error if the user try to set an alarm of greater than 2 days
        if (expiry > 172800000) {
          let message = document.getElementById("message");
          message.classList.add("messageError");
          message.textContent = "You can't set an Alarm of Greater than 2 Days";
          message.style.display = "block";
          setTimeout(() => {
            message.style.display = "none";
          }, 1000);
          //   It will show an error if the user try to set an alarm of old date
        } else {
          let message = document.getElementById("message");
          message.classList.add("messageError");
          message.textContent = "You can't set an Alarm of Past Time";
          message.style.display = "block";
          setTimeout(() => {
            message.style.display = "none";
          }, 1000);
        }
      }
      //Number:3   If the user input date is new it will create an alarm
      else {
        let newAlarm = { time: alarmInput.value, type: alarmType.value };
        alarmsArray.push(newAlarm);
        localStorage.setItem("alarms", JSON.stringify(alarmsArray));
        document.querySelector("form").reset();
        showAlarms();
      }
    }
    //Number:2  If the user did not input any field correctly this will show an error
    else {
      let message = document.getElementById("message");
      message.classList.add("messageError");
      message.textContent = "Error! Please all the Fields Correctly";
      message.style.display = "block";
      setTimeout(() => {
        message.style.display = "none";
      }, 1000);
    }
  }
  // Number:1 If the user has already set 5 maximum alarms this will show an error
  else {
    let message = document.getElementById("message");
    message.classList.add("messageError");
    message.textContent = "You are allowed to set 5 alarms maximum";
    message.style.display = "block";
    setTimeout(() => {
      message.style.display = "none";
    }, 1000);
  }
}

// To Delete Old Alarms from Dom and from Array
function deleteOld() {
  let alarms = localStorage.getItem("alarms");
  if (alarms == null) {
    alarmsArray = [];
  } else {
    alarmsArray = JSON.parse(alarms);
  }

  function dateCheck(value) {
    let date = new Date(value);
    let nowDate = new Date();
    let expiry = date.getTime() - nowDate.getTime();
    if (expiry < 0) {
      return true;
    } else {
      return false;
    }
  }
  alarmsArray.forEach((element, index) => {
    if (dateCheck(element.time)) {
      alarmsArray.splice(index, 1);
      localStorage.setItem("alarms", JSON.stringify(alarmsArray));
      showAlarms();
    }
  });
}

// Function to Show Alarms on Webpage
function showAlarms() {
  let alarms = localStorage.getItem("alarms");
  if (alarms == null) {
    alarmsArray = [];
  } else {
    alarmsArray = JSON.parse(alarms);
  }

  function dateBeauty(value) {
    let date = new Date(value);
    let beautyDate = date.toLocaleString();
    let nowDate = new Date();

    if (date.getDate() - nowDate.getDate() == 0) {
      return " Today " + beautyDate;
    } else if (date.getDate() - nowDate.getDate() === 1) {
      return " Tomorrow " + beautyDate;
    } else {
      return beautyDate;
    }
  }
  let html = "";
  alarmsArray.forEach(function (element, index) {
    html += `
    <li>
    <div class="alarmTime">Time: ${dateBeauty(
      element.time
    )}</div><span class="alarmType" id="alarmStatus${index}">${
      element.type
    }</span>
</li> `;
  });
  let alarmsList = document.querySelector("#alarmsList");
  if (alarmsArray != "") {
    alarmsList.innerHTML = html;
    ringAlarm();
  } else {
    alarmsList.innerHTML = "<h2>Nothing to Show!<h2>";
  }
}

function ringAlarm() {
  let alarms = localStorage.getItem("alarms");
  if (alarms == null) {
    alarmsArray = [];
  } else {
    alarmsArray = JSON.parse(alarms);
  }
  if (alarmsArray != null || []) {
    alarmsArray.forEach((element, index) => {
      let date = new Date(element.time);
      let nowDate = new Date();
      let alarmTime = date.getTime() - nowDate.getTime();
      let id = `alarmStatus${index}`;
      let type = element.type;

      setTimeout(() => {
        playAlarm(type, id);
      }, alarmTime);
    });
  }
}

function stopAlarm(audio) {
  audio.pause();
  audio.currentTime = 0;
  deleteOld();
  showAlarms();
}

function playAlarm(type, id) {
  if (type.toLowerCase() === "all") {
    let audio = new Audio("all.mp3");
    audio.play();
    setTimeout(() => {
      stopAlarm(audio);
    }, 60000);
  } else if (type.toLowerCase() === "sleep") {
    let audioSleep = new Audio("sleep.mp3");
    audioSleep.play();
    setTimeout(() => {
      stopAlarm(audioSleep);
    }, 60000);
  } else {
    let audioWork = new Audio("work.mp3");
    audioWork.play();
    setTimeout(() => {
      stopAlarm(audioWork);
    }, 60000);
  }
  let status = document.getElementById(id);
  status.textContent = "Running";
  status.classList.add("currentPlaying");
}

window.onload = showAlarms();
window.onload = deleteOld();
window.onload = ringAlarm();
