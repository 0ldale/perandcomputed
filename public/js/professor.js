/**
 * Allows the signed in Professor to register accounts to a student who has not yet self-registered.
 */
async function registerStudent(){
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

    // get user values to call register method
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;

    console.log("Registered with:" + email, password);

    // try/catch to register the user
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
        document.getElementById('sucess').innerHTML = 'Student has been registered.'
        document.getElementById('err').innerHTML = '';
        console.log(data);
    }).catch(function(error){
        document.getElementById('err').innerHTML = error.message;
        document.getElementById('sucess').innerHTML = ''
    })
}

