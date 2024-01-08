/*...........................apiService to get data................... */

/* The function fetchData return a promise either success or error */
function fetchData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://dokaudi.com/search_calender_database",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ ticker: "ixigo IN", user_id: "2" }),
      success: function (apiResponse) {
        resolve(apiResponse);
      },
      error: function (apiResponse) {
        reject(apiResponse);
      },
    });
  });
}

/* Process the API response and extract the required data to display */
function processTaskData(data) {
  return data.result.map((item) => {
    let assignedList = [];
    if (item.assigned_to_list_of_dict)
      assignedList = item.assigned_to_list_of_dict.map((person) => {
        const {
          client_id,
          first_name,
          middle_name,
          last_name,
          role,
          email,
          phone,
        } = person;

        /* Storing the full Name as a string seperated by space */

        const fullName = [first_name, middle_name, last_name]
          .filter(Boolean)
          .join(" ");

        return {
          id: client_id,
          fullName: fullName,
          role: role,
          maidId: email[0]?.email_address ?? null,
          phoneNo: phone[0]?.phone_number ?? null,
        };
      });

    return {
      id: item?.task_id ?? 1,
      assignedTo: assignedList,
      name: item?.title ?? "",
      startDate: item?.start ?? "2024-01-01",
      description: item?.description ?? "",
      nextUpdate: item.next_update,
      endDate: item?.end ?? "2024-12-31",
      rating: item?.rating ?? 1,
      status: item?.status ?? "close",
      progress: item?.progress ?? 0,
      weeklyUpdates: item?.updates ?? [],
      calender_id: item.id,
    };
  });
}

/* Exporting  the functions to make them accessible  */
window.apiService = {
  fetchData,
  processTaskData,
};

/* The Global variable named currentIndex that is used to keep track the current object in the array from the api*/
let currentIndex = 0;

/* getting the element with id assign from the dom */
const assignedTo = document.getElementById("assign");

/*
 Function that handles the pastUpdates along with the showMore and showLess Buttons
 dynamically 
*/
function pastUpdatesFunctionality() {
  /*getting all the required elements from the dom that are responsible for past updates*/
  let pastUpdates = document.getElementById("updateslist");

  /* getting all the list items in the as a node list */
  let allItems = pastUpdates.getElementsByTagName("li");

  /* targeting showMore Button */
  let showLessBtn = document.getElementById("show-less-button");

  /* targetting showLess Button */
  let showMoreBtn = document.getElementById("show-more-button");

  /* Targetting the header element of the past updates */
  let pastUpdatesHeader = document.getElementById("pastUpdatesHeader");

  /* hiding the showLessButton */
  showLessBtn.style.display = "none";

  /* Handling if there are no updates initially,
   conditionally rendering the header either to show or not to show */

  if (allItems.length === 0) {
    pastUpdatesHeader.style.display = "none";
  } else {
    pastUpdatesHeader.style.display = "block";
  }

  /*
   Function that is responsible to show only first two updates 
   and hide the rest and display show more Btn 
  */
  function showHideUpdates() {
    for (let i = 0; i < allItems.length; i++) {
      if (i > 1) {
        allItems[i].style.display = "none";
      } else {
        if (allItems[i].style.display === "none")
          allItems[i].style.display = "list-item";
      }
    }

    if (allItems.length > 2) {
      showMoreBtn.style.display = "block";
    } else {
      showMoreBtn.style.display = "none";
    }
  }

  /* 
  Call back Function that activates when showMore Button is clicked 
  and shows the rest of the updates along with the first two, hides
  the show more button and displays show less button
  */
  function showMore() {
    for (let i = 2; i < allItems.length; i++) {
      allItems[i].style.display = "list-item";
    }
    showMoreBtn.style.display = "none";
    showLessBtn.style.display = "block";
  }

  /*
  call back function that activates when show less button is clicked,
  shows only first 2 updates , hides the rest of the updates , displays
  show more button  , hides itself
  */
  function showLess() {
    for (let i = 2; i < allItems.length; i++) {
      allItems[i].style.display = "none";
    }
    showMoreBtn.style.display = "block";
    showLessBtn.style.display = "none";
  }

  /*
     Calling the showHidesFunction initially
     as this is default feature in our web page
  */
  showHideUpdates();

  /* 
  attaching the click event listeners to both Buttons along with call back functions seperately
  */
  showMoreBtn.addEventListener("click", showMore);
  showLessBtn.addEventListener("click", showLess);
}

/*  
 Function that gets the current date in year-month-day format
 which is to set default date as today
*/
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/* 
When add update Button is clicked The model shows the todays date as the default date
*/
$("#addUpdateBtn").on("click", function () {
  $("#updateDate").val(getCurrentDate());
});

/* Intergrating  Summer Note for description with models  */
$(document).ready(function () {
  $("#updateDescription").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough"]],
      ["para", ["ul", "ol"]],
      ["insert", ["link"]],
    ],
    callbacks: {},
  });
  $("#updateDate").attr("value", getCurrentDate());
  $("#updateDescription").summernote("code", "");

  $("#updateDescription1").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough"]],
      ["para", ["ul", "ol"]],
      ["insert", ["link"]],
    ],
    callbacks: {},
  });

  $("#descriptionInput").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough"]],
      ["para", ["ul", "ol"]],
      ["insert", ["link"]],
    ],
    callbacks: {},
  });

  $("#taskIDInput").summernote({
    height: 200,
    placeholder: "Type your description here...",
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough"]],
      ["para", ["ul", "ol"]],
      ["insert", ["link"]],
    ],
    callbacks: {},
  });
});

