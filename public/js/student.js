/**
 * Change the Courses.html view to be either view courses/all courses/add course
 * Also changes object views depending on the user account type
 */
async function changeCourseView(){
    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;
    const userDataDB = db.collection('users').doc(user.uid);
    const userData = await userDataDB.get(); 

    let courseView = document.querySelector('input[name="courseView"]:checked').value;
    
    if (courseView == 'courseCurrent'){
        fillDropdown();
        document.getElementById('courseCurrentView').style.display = 'block';
        document.getElementById('allCoursesView').style.display = 'none';
        document.getElementById('addCourseView').style.display = 'none';
    } else if (courseView == 'courseAll'){
        document.getElementById('courseCurrentView').style.display = 'none';
        document.getElementById('allCoursesView').style.display = 'block';
        document.getElementById('addCourseView').style.display = 'none';
        viewAllCourses();
    } else {
        document.getElementById('courseCurrentView').style.display = 'none';
        document.getElementById('allCoursesView').style.display = 'none';
        document.getElementById('addCourseView').style.display = 'block';
        if(userData.data().professor == true){
            document.getElementById('newCourseGrade').disabled = true;
        }
    }
}

/**
 * Accepts form input and creates a new Course in the database
 */
async function addNewCourse(){
    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;

    // grab the values from the form
    courseCode = document.getElementById('newCourseCode').value;
    courseName = document.getElementById('newCourseName').value;
    courseGrade = document.getElementById('newCourseGrade').value;

    // set the values
    const newCourseData = {
        code: courseCode,
        name: courseName,
        finalGrade: null // grade is optional. it will be set later if value found
    }

    if(courseCode != '' && courseName != ''){
        if(courseGrade != '') { newCourseData.finalGrade = courseGrade; }
        const res = await db.collection('users').doc(user.uid).collection('courses').doc(courseCode).set(newCourseData)
        .then(function(){
            document.getElementById('coursePageMessage').innerHTML = 'Course Added Successfully'
            var inputs = document.getElementsByTagName('input');
            for(i=0; i<inputs.length;i++){
                inputs[i].value = ''
            }
            populateAssignments();
        }).catch(function(error){
            console.log(error.message);
            document.getElementsById('coursePageMessage').innerHTML = error.message;
        });
    } else {
        document.getElementById('coursePageMessage').innerHTML = 'Please enter valid course information.'
    }
}

/**
 * Creates fields for assignments and tests for the newly created course
 */
async function populateAssignments(){
    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;
    var batch = db.batch();

    const newCourseAssignments = [
        {
            name: 'Assignment1',
            grade: null
        },
        {
            name: 'Assignment2',
            grade: null
        },
        {
            name: 'Assignment3',
            grade: null
        },
        {
            name: 'Assignment4',
            grade: null
        },
        {
            name: 'Assignment5',
            grade: null
        },
        {
            name: 'Midterm',
            grade: null
        },
        {
            name: 'Exam',
            grade: null
        },
        {
            name: 'Bonus Mark',
            grade: null
        }
    ];

    newCourseAssignments.forEach((doc) => {
        var res = db.collection('users').doc(user.uid).collection('courses').doc(courseCode).collection('deliverables').doc();
        batch.set(res, doc);
    })

    batch.commit();

    // const res = await db.collection('users').doc(user.uid).collection('courses').doc(courseCode).collection('assignments').add(newCourseAssignments);
    // const resq = await db.collection('users').doc(user.uid).collection('courses').doc(courseCode).collection('quizzes').add(newCourseQuizzes);
}

/**
 * Get all courses from the database under the current user instance.
 * Pass this data into the populating function as an array
 */
async function viewAllCourses(){
    courses = []
    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;

    const allCoursesDB = db.collection('users').doc(user.uid).collection('courses');
    const allCourses = await allCoursesDB.get()
    allCourses.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        courses.push(doc.data());
    });

    // call method to populate table
    populateAllCourses(courses);
}

/**
 * Accepts an array parameter to populate the courses table with data passed in.
 * @param {*} items 
 */
