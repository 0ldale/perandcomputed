var userUID;
var fireUser;
var name;
var program;

/**
 * DOM EVENT TO TRACK USER STATE - AUTHORIZED OR UNAUTHORIZED
 */
document.addEventListener("DOMContentLoaded", event =>{
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            fireUser = firebaseUser;
            console.log("Logged in as: " + fireUser.displayName) 
            console.log(fireUser)
            userUID = firebaseUser.uid
            console.log(userUID, fireUser.displayName, fireUser.email)
        } else {
            console.log("Not logged in");
        }
    })
});

/**
 * Called when /login.html button is clicked.
 * Tries to log in user using Firebase credentials
 * @param {*} e 
 */
function login(e){
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
    
    // get user values to call sign in method
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    console.log(email, password);

    // try/catch to login the user
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        // console.log(firebaseUser);
        window.location.href = "memberIndex.html"; // if successful login, redirect
    }).catch(function(error){
        document.getElementById('loginerr').innerHTML = error.message;
    })
};

/**
 * Called when /register.html button is clicked
 * Tries to register user to Firebase db
 * @param {*} e 
 */
function registeruser(e){
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

    // get user values to call register method
    var email = document.getElementById('input_Email').value;
    var password = document.getElementById('inputPassword').value;
    console.log("Registered with:" + email, password);

    // try/catch to register the user
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        // listen for user state changes and perform appropriate action
        window.location.href = "initialSetup.html"; // if successful registration, redirect
    }).catch(function(error){
        document.getElementById('err').innerHTML = error.message;
    })
};

/**
 * Logs the user out from anypage this button is clicked. 
 * Redirects to login page.
 * @param {*} e 
 */
function logoutUser(e){
    console.log("Logging off....");
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

    // call sign out method
    firebase.auth().signOut().then(function(){
        // listen for user state changes
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                console.log(firebaseUser);
            } else {
                "Not logged in."
                window.location.href = "login.html";    // when logged out, redirect
            }
        })
    }).catch(function(error){
        alert(error.message);
    })
    console.log('Logged off.');
};

/** 
 * Called when finishing up new user registration. Comes from register.html, goes to memberIndex.html
 * @param {*} e 
 */
async function sendNewUserData(e){
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

    // get current user state
    var user = firebase.auth().currentUser;

    // get user data from submission form
    name = document.getElementById('newName').value;
    program = document.getElementById('newProgram').value;
    fireUser.displayName = name;

    const data = {
        uid: user.uid,
        name: name,
        program: program,
        professor: false
    };

    // Check if the name is valid and if professor. (Won't have to enter a program)
    if(name != '' && document.getElementById('professorCheck').checked){
        console.log('name ok and prof account')
        data.professor = true;  // Change account type from default (student) to professor
    
        // Add a new document in users collection for the new
        const res = await db.collection('users').doc(user.uid).set(data);

        fireUser.updateProfile({
            displayName: name,
        }).then(function() {
            console.log("Successfully updated displayName")
        }).catch(function(error) {
            console.log(error.message);
        });
      
        console.log("Added new user to the database.")
        window.location.href = "memberIndex.html"; // if successful setup, redirect
        return true;
    } 

    if(!document.getElementById('professorCheck').checked && name != '' && program != ''){
        console.log("good");
        // Add a new document in users collection for the new
        const res = await db.collection('users').doc(user.uid).set(data);

        fireUser.updateProfile({
            displayName: name,
        }).then(function() {
            console.log("Successfully updated displayName")
        }).catch(function(error) {
            console.log(error.message);
        });
      
        console.log("Added new user to the database.")
        window.location.href = "memberIndex.html"; // if successful setup, redirect
        return true;
    } 

    // If neither check passes, the input is bad.
    alert('Please enter valid information');
    return 'Bad Input';
}

/**
 * Sends password reset link
 */
function forgotPassword(){
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
    var emailAddress = document.getElementById('inputEmailReset').value;

    console.log(emailAddress);
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
        console.log('an email was sent to', emailAddress);
        document.getElementById('success').style.visibility = 'visible';
        document.getElementById('err').innerHTML = '';
    }).catch(function(error) {
        document.getElementById('err').innerHTML = error.message;
    });
}

/*************************************
 * FUNCTIONALITY FOR INTERNAL USERS  *
 *************************************/

/**
 * Get data from the current users entry in the database and feed it back
 * @param {e} e 
 */
async function getProgram(e){
    // setup global variables 
    var currUser;
    var fireuser;
    var auth = false;
    var data = {
        uid: null,
        name: null
    };

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

    // set variables according to current user
    await firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            // console.log(firebaseUser);  // testing purposes
            fireuser = firebaseUser
            data.uid = fireuser.uid
            var auth = true;
        } else {
            "Not logged in."
        }
    });

    // get the data from the users db item
    const userProgram = db.collection('users').doc(`${data.uid}`);
    const doc = await userProgram.get();
    if(!doc.exists){
        console.log('error, nothing found');
        return doc.data();
    } else {
        console.log('DATA: ', doc.data());
        document.getElementById("newProgram").defaultValue = data.program;
    }
}

/**
 * called when /settings.html is loaded
 * auto populate the fields in settings to the current values (name, email)
 * leave password blank but able to be updated
 */
async function populate(){
   var fireuser;
   var data = {
       uid: null,
       name: null
   };
   
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

    // set variables according to current user
    await firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
            fireuser = firebaseUser
            data.uid = fireuser.uid
            data.name = fireuser.displayName
        } 
    });

    firebase.auth().onAuthStateChanged(firebaseUser => {
        fireUser = firebaseUser;
        userUID = firebaseUser.uid;
        data.uid = firebaseUser.uid;
        data.name = fireUser.displayName;
        data.email = fireUser.email;
        document.getElementById("newName").defaultValue = data.name;
        document.getElementById("newEmail").defaultValue = data.email;
        checkAuth();
    })
}

/**
 * Update the users data in the database
 */
async function updateUser(){
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
    console.log('Current User: ', user);

    // grab the values from the form
    name = document.getElementById('newName').value;
    email = document.getElementById('newEmail').value;
    password = document.getElementById('newPassword').value;

    // reset the password if check passes
    if(password.value){
        console.log('Updating password...');
        user.updatePassword(password).then(function(){
            // Successful
        }).catch(function(error){
            console.log(error);
            document.getElementById('settingsMsg').innerHTML = error.message;
        })
    }

    // reset email if check passes
    user.updateEmail(email).then(function(){
        const res = db.collection('users').doc(`${user.uid}`).update({email: email});
    }).catch(function(error){
        console.log(error);
        document.getElementById('settingsMsg').innerHTML = error.message;
    })

    // reset name if check passes
    user.updateProfile({
        displayName: name
    }).then(function() {
        const res = db.collection('users').doc(`${user.uid}`).update({name: name});
    }).catch(function(error) {
        console.log(error);
        document.getElementById('settingsMsg').innerHTML = error.message;
    });

    document.getElementById('settingsMsg').innerHTML = 'Your settings have been updated.';

}

/**
 * checks the users authentication level when accessing /settings to determine
 * if they are able to see certain options. (teacher settings)
 */
async function checkAuth(){
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

    if(userData.data().professor == true){
        document.getElementById('profSettings').style.visibility = 'visible';
    }
}