/* Function that is responsible to add the update */
function AddUpdate(Task) {
  $("#updateModal")
    .off("click", "#saveUpdateBtn")
    .on("click", "#saveUpdateBtn", function () {
      /* getting the date entered from the model */
      let date = $("#updateDate").val();

      /* getting the description from the model */
      let desc = $("#updateDescription").summernote("code");

      /* if the date is invalid shows alert message */
      if (date == "") {
        alert("Date is invalid please select Date");
      } else if (desc == "") {
        /* if there is no description */
        alert("please enter Description");
      }

      //  both are entered
      else {
        /*formatting the date to display*/

        date = formatDate(date);

        /* creating a div */
        let tempElement = document.createElement("div");

        /* updating the innerhtml */
        tempElement.innerHTML = desc.trim();

        /*geting the description entered from the model */
        let descText = tempElement.textContent || tempElement.innerText || "";

        /* removing the unnecessary white spaces at the beginning of the string */
        descText = descText.trim();

        /* adding the listItem at the beginning of the list*/
        Task.weeklyUpdates.unshift({ date: date, desc: descText });

        /* Updating the changes in the data base*/
        UpdateTaskInDatabase(Task);

        /* Updating in the dom */
        let listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${date}:</strong> ${descText.trim()} <i id="icon" class="fa fa-trash" aria-hidden="true"
        style='color: red'></i>`;

        /* adding in the front of updates List */
        $("#updateslist").prepend(listItem);

        /* after updating calling the function that handles pastUpdates*/
        pastUpdatesFunctionality();

        /* Clear Summernote content */
        $("#updateDescription").summernote("code", "");

        /* hiding the Mode */
        $("#updateModal").modal("hide");
      }
    });
}

/* function that is responsibe to show the details of the Task in the wep page dynamically */

function updateTaskDetails(Task) {
  /* getting the status from the JSon  */
  const initialStatus = Task.status;

  /* getting taskId element */
  const taskid = document.getElementById("taskid");

  /* getting description element from the dom */
  const desc = document.getElementById("desc");

  /* getting assignedTo element from the dom */
  const assignedto = document.getElementById("assign");

  /* getting rating element from the dom  */
  const rating = document.getElementById("rating");

  /* getting all the radio buttons from the dom */
  let openStatus = document.getElementById("open");
  let closeStatus = document.getElementById("close");
  let passiveStatus = document.getElementById("passive");

  /* mark the status based on the initialStatus value */
  if (initialStatus === "open") {
    openStatus.checked = true;
  } else if (initialStatus === "close") {
    closeStatus.checked = true;
  } else if (initialStatus === "passive") {
    passiveStatus.checked = true;
  }

  /* updating taskId  */
  taskid.innerHTML = `<strong>Task ID:</strong> ${Task.name}`;

  /* updating description */
  desc.innerHTML = `<strong>Description:</strong> ${Task.description}`;

  /* getting assignedones array */
  const AssignedCandidates = Task.assignedTo;

  /* clearing previous content */
  assignedTo.innerHTML = "";

  /* creating a div element */
  const Div = document.createElement("div");

  /* creating an ol element */
  const candidatesList = document.createElement("ol");

  /* attaching id */
  candidatesList.id = "candidatesList";

  /* for each person in the assigned candidates creating a list Item */
  AssignedCandidates.forEach(function (person) {
    console.log(person);
    // +", " + person.role;
    const candidate = person.fullName;
    const listItem = document.createElement("li");

    listItem.innerHTML = `<a href="https://dokaudi.com/profile?client_id=${person.id}" target="_blank" style="text-decoration: none;color: black;"> ${candidate}</a> `;

    /* If the person has a phoneNO then display phone , whatsapp icon
       along with their functionalities */
    if (person.phoneNo) {
      listItem.innerHTML += `<a href="tel:+91${person.phoneNo}"><i class="fa fa-phone" aria-hidden="true"></i></a> `;
      listItem.innerHTML += `<a href="https://api.whatsapp.com/send?phone=91${person.phoneNo}&amp;text=Hi%20${candidate}" target="_blank" class="text-success"><i class="fab fa-whatsapp mr-2" aria-hidden="true"></i></a>`;
    }

    /* If the person has the mailId then display the mail icon along with mailto functionality*/

    if (person.maidId) {
      listItem.innerHTML += `<a href="mailto:${person.maidId}?subject=Hello&body=Hi%20${candidate}!">
      <i class="fas fa-envelope action-icon" style="cursor: pointer; color: black; min-width: 5px;" aria-hidden="true"></i></a> `;
    }

    /* Attaching the delete icon */
    listItem.innerHTML += `<i class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;

    candidatesList.appendChild(listItem);
  });

  /* appending the list to the div */
  Div.appendChild(candidatesList);

  /* updating assignedto */
  assignedto.innerHTML = `<strong>Assigned to:</strong><i id="editIcon" class="fa fa-plus" aria-hidden="true"> </i>`;
  assignedTo.appendChild(candidatesList);

  /* updating rating */
  rating.innerHTML = `<strong>Rating:</strong> <span class="star-rating"><a href="#">${generateStarRating(
    Task.rating
  )}</a></span>`;

  /* function that gets the stars with colour based on the rating number */
  function getStars(color) {
    const fullStars = document.querySelectorAll(".full-star");
    fullStars.forEach((star) => {
      star.style.color = color;
    });
  }
  switch (Task.rating) {
    case 1:
      getStars("#44ce1b");
      break;
    case 2:
      getStars("#bbdb44");
      break;
    case 3:
      getStars("#f7e379");
      break;
    case 4:
      getStars("#f2a134");
      break;
    case 5:
      getStars("#e51f1f");
      break;
  }

  /* getting the nextUpdateElement from the dom */

  const nextUpdateInput = document.getElementById("nextUpdateDate");

  /* function that sets the start date of the each Task dynamically from the JSON*/

  setStartDate(Task);

  /* function that sets the end date of the each Task dynamically from the JSON */
  setEnddate(Task);

  /* getting the nextUpdate from the Json  */
  const defaultDate = Task.nextUpdate;

  /* updating in the UI */
  nextUpdateInput.value = defaultDate;

  /* getting the updatesList element from the dom */
  const updates = document.getElementById("updateslist");

  updates.innerHTML = "";

  /* getting the updates from the JSON if exists*/
  if (Task.weeklyUpdates) {
    const addUpdates = Task.weeklyUpdates;

    addUpdates.forEach(function (update) {
      let listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${update.date}:</strong> ${update.desc} <i id="icon" update_id=${update.update_id} class="fa fa-trash " aria-hidden="true"
      style='color: red'></i>`;
      updates.appendChild(listItem);
    });
  }

  /* calling  pastUpdates function */
  pastUpdatesFunctionality();

  /* calling editName function */
  handleDeleteAssigne(Task.assignedTo, Task);

  /* calling Function that handles TaskId (single click to edit) */
  handleTaskId(Task);

  /* calling Function that handles Descripton (single click to edit ) */
  handleDescription(Task);

  /* calling Function that is responsible to add update */
  AddUpdate(Task);

  /*calling  function that is responsible to edit the past updates on single click */
  handleDoubleClick(Task);

  /*calling the addAssignee function */
  addAssignee(Task);

  /* function that is responsible to delete the updates when clicked on the delete icon dynamically */
  handleDelete(Task);

  /* Function that is responsible to delete the entire task */
  DeleteTask(Task);
}

document.addEventListener("DOMContentLoaded", function () {
  /* targetting the loading element */
  const loadingOverlay = document.getElementById("loading-overlay");

  /* targetting the Task Container */
  const Container = document.getElementById("TaskContainer");

  /* initially hiding the container until the data is fetched from the api */
  Container.style.display = "none";

  /* Show the loading overlay initially until the data is feteched from the api */
  loadingOverlay.style.display = "block";

  /* getting the data from the api */
  window.apiService
    .fetchData()
    .then((apiResponse) => {
      /* Task details */
      const taskDetails = window.apiService.processTaskData(apiResponse);

      /* getting the id from the local Storage */
      const getId = localStorage.getItem("taskId");

      /* getting the index from the taskDetails */
      const getInd = taskDetails.findIndex(function (item) {
        return item.id == getId;
      });

      /* if it exists the updating the current index */
      if (getInd !== -1) {
        currentIndex = getInd;
      }

      /* getting the Current Task object from the Json */
      const Task = taskDetails[currentIndex];

      /* updating in the UI */
      updateTaskDetails(Task);

      /* handling date event listeners */
      handleDates(taskDetails);

      /* targetting the previous element from the html Dom */
      const prev = document.getElementById("prev");

      /* adding click event listener to the previous Button */
      prev.addEventListener("click", function () {
        currentIndex =
          (currentIndex - 1 + taskDetails.length) % taskDetails.length;
        updateTaskDetails(taskDetails[currentIndex]);
      });

      /* targetting the next Button */
      const next = document.getElementById("next");

      /* adding click event listener to the previous button */
      next.addEventListener("click", function () {
        currentIndex++;
        if (currentIndex > taskDetails.length - 1) {
          currentIndex = 0;
        }
        updateTaskDetails(taskDetails[currentIndex]);
      });

      /*Targetting the navbars for smaller screen as well as large one */
      const navBarDropDown = document.getElementById("navBarDropDown");
      const navBarDropDown1 = document.getElementById("navBarDropDown1");
      if (navBarDropDown && navBarDropDown1) {
        taskDetails.forEach((task) => {
          const idparts = task.id.split(".");
          const indentation = idparts.length * 10;
          navBarDropDown.innerHTML += `<a style='padding-left:${indentation}px' href="#" class="dropdown-item"  data-task-id= ${task.id} > ${task.name} </a>`;
          navBarDropDown1.innerHTML += `<a style='padding-left:${indentation}px' href="#" class="dropdown-item"  data-task-id= ${task.id} > ${task.name} </a>`;
        });
      }
      dropdownItems = document.querySelectorAll(
        "#navBarDropDown .dropdown-item"
      );
      dropdownItems1 = document.querySelectorAll(
        "#navBarDropDown1 .dropdown-item"
      );

      function handleClick(e) {
        e.preventDefault();
        const taskId = this.getAttribute("data-task-id");
        if (taskId) {
          localStorage.setItem("taskId", taskId);
          window.location = "TaskParticulars.html";
        }
      }

      /* adding click events the dropdown items in both navs */
      dropdownItems.forEach((item) => {
        item.addEventListener("click", handleClick);
      });

      dropdownItems1.forEach((item) => {
        item.addEventListener("click", handleClick);
      });

      /* function that gets today */
      function getToday() {
        let date = new Date();
        let year = date.getFullYear();

        let month = (date.getMonth() + 1).toString();
        month = month.padStart(2, "0");

        let day = date.getDay().toString();
        day = day.padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      /*.................Delete Task Functionality from nav....... */

      const deleteTaskFrominNav = document.getElementById("deleteTaskitem");

      deleteTaskFrominNav.addEventListener("click", function (e) {
        deleteTaskFrominNav.classList.toggle("active");
      });

      const deleteTaskModelClsBtnTop = document.getElementById(
        "deleteFromClsBtnTop"
      );

      deleteTaskModelClsBtnTop.addEventListener("click", function (e) {
        deleteTaskFrominNav.classList.toggle("active");
      });

      const deleteForm = document.getElementById("deleteForm");

      const deleteFormSubmitter = document.querySelector(
        "button[value=deleteFormSubmit]"
      );

      deleteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        $("#deleteConfirmationModal").modal("show");

        const formData1 = new FormData(deleteForm, deleteFormSubmitter);
        $("#deleteConfirmationModal")
          .off("click", "#yes")
          .on("click", "#yes", function (e) {
            const deleteformDataJSON = {};
            for (const [name, value] of formData1.entries()) {
              deleteformDataJSON[name] = value;
            }

            $.ajax({
              url: "https://dokaudi.com/delete_calender_database",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(deleteformDataJSON),
              success: function (apiResponse) {
                console.log(apiResponse["message"]);
                location.reload();
                // processData(ticker);
              },
              error: function (apiResponse) {
                console.error(
                  "Error fetching director details from the database: ",
                  apiResponse
                );
              },
            });
            $("#deleteConfirmationModal").modal("hide");
          });

        deleteTaskFrominNav.classList.toggle("active");
        $("#deleteTaskModel").modal("hide");
      });

      /*..................... Add New Task........................*/

      /* targetting the add task tab */
      const TaskForminNav = document.getElementById("addTaskitem");

      /* targetting the actual form in the task form model */
      const form = document.getElementById("taskForm");

      /* targetting the submitter */
      const submitter = document.querySelector("button[value=Formsubmit]");

      /* targetting the check box in the form */
      const checkedBox = document.getElementById("enableSubTask");

      /* targetting the subTaskDropDown */
      const subTaskDropDown = document.getElementById("subtaskof");

      /* attaching event listner to the check box */
      checkedBox.addEventListener("change", function (e) {
        if (this.checked) {
          subTaskDropDown.disabled = false;
        } else {
          subTaskDropDown.disabled = true;
        }
      });

      /* updating the nextupdate value to the today's date */
      document.getElementById("nextUpdatedatepicker").value = getToday();

      /* updating the startdate to the today's date as default one */
      document.getElementById("formStartDatePicker").value = getToday();

      /* updating the enddate to the today's date as default one */
      document.getElementById("formEndDatePicker").value = getToday();

      /* attaching submit event to the form */
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form, submitter);

        const formDataJSON = {};
        for (const [name, value] of formData.entries()) {
          formDataJSON[name] = value;
        }
        formDataJSON["className"] = "ixigo IN";

        localStorage.setItem("newObject", JSON.stringify(formDataJSON));

        /*.............................Sending JSON to insert_calender_database..... */
        $.ajax({
          url: "https://dokaudi.com/insert_calender_database",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(formDataJSON),
          success: function (apiResponse) {
            console.log(apiResponse["result"]);
            ticker = apiResponse.result;
            location.reload();
            processData(ticker);
          },
          error: function (apiResponse) {
            console.error(
              "Error fetching director details from the database: ",
              apiResponse
            );
          },
        });

        /* clearing all the form fields except the date fields after submission */
        this.reset();

        /* updating the nextupdate value to the today's date */
        document.getElementById("nextUpdatedatepicker").value = getToday();

        /* updating the startdate to the today's date as default one */
        document.getElementById("formStartDatePicker").value = getToday();

        /* updating the enddate to the today's date as default one */
        document.getElementById("formEndDatePicker").value = getToday();

        $("#taskModal").modal("hide");

        /* toggleing the active class */
        TaskForminNav.classList.toggle("active");
      });

      TaskForminNav.addEventListener("click", function (e) {
        e.preventDefault();
        TaskForminNav.classList.toggle("active");
      });

      /* toggling the active class when the close button is clicked */
      const TaskFormCloseBtn = document.getElementById("TaskFormCloseButton");
      TaskFormCloseBtn.addEventListener("click", function () {
        TaskForminNav.classList.toggle("active");
      });

      /* function that populates the subtasks dynamically */
      function populateSubtaskOptions() {
        const subtaskSelect = document.getElementById("subtaskof");

        /* Clear existing options */
        subtaskSelect.innerHTML = "";

        /* Add a default option */
        const defaultOption = document.createElement("option");
        defaultOption.text = "Select a subtask";
        defaultOption.value = "";
        subtaskSelect.add(defaultOption);
        /* Adding each task  */
        taskDetails.forEach((task) => {
          const option = document.createElement("option");
          option.text = task.name;
          option.value = task.id;
          subtaskSelect.add(option);
        });
      }

      populateSubtaskOptions();
      /* Once we got the data from the api hiding the loader 
      and showing the container
       */
      loadingOverlay.style.display = "none";
      Container.style.display = "block";
    })
    .catch((error) => {
      alert(error);
      console.error("Error fetching data from the API:", error);
    });
});

/* generating the stars dynamically */
function generateStarRating(rating) {
  /* Number of full stars */
  const fullStarsCount = Math.floor(rating);

  /* Number of empty stars */
  const emptyStarsCount = 5 - fullStarsCount;

  let starsHTML = "";

  /*adding fullstars  */
  for (let i = 0; i < fullStarsCount; i++) {
    starsHTML += '<span class="full-star"  data-value="full">★</span>';
  }

  /* adding emptystars */
  for (let i = 0; i < emptyStarsCount; i++) {
    starsHTML += '<span class="empty-star" data-value="empty">☆</span>';
  }

  return `<div class="star-rating" >${starsHTML}</div>`;
}

/* function that formatsDate */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/* function that handles delete of an past update */
function handleDelete(Task) {
  function handle(event) {
    const listItem = event.target.parentNode;
    const get = listItem.textContent.split(":");

    if (event.target.classList.contains("fa-trash")) {
      if (listItem && listItem.parentNode) {
        $("#deleteModal").modal("show");
      }
    }
    $("#deleteModal")
      .off("click", "#deleteUpdateButton")
      .on("click", "#deleteUpdateButton", function () {
        Task.weeklyUpdates = Task.weeklyUpdates.filter((item) => {
          return item.update_id != event.target.getAttribute("update_id");
        });
        // console.log(Task);
        UpdateTaskInDatabase(Task);
        listItem.parentNode.removeChild(listItem);
        pastUpdatesFunctionality();
        $("#deleteModal").modal("hide");
      });
  }

  /* Remove previous event listener before adding a new one */
  document.getElementById("updateslist").removeEventListener("click", handle);

  /* Add new event listener with the current index */
  document.getElementById("updateslist").addEventListener("click", handle);
}

/* getting the date from the string */
function getData1(Date) {
  let month = "";
  month = Date.slice(0, 3);
  month = month.toLowerCase();
  switch (month) {
    case "jan":
      month = 1;
      break;
    case "feb":
      month = 2;
      break;
    case "mar":
      month = 3;
      break;
    case "apr":
      month = 4;
      break;
    case "may":
      month = 5;
      break;
    case "jun":
      month = 6;
      break;
    case "jul":
      month = 7;
      break;
    case "aug":
      month = 8;
      break;
    case "sep":
      month = 9;
      break;
    case "oct":
      month = 10;
      break;
    case "nov":
      month = 11;
      break;
    case "dec":
      month = 12;
      break;
    default:
      month = -1;
      break;
  }
  if (month == -1) {
    return Date;
  }
  let x = Date.slice(4);
  let Day = parseInt(x).toString();
  if (Day.length < 2) {
    Day = "0" + Day;
  }
  month = month.toString();
  if (month.length < 2) {
    month = "0" + month;
  }
  let y = Date.slice(-4);
  let year = parseInt(y);
  return `${year}-${month}-${Day}`;
}

/* function that handles edit of a pastUpdate on click  */
function handleDoubleClick(Task) {
  const updatesList = document.getElementById("updateslist");

  function handleListDoubleClick(event) {
    let Dateinstring;
    let initialDesc;
    const liElement = event.target.closest("li");
    if (liElement) {
      const childNodes = event.target.childNodes;
      if (childNodes && childNodes.length >= 2) {
        let Date = childNodes[0].textContent;
        let Description = childNodes[1].textContent;
        Date = Date.slice(0, Date.length - 1);
        Dateinstring = Date.trim();
        initialDesc = Description.trim();
        $("#updateModal1").modal("show");

        Date = getData1(Date);

        $("#updateDate1").val(Date);
        $("#updateDescription1").summernote("code", Description);
      }

      $("#updateModal1")
        .off("click", "#save1")
        .on("click", "#save1", handleSaveButtonClick);

      function handleSaveButtonClick() {
        const EditedDate = $("#updateDate1").val();
        const EditedDescription = $("#updateDescription1").summernote("code");
        if (EditedDate && EditedDescription) {
          const newContent = `<strong>${formatDate(
            EditedDate
          )}:</strong> ${EditedDescription} <i id="icon" class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;
          liElement.innerHTML = newContent;
          Task.weeklyUpdates = Task.weeklyUpdates.map((update) => {
            if (update.date == Dateinstring && update.desc == initialDesc) {
              return {
                date: formatDate(EditedDate).trim(),
                desc: EditedDescription.trim(),
              };
            }
            return update;
          });

          UpdateTaskInDatabase(Task);
        }
        $("#updateModal1").modal("hide");
        $("#updateDescription1").summernote("code", "");
      }
    }
  }

  /* initially the event is double click to make it work fine with mobile modified to single click */
  updatesList.addEventListener("click", handleListDoubleClick);
}