function populateAllCourses(items){
    const table = document.getElementById('allCourseTable');

    // empty it to avoid re-populating or over crowding
    for(var i = table.rows.length; i > 0; i--){
        table.deleteRow(i-1);
    }

    // populate table with all courses
    items.forEach( item => {
        let row = table.insertRow();
        let code = row.insertCell();
        code.innerHTML = item.code;
        let name = row.insertCell();
        name.innerHTML = item.name;
        let grade = row.insertCell();
        grade.innerHTML = item.finalGrade;
    })
}

/**
 * Sorts the table by column clicked, either ascending or descending
 * https://www.w3schools.com/howto/howto_js_sort_table.asp
 * @param {*} n 
 */
function sortTable(n) {
    console.log("clicked");
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("masterTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}

/**
 * Populate the dropdown picker with the users courses from the database
 */
async function fillDropdown(){
    
    var element = document.getElementById('coursePicker');
    var options = []
    let dropdown = $('#coursePicker').empty();
    // dropdown.empty(); // clear dropdown and reload - in cases of DB changes we want it to reflect in the ui
    // let head = document.createElement("option");
    // head.text = 'f'
    // dropdown.add(head);

    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;

    const courseCodesDB = db.collection('users').doc(user.uid).collection('courses');
    const courseCodes = await courseCodesDB.get()
    courseCodes.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        options.push(doc.data().code);
    });

    var select = document.getElementById('coursePicker');
    for(var i = 0; i < options.length; i++){
        var o = options[i];
        var el = document.createElement('option');
        el.textContent = o;
        el.value = o;
        select.appendChild(el);
    }
}

/**
 * Gets the value of the selected course from the dropdown menu and grabs the db data for that item
 */
async function selectedCourse(){
    var e = document.getElementById("coursePicker");
    var value = e.options[e.selectedIndex].value;

    assignments = []
    marks = []

    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;
    const userDataDB = db.collection('users').doc(user.uid);
    const userData = await userDataDB.get(); 

    document.getElementById('headerRow').style.visibility = 'visible'

    // PROFESSOR VIEW
    if(userData.data().professor == true){
        console.log('Professor View Loading...')
        // document.getElementById('gradecol').style.visibility = 'hidden';

        // push the DB data into an array to be used for populating
        const courseAssignmentsDB = db.collection('users').doc(user.uid).collection('courses').doc(value).collection('deliverables');
        const courseAssignments = await courseAssignmentsDB.orderBy('name').get()
        courseAssignments.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            assignments.push(doc.data());
        });

        // get table object
        const labTable = document.getElementById('assignmentDetails');

        // empty table to avoid re-populating or over crowding
        // avoid deleting the header rows, however 
        for(var i = labTable.rows.length-1; i > 0; i--){
            labTable.deleteRow(i);
        }

        let count = 0;
        // populate table with all courses
        assignments.forEach( a => {
            let row = labTable.insertRow(); 
            let assignment = row.insertCell();
            assignment.innerHTML = a.name;
            let grade = row.insertCell();
            grade.innerHTML = `<input type="number" class="form-control" id="deliverableGrade${count}" value="" name="weightBox">`;
            if(a.weight >= 0 ){
                document.getElementById(`deliverableGrade${count}`).value = a.weight;
            }
            let updatebtn = row.insertCell();
            updatebtn.innerHTML = `<a class="nav-link" id="updateWeightBtn" onclick="updateCourses(${count+1}, 'weight')" style="margin-left: inherit;">update</a>`
            count = count+1;
        })

        document.getElementById('gradecol').innerText = 'Weight'
        document.getElementById('coursePicker').style.marginTop = '15.5rem';
        document.getElementById('updateWeightBtn').style.visibility = 'visible';
    } 
    // STUDENT VIEW
    else {
        console.log('Student View Loading...')
        
        // push the DB data into an array to be used for populating
        const courseAssignmentsDB = db.collection('users').doc(user.uid).collection('courses').doc(value).collection('deliverables');
        const courseAssignments = await courseAssignmentsDB.orderBy('name').get()
        courseAssignments.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            assignments.push(doc.data());
        });

        // get table object
        const labTable = document.getElementById('assignmentDetails');

        // empty table to avoid re-populating or over crowding
        // avoid deleting the header rows, however 
        for(var i = labTable.rows.length-1; i > 0; i--){
            labTable.deleteRow(i);
        }

        let count = 0;
        // populate table with all courses
        assignments.forEach( a => {
            let row = labTable.insertRow();
            let assignment = row.insertCell();
            assignment.innerHTML = a.name;
            let grade = row.insertCell();
            grade.innerHTML = `<input type="number" class="form-control" id="deliverableGrade${count}" value="" name="gradeBox">`;
            if(a.grade >= 0 ){
                document.getElementById(`deliverableGrade${count}`).value = a.grade;
            }
            let updatebtn = row.insertCell();
            updatebtn.innerHTML = `<a class="nav-link" id="updateGradeBtn" onclick="updateCourses(${count+1}, 'grade')" style="margin-left: inherit;">update</a>`
            count = count+1;
        })

        document.getElementById('deliverableGrade5').disabled = true;
        document.getElementById('coursePicker').style.marginTop = '15.5rem';
        document.getElementById('updateGradeBtn').style.visibility = 'visible';
    }
}