// data for assigned to from the api
var ticker;
var responseData;
/* The data for edit assigned is getting from this*/

/*......................................get_ticker_database......................... */
$.ajax({
  url: "https://dokaudi.com/get_ticker_database",
  type: "POST",
  contentType: "application/json",
  data: JSON.stringify({ ticker: "ixigo IN" }),
  success: function (apiResponse) {
    ticker = apiResponse.result;
    processData(ticker);
  },
  error: function (apiResponse) {
    console.error("Error fetching director details from the database:");
  },
});

let apiData;
function processData(data) {
  apiData = data;
}

/* 
  Function that deletes the assignee when clicked on delete icon 
*/
function handleDeleteAssigne(Assigned, Task) {
  /* getting the assignees list from the dom */
  const candidatesNames = document.getElementById("candidatesList");

  /* callback function that triggers when delete icon is clicked */
  function DeleteAssignee(e) {
    if (e.target.classList.contains("fa-trash")) {
      const name = e.target.parentNode.textContent.trim();

      candidatesNames.removeChild(e.target.parentNode);
      // + ", " + item.role
      const id = Assigned.findIndex((item) => {
        return item.fullName == name;
      });

      Task.assignedTo = Task.assignedTo.filter((item, currentIndex) => {
        return currentIndex != id;
      });

      UpdateTaskInDatabase(Task);
    }
  }
  candidatesNames.addEventListener("click", DeleteAssignee);
}