/**
 * Updates the grade for the given course value
 * @param {*} num 
 */
async function updateCourses(num, field){
    var e = document.getElementById("coursePicker");
    var value = e.options[e.selectedIndex].value;
    var newGrade = document.getElementById(`deliverableGrade${num-1}`).value;

    if(newGrade < 0 || newGrade > 101){
        alert("Please enter a valid number");
        return 'Bad Inputs'
    }

    console.log(newGrade, num, field);

    // initialize firebase
    const app = firebase.app();
    const db = firebase.firestore();
    var firebaseConfig = {
        apiKey: "AIzaSyA49qDxR1SeNZ19Zormao6eyYeOodLuzhQ",
        authDomain: "percomputed.firebaseapp.com",
        databaseURL: "https://percomputed.firebaseio.com",
        projectId: "percomputed",
        storageBucket: "percomputed.appspot.com",
        messagingSenderId: "867800157781",
        appId: "1:867800157781:web:8eac7829e770a97860cedc",
        measurementId: "G-EQ7FLDHN75"
    };

    // current user
    var user = firebase.auth().currentUser;

    let deliverable = '';
    switch(num){
        case 1:
            deliverable = 'Assignment1';
            break;
        case 2:
            deliverable = 'Assignment2';
            break;
        case 3:
            deliverable = 'Assignment3';
            break;
        case 4:
            deliverable = 'Assignment4';
            break;
        case 5:
            deliverable = 'Assignment5';
            break;
        case 6:
            deliverable = 'Bonus';
            break;
        case 7:
            deliverable = 'Exam';
            break;
        case 8:
            deliverable = 'Midterm';
            break;
        default:
            alert("Something went wrong, please wait and try again.");
            break;
    }

    console.log('DELIVERABLE:', deliverable);
    

    if(field == 'grade'){
        var dbGrades = []

        const gradeDB = db.collection('users').doc(user.uid).collection('courses').doc(value).collection('deliverables');
        const grade = await gradeDB.orderBy('name').get()
        grade.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            dbGrades.push({grade: doc.data().grade, lab: doc.data().name});
            if(doc.data().name == deliverable){
                updateGrade(doc.id, newGrade);
            }
            async function updateGrade(id, grade){
                const res = db.collection('users').doc(`${user.uid}`).collection('courses').doc(value).collection('deliverables').doc(id).update({grade: newGrade})
                .then(function(){
                    alert("Grade successfully updated.")
                }).catch(function(error){
                    alert(error.message);
                });
            }
        });
    } else {
        var dbWeights = []

        const gradeDB = db.collection('users').doc(user.uid).collection('courses').doc(value).collection('deliverables');
        const grade = await gradeDB.orderBy('name').get()
        grade.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            dbWeights.push({weight: doc.data().weight, lab: doc.data().name});
            if(doc.data().name == deliverable){
                updateGrade(doc.id, newGrade);
            }

            async function updateGrade(id, weight){
                const res = db.collection('users').doc(`${user.uid}`).collection('courses').doc(value).collection('deliverables').doc(id).update({weight: newGrade})
                .then(function(){
                    alert("Weight successfully updated.")
                }).catch(function(error){
                    alert(error.message);
                });
            }
        });

    }
}