const AssignedTo = document.getElementsByTagName("ol");

/* function that handles the description on click */
function handleDescription(Task) {
  const Description = document.getElementById("desc");
  // updated to click event to make it work with mobile
  Description.addEventListener("click", function () {
    const DescriptionElement = document.getElementById("desc").textContent;
    const currentDescription =
      DescriptionElement.split("Description:")[1].trim();
    $("#editDescriptionModal").modal("show");
    $("#descriptionInput").summernote("code", currentDescription);
  });
  $("#editDescriptionModal")
    .off("click", "#saveDescriptionBtn")
    .on("click", "#saveDescriptionBtn", function () {
      let descriptionFromSummerNote = $("#descriptionInput").summernote("code");

      if (descriptionFromSummerNote === "") {
        alert("Please enter a valid description");
      } else {
        Description.innerHTML = `<p id="desc"><strong>Description:</strong> ${descriptionFromSummerNote}</p>`;
        console.log("I will update in db for task desc");
        Task.description = descriptionFromSummerNote;
        UpdateTaskInDatabase(Task);

        $("#editDescriptionModal").modal("hide");
      }
    });
}

/* function that handles the taskid on click */
function handleTaskId(Task) {
  const TaskIdElement = document.getElementById("taskid");
  // updated to click event to make it work with mobile
  function cbfortaskid(e) {
    const TaskIdElementTextContent =
      document.getElementById("taskid").textContent;
    const TaskIdInitial = TaskIdElementTextContent.split("Task ID:")[1].trim();
    $("#taskIDInput").summernote("code", TaskIdInitial);
    $("#editTaskIDModal").modal("show");
  }
  TaskIdElement.addEventListener("click", cbfortaskid);
  $("#editTaskIDModal")
    .off("click", "#saveTaskIDBtn")
    .on("click", "#saveTaskIDBtn", function () {
      // e.stopImmediatePropagation();
      const TaskIdFromSummerNote = $("#taskIDInput").summernote("code");
      if (TaskIdFromSummerNote === "") {
        alert("Please enter a valid TaskId");
      } else {
        TaskIdElement.innerHTML = `<p id="taskid"><strong>Task ID:</strong> ${TaskIdFromSummerNote}</p>`;

        Task.name = TaskIdFromSummerNote;
        console.log("I will update in the db for Task Id");
        UpdateTaskInDatabase(Task);

        $("#editTaskIDModal").modal("hide");
      }
    });
}

/* functions that sets the startDate in dom of each Task dynamically from the Json */
function setStartDate(Task) {
  const startDateElement = document.getElementById("startDatePicker");
  const startDate = Task.startDate;
  if (startDate) startDateElement.value = startDate;
}

/* function that sets the endDate in dom of each Task dynamically from the Json */
function setEnddate(Task) {
  const endDateElement = document.getElementById("endDatePicker");

  const endDate = Task.endDate;
  if (endDate) endDateElement.value = endDate;
}

/* 
function that is responsible to handle dates change in the dom 
and update in the db
*/
function handleDates(taskDetails) {
  const startDate = document.getElementById("startDatePicker");
  startDate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.startDate = startDate.value;
    UpdateTaskInDatabase(Task);
  });
  const endDate = document.getElementById("endDatePicker");
  endDate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.endDate = endDate.value;
    UpdateTaskInDatabase(Task);
  });
  const nextUpdate = document.getElementById("nextUpdateDate");
  nextUpdate.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.nextUpdate = nextUpdate.value;
    UpdateTaskInDatabase(Task);
  });
  const radioBtnDiv = document.getElementById("radioBtnDiv");
  radioBtnDiv.addEventListener("change", function (e) {
    const Task = taskDetails[currentIndex];
    Task.status = e.target.value;
    UpdateTaskInDatabase(Task);
  });
}

const navBar = document.getElementById("navbar");

/* 
  function that is resposible to the send update request to the database through 
  update_calender_database  
*/

/*........................................update_calender_database...................*/

function UpdateTaskInDatabase(Task) {
  const {
    id,
    name,
    assignedTo,
    description,
    startDate,
    nextUpdate,
    endDate,
    progress,
    rating,
    status,
    weeklyUpdates,
    calender_id,
  } = Task;
  const ids = assignedTo.map((item) => item.id);

  const JsonForApi = {
    task_id: id,
    title: name,
    assigned_to: ids,
    description: description,
    rating: rating,
    start: startDate,
    end: endDate,
    next_update: nextUpdate,
    updates: weeklyUpdates,
    status: status,
    progress: progress,
    calender_id: calender_id,
  };

  $.ajax({
    url: "https://dokaudi.com/update_calender_database",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(JsonForApi),
    success: function (apiResponse) {
      console.log(apiResponse);
      location.reload();
    },
    error: function (apiResponse) {
      console.error("Error fetching director details from the database:");
    },
  });
}

/* Function that is responsibe for add assigne when clicked */
function addAssignee(Task) {
  const addIcon = document.getElementById("editIcon");
  const addAssigneeDropDown = document.getElementById("addAssignee");
  const candidatesList = document.getElementById("candidatesList");

  if (apiData) {
    // +" ," + item.client_role;

    apiData.forEach((item) => {
      let name =
        item.client_first_name +
        " " +
        item.client_middle_name +
        " " +
        item.client_last_name;
      let assignOption = `<option clientid="${item.client_id}" value="${name}">${name}</option>`;

      addAssigneeDropDown.innerHTML += assignOption;
    });
  }
  addIcon.addEventListener("click", function (e) {
    $("#addAssigneeModal").modal("show");
  });

  $("#addAssigneeModal")
    .off("click", "#add")
    .on("click", "#add", function () {
      const selectElement = document.getElementById("addAssignee");
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const clientId = selectedOption.getAttribute("clientid");
      const listElement = document.createElement("li");

      listElement.innerHTML = ` ${selectedOption.value} <i class="fa fa-trash" aria-hidden="true" style='color: red'></i>`;

      candidatesList.appendChild(listElement);

      Task.assignedTo.push({ id: clientId, fullName: selectedOption.value });

      UpdateTaskInDatabase(Task);
      $("#addAssigneeModal").modal("hide");
    });
}

/*.......................... Apex Charts ..................................... */

const currentDate = new Date();
let taskDetails1 = [];

function renderChart(data) {
  /* Transforming the data into the format expected by ApexCharts */

  const SampleData = data.map((item) => {
    let prog = parseFloat(item.progress);
    if (isNaN(prog)) {
      prog = 0;
    }
    return {
      id: `${item.id}`,
      name: item.name,
      description: item.description,
      startDate: item.startDate,
      endDate: item.endDate,
      x: `${item.description} (${item.name})`.toUpperCase(),
      y: [new Date(item.startDate).getTime(), new Date(item.endDate).getTime()],
      progress: prog,
    };
  });

  /* Creating options to show apex charts syntax from official docs */
  var options = {
    series: [
      {
        name: "Task",
        data: SampleData,
      },
    ],
    chart: {
      height: "70%",

      type: "rangeBar",
      events: {
        /* attaching click event   */
        click: function (event, chartContext, config) {
          const index = config.dataPointIndex;
          if (
            index !== undefined &&
            index !== null &&
            chartContext.opts.series.length > 0 &&
            chartContext.opts.series[0].data.length > index &&
            chartContext.opts.series[0].data[index].id !== undefined
          ) {
            const id = chartContext.opts.series[0].data[index].id;
            if (id != -1) {
              localStorage.setItem("taskId", id);
              window.location = `TaskParticulars.html`;
            }
          }
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      /* The function that is responsible to display labels as per requirement */
      formatter: function (val, opts) {
        let label = opts.w.globals.labels[opts.dataPointIndex];

        let progress =
          opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
            .progress + "%";
        var windowWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        /* Handling for less screen width devices */
        if (windowWidth < 768) {
          let text = opts.w.globals.labels[opts.dataPointIndex].split("(")[1];
          let len = text.length;
          return (label = text.slice(0, len - 1));
        }

        return label + ": " + progress + " completed";
      },
      style: {
        colors: ["#000000", "#000000"],
        fontSize: "10px",
      },
    },
    xaxis: {
      type: "datetime",
      /*This is responsible for the starting of apex charts while displaying */
      min: new Date("2023-11-01").getTime(),
    },
    yaxis: {
      show: false,
    },
    grid: {
      row: {
        colors: ["#f3f4f5", "#fff"],
        opacity: 1,
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date().getTime(),
          strokeDashArray: 0,
          borderColor: "#ff0000",
          label: {
            borderWidth: 1,
            borderColor: "#999",
            textAnchor: "start",
            orientation: "horizontal",
            position: "top",
            text: "Today",
            style: {
              color: "black",
              background: "yellow",
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4,
              },
              fontSize: "12px",
            },
            offsetY: 20,
            offsetX: -10,
          },
        },
      ],
    },
    tooltip: {
      /* Custom fuction that is used show the data as per our need while hoverovering */
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        var item = data[dataPointIndex];
        var tooltipContent =
          '<div  class="custom-tooltip">' +
          "<strong>Name:</strong> " +
          item.name +
          "<br>" +
          "<strong>Description:</strong> " +
          item.description +
          "<br>" +
          "<strong>Start Date:</strong> " +
          item.startDate +
          "<br>" +
          "<strong>End Date:</strong> " +
          item.endDate +
          "<br>" +
          "</div>";
        return tooltipContent;
      },
    },
    /* This is used for responsiveness */
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: "100%",
          },
        },
      },
    ],
  };

  /* Showing the colour of the progess baed on
     the progress and start date and end date
 */
  options.series[0].data.forEach((task) => {
    const endDate = new Date(task.y[1]);
    const startDate = new Date(task.y[0]);
    const progress = task.progress;

    if (progress == 100) {
      task.fillColor = "#33FF33";
    } else if (currentDate > endDate && progress < 100) {
      task.fillColor = "#FF6666";
    } else if (currentDate < startDate) {
      task.fillColor = "#00d2ff";
    } else if (currentDate <= endDate && progress < 100) {
      if (progress <= 25) {
        task.fillColor = "#FFFF00";
      } else if (progress <= 50) {
        task.fillColor = "#FFD700";
      } else if (progress <= 75) {
        task.fillColor = "#FFA500";
      } else {
        task.fillColor = "#FFFF00";
      }
    } else if (currentDate > endDate && progress == 100) {
      task.fillColor = "#33FF33";
    } else {
      task.fillColor = "#00d2ff";
    }
  });
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
}

/* Show the loading overlay initially */
const loadingOverlay = document.getElementById("loading-overlay");

loadingOverlay.style.display = "block";

/* Using the fetchData and processTaskData functions from apiService */
apiService
  .fetchData()
  .then(apiService.processTaskData)
  .then((data) => {
    taskDetails1 = data;
    renderChart(data);
    loadingOverlay.style.display = "none";
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });

/*...................Tabulator......................................*/

/* Get the current year */
const currentYear = new Date().getFullYear();

/* Wait for the DOM content to be loaded */
document.addEventListener("DOMContentLoaded", function () {
  /* Targetting the loader element from the dom */
  const loadingOverlay = document.getElementById("loading-overlay");

  /* Show the loading overlay initially until we get data from api */

  loadingOverlay.style.display = "block";
  /* Call the fetchData method from the apiService */
  apiService
    .fetchData()
    .then((apiResponse) => {
      /*
       Process the API response using the 
       processTaskData method from the apiService
     */
      const taskDetailsFromApi = apiService.processTaskData(apiResponse);

      /* 
      Sorting the Data as per the id and adding some padding depends on the no of dots
      */
      taskDetailsFromApi.sort((a, b) => {
        const idPartsA = a.id.split(".").map((part) => parseFloat(part));
        const idPartsB = b.id.split(".").map((part) => parseFloat(part));

        for (let i = 0; i < Math.max(idPartsA.length, idPartsB.length); i++) {
          const partA = idPartsA[i] || 0;
          const partB = idPartsB[i] || 0;

          if (partA !== partB) {
            return partA - partB;
          }
        }

        return 0;
      });

      /* Create the Tabulator table with the API data */
      createTabulatorTable(taskDetailsFromApi);

      /* Once we created the table hiding the loadingOverlay */
      loadingOverlay.style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  /* Declare a variable for the Tabulator table */
  var table;

  /* Function to create the Tabulator table */
  function createTabulatorTable(data) {
    function dateEditor(cell, onRendered, success, cancel, editorParams) {
      const input = document.createElement("input");
      input.setAttribute("type", "date");
      input.style.width = "100%";
      input.style.boxSizing = "border-box";

      /* Set the value of the input to the cell value */
      input.value = cell.getValue();

      input.addEventListener("change", function (e) {
        success(input.value);
      });

      input.addEventListener("blur", function (e) {
        success(input.value);
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          cancel();
        }
      });

      onRendered(function () {
        input.focus();
      });

      return input;
    }

    var rowMenu = [
      {
        label: "<i class='fas fa-user'></i> Change Name",
        action: function (e, row) {
          row.update({ name: "Steve Bobberson" });
        },
      },
      {
        label: "<i class='fas fa-check-square'></i> Select Row",
        action: function (e, row) {
          row.select();
        },
      },
      {
        separator: true,
      },
      {
        label: "Admin Functions",
        menu: [
          {
            label: "<i class='fas fa-trash'></i> Delete Row",
            action: function (e, row) {
              row.delete();
            },
          },
          {
            label: "<i class='fas fa-ban'></i> Disabled Option",
            disabled: true,
          },
        ],
      },
    ];

    //define column header menu as column visibility toggle
    var headerMenu = function () {
      var menu = [];
      var columns = this.getColumns();

      for (let column of columns) {
        //create checkbox element using font awesome icons
        let icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(
          column.isVisible() ? "fa-check-square" : "fa-square"
        );

        //build label
        let label = document.createElement("span");
        let title = document.createElement("span");

        title.textContent = " " + column.getDefinition().title;

        label.appendChild(icon);
        label.appendChild(title);

        //create menu item
        menu.push({
          label: label,
          action: function (e) {
            //prevent menu closing
            e.stopPropagation();

            //toggle current column visibility
            column.toggle();

            //change menu item icon
            if (column.isVisible()) {
              icon.classList.remove("fa-square");
              icon.classList.add("fa-check-square");
            } else {
              icon.classList.remove("fa-check-square");
              icon.classList.add("fa-square");
            }
          },
        });
      }

      return menu;
    };

    /* Syntax to create a table from the data */
    table = new Tabulator("#example-table", {
      data: data,
      height: "60vh",
      pagination: "local",
      paginationSize: 15,
      paginationSizeSelector: [3, 6, 8, 10],
      movableColumns: true,
      paginationCounter: "rows",
      rowContextMenu: rowMenu,
      responsiveLayoutCollapseUseFormatters: false,

      // height: "382px",

      // responsiveLayout: "collapse",

      dataTree: true,
      columns: [
        { title: "sno", formatter: "rownum", hozAlign: "center", width: 60 },
        {
          title: "Id",
          field: "id",
          editor: true,
          width: 60,
        },
        {
          title: "Task",
          field: "name",
          editor: true,
          width: 300,
          headerMenu: headerMenu,
        },
        {
          title: "Description",
          field: "description",
          editor: true,
          width: 500,
          headerMenu: headerMenu,
        },
        {
          title: "Assigned To",
          field: "assignedTo",
          width: 400,
          headerMenu: headerMenu,
          formatter: function (cell, formatterParams) {
            const assignedToString = cell
              .getValue()
              .map((item) => item.fullName)
              .join(", ");
            return assignedToString;
          },
        },
        { title: "%", field: "progress", editor: true, headerMenu: headerMenu },
        {
          title: "Task Progress",
          field: "progress",
          hozAlign: "left",
          formatter: "progress",
          formatterParams: {
            color: ["red", "orange", "lightgreen", "green"],
          },
          editor: true,
          headerMenu: headerMenu,
        },
        {
          title: "Start Date",
          field: "startDate",
          editor: dateEditor,
          headerMenu: headerMenu,
        },
        {
          title: "End Date",
          field: "endDate",
          editor: dateEditor,
          headerMenu: headerMenu,
        },
        {
          title: "Rating",
          field: "rating",
          formatter: "star",
          formatterParams: { stars: 5, color: "green" },
          hozAlign: "center",
          width: 100,
          editor: true,
          headerMenu: headerMenu,
        },

        {
          title: "Status",
          field: "status",
          editor: "select",
          headerMenu: headerMenu,
          editorParams: {
            values: { open: "Open", close: "Close", passive: "Passive" },
          },
        },
        {
          title: "cal",
          field: "icon",
          formatter: function (cell, formatterParams, onRendered) {
            return '<i class="fa fa-calendar" aria-hidden="true"></i>';
          },
        },
      ],
    });

    table.on("cellClick", function (e, cell) {
      if (cell.getField() === "icon") {
        // console.log(cell.getData());
        console.log("clicked Calander Icon");
      }
    });
    /* Adding dblclick event listener to each row */
    table.on("rowDblClick", function (e, row) {
      let task = row.getData();
      const obj = data.find((item) => task.id === item.id);

      if (obj) {
        const taskId = obj.id;
        localStorage.setItem("taskId", taskId);

        window.open("TaskParticulars.html", "_blank");
      }
    });
    /* This is for touch events */
    table.on("rowTap", function (e, row) {
      let task = row.getData();
      const obj = data.find((item) => task.id === item.id);

      if (obj) {
        const taskId = obj.id;
        localStorage.setItem("taskId", taskId);

        window.open("TaskParticulars.html", "_blank");
      }
    });

    /* Funtion that is called when an edit occurs in the tabulator
       to update in the data base 
    */
    function updateInDataBase(rowData) {
      const {
        id,
        name,
        description,
        assignedTo,
        rating,
        startDate,
        endDate,
        nextUpdate,
        weeklyUpdates,
        status,
        progress,
        calender_id,
      } = rowData;
      const ids = assignedTo.map((item) => item.id);
      const databaseObj = {
        task_id: id,
        title: name,
        assigned_to: ids,
        description: description,
        rating: rating,
        start: startDate,
        end: endDate,
        next_update: nextUpdate,
        updates: weeklyUpdates,
        status: status,
        progress: progress,
        calender_id: calender_id,
      };

      $.ajax({
        url: "https://dokaudi.com/update_calender_database",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(databaseObj),
        success: function (apiResponse) {
          location.reload();
          console.log(apiResponse);
        },
        error: function (apiResponse) {
          console.error(
            "Error fetching director details from the database: ",
            apiResponse
          );
        },
      });
    }
    /* When an edit even is trigreed handling that  */
    table.on("cellEdited", function (cell) {
      if (cell.getField() === "rating") {
        let editedValue = cell.getValue();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        let rowData = cell.getRow().getData();
        rowData.rating = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() === "progress") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.progress = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() == "id") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.id = editedValue;
        // console.log(rowData);
        updateInDataBase(rowData);
      } else if (cell.getField() == "description") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.description = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() == "name") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.name = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() == "startDate") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.startDate = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() == "endDate") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.endDate = editedValue;
        updateInDataBase(rowData);
      } else if (cell.getField() == "status") {
        const editedValue = cell.getValue();
        const rowData = cell.getRow().getData();
        console.log(`${cell.getField()} updated value : ${editedValue}`);
        rowData.status = editedValue;
        updateInDataBase(rowData);
      }
    });
  }

  /* Get elements by ID for filter fields */
  var fieldEl = document.getElementById("filter-field");
  var typeEl = document.getElementById("filter-type");
  var valueEl = document.getElementById("filter-value");

  /* Function to update the table filter based on user input */
  function updateFilter() {
    var filterVal = fieldEl.value;
    var typeVal = typeEl.value;

    if (valueEl.value.trim() !== "") {
      table.setFilter(filterVal, typeVal, valueEl.value);
    } else {
      table.clearFilter();
    }
  }

  /* Add event listeners for filter fields and clear filter button */
  document
    .getElementById("filter-field")
    .addEventListener("change", updateFilter);
  document
    .getElementById("filter-type")
    .addEventListener("change", updateFilter);
  document
    .getElementById("filter-value")
    .addEventListener("keyup", updateFilter);

  document
    .getElementById("filter-clear")
    .addEventListener("click", function () {
      fieldEl.value = "";
      typeEl.value = "=";
      valueEl.value = "";

      table.clearFilter();
    });
});

function DeleteTask(Task) {
  const deleteEntireTaskIcon = document.getElementById("deleteEntireTaskIcon");

  function DeleteMe(e) {
    e.stopPropagation();
    $("#deleteConfirmationModal").modal("show");
    $("#deleteConfirmationModal")
      .off("click", "#yes")
      .on("click", "#yes", function (e) {
        const deleteformDataJSON = {};
        deleteformDataJSON.task_id = Task.id;
        $.ajax({
          url: "https://dokaudi.com/delete_calender_database",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify(deleteformDataJSON),
          success: function (apiResponse) {
            console.log(apiResponse["message"]);
            location.reload();
            // processData(ticker);
          },
          error: function (apiResponse) {
            console.error(
              "Error fetching director details from the database: ",
              apiResponse
            );
          },
        });
        $("#deleteConfirmationModal").modal("hide");
      });
  }

  deleteEntireTaskIcon.addEventListener("click", DeleteMe);
}
