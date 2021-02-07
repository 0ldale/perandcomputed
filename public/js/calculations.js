/**
 * The main calculators functionality for each possible calculator configuration
*/
var grades = []
var weights = []

/****************************************
 * FUNCTIONALITY FOR CURRENT CALCULATOR *
 ****************************************/

 /**
 * Change the main focus view to be either Course Average or GPA Calculator
 */
function changeView(){
    var inputs = document.getElementsByTagName('input');
    var view = document.querySelector('input[name="calculatorSwitch"]:checked').value;

    if(view == 'courseAverage'){
        console.log('CourseAverage Selected');
        document.getElementById('avgCalc').style.display = 'block'
        document.getElementById('gpaCalc').style.display = 'none'   
        document.getElementById('twlvNote').style.visibility = 'hidden';
    } else {
        console.log("GOA Selected");
        document.getElementById('avgCalc').style.display = 'none'
        document.getElementById('gpaCalc').style.display = 'block'   
    }

    // clear any leftover inputs from being seen (in case of switching between)
    for(i=0; i<inputs.length;i++){
        if(inputs[i].type == 'number' && inputs[i].value != ''){
            inputs[i].value = ''
        }
    }

    var dWeights = document.querySelectorAll('#gweight');
    dWeights.forEach(element => {
        element.disabled = false;
    });
}

/*************************************
 * FUNCTIONALITY FOR COURSE AVERAGES *
 *************************************/

/**
 * Grade Average Calculator
 * @param {*} e 
 */
function gradeAverageBasic(e){
    // clean the global arrays from any old inputs
    grades.splice(0, grades.length);
    weights.splice(0, weights.length);

    // fresh variables
    var topAvg = 0                  // the TOTAL NUMERATOR 
    var avg = null                  // the average of the mandatory inputs
    var curr_numerator = 0          // the numerator (grade * weight) of the value being LOOKED AT
    var weightSum = 0               // the sum of the weights
    var option1 = null;             // the first optional value
    var option2 = null;             // the second optional value
    var oInputs = new Array();      // stores the grades/weights coming in
    
    // store all of the input elements into an array to be looped through
    oInputs = document.getElementsByTagName('input'); 
     
    // loop through the elements and save them to their respective array
    for ( i = 0; i < oInputs.length; i++ ){
        if(oInputs[i].value != '' && oInputs[i].type == 'number'){
            if(oInputs[i].id == 'gweight'){
                weights.push(oInputs[i].value);
            } else if (oInputs[i].id == 'gscore') {
                grades.push(oInputs[i].value);
            } else if (oInputs[i].id == 'oscore_1'){
                option1 = oInputs[i].value;
            } else if (oInputs[i].id == 'oscore_2'){
                option2 = oInputs[i].value;
            } else {
                alert("Something went wrong, please try again.");
            }
        }
    }

    // check for valid entries (matching values and not empty arrays)
    if(grades.length != weights.length || grades.length == 0 || weights.length == 0){
        alert("Bad inputs, please try again.");
        return "Bad Inputs" // stop here
    };

    /**
     * Calculation Logic
     * https://www.rapidtables.com/calc/grade/grade-calculator.html
     */
    try {
        // loop through the arrays and calculate
        // we can assume theyre the same length since we made it here
        for ( i = 0; i < grades.length; i++ ){
            curr_numerator = (+weights[i]) * (+grades[i]);
            topAvg = (+curr_numerator) + (+topAvg);
        }

        weightSum = weights.reduce((a, b) => +a + +b, 0)
        avg = +topAvg / +weightSum;
        avg = Math.round(avg * 100) / 100

        /**
         * Option input calculations
         */
        // Optional 1 : What if i get x on the rest?
        if(option1){
            // Assume the class is out of 100%, so find the remaining %.
            var remainder = 100 - (+weightSum);
            grades.push(option1);
            weights.push(remainder);

            curr_numerator = (+weights[weights.length-1] * (+grades[grades.length-1]));
            topAvg = (+curr_numerator) + (+topAvg);

            weightSumNew = weights.reduce((a, b) => +a + +b, 0)
            var o1Avg = +topAvg / +weightSumNew;
            o1Avg = Math.round(o1Avg * 100) / 100
        }

        // Optional 2 : What do I need to get to finish with x?
        if(option2){
            var required = option2 / 100;
            var remainder = (100 - (+weightSum)) / 100
            var currentAvg = avg / 100

            var gradeNeeded = (required - (1 - remainder) * currentAvg) / remainder;
            gradeNeeded = Math.round(gradeNeeded * 100);
        }

        // call to show results
        showResults(avg, weightSum, option1, o1Avg, option2, gradeNeeded)

    } catch(err){
        console.log(err);
        alert("Something went wrong, please refresh and try again.");
        return "Bad Inputs" // stop here
    }
}

/**
 * Show the results from the course average calculations
 * @param {*} avg 
 * @param {*} weightSum 
 * @param {*} option1 
 * @param {*} o1Avg 
 * @param {*} option2 
 * @param {*} gradeNeeded 
 */
function showResults(avg, weightSum, option1, o1Avg, option2, gradeNeeded){
    // show the output. this is not permanent and will disappear after leaving/refreshing
    document.getElementById('radios').style.display = 'none';
    document.getElementById('gradeTable').style.display = 'none';
    document.getElementById('average').innerHTML = `Your current average is ${avg}% out of a combined ${weightSum}%`;
    document.getElementById('results').style.visibility = 'visible';

    // optional output
    if(option1){
        document.getElementById('optionalOutput1').innerHTML = `If you get ${option1}% on the remaining assignments, your average will be ${o1Avg}%`;
    }

    if(option2){
        document.getElementById('optionalOutput2').innerHTML = `To end up with ${option2}%, you will need ${gradeNeeded}% on the remaining assignments.`;
    }
}

/**************************************
 * FUNCTIONALITY FOR GPA CALCULATIONS *
 **************************************/

function buttonValue(){
    var gpaType = document.querySelector('input[name="GPASwitch"]:checked').value;

    if(gpaType == 'fourGPACalc'){
        console.log('4.0 GPA Selected');
        document.getElementById('calculateButton').value = 'four';
        document.getElementById('twlvNote').style.visibility = 'hidden';
        var dWeights = document.querySelectorAll('#gweight');
        dWeights.forEach(element => {
            element.disabled = false;
        });
    } else {
        console.log("12 Points Selected");
        document.getElementById('calculateButton').value = 'twelve';
        document.getElementById('twlvNote').style.visibility = 'visible';
        var dWeights = document.querySelectorAll('#gweight');
        dWeights.forEach(element => {
            element.disabled = true;
        });
    }
}

function callGPA(){
    var calcType = document.getElementById('calculateButton').value;
    console.log('calctype', calcType);

    if(calcType == 'four'){
        basicGPA();
    } else if (calcType == 'twelve') {
        twlvPoint();
    } else {
        basicGPA();
    }

}

/**
 * Basic 4.0 scale GPA
 * https://www.rapidtables.com/calc/grade/gpa-calculator.html
 */
function basicGPA(){
    // clean the global arrays from any old inputs
    grades.splice(0, grades.length);
    weights.splice(0, weights.length);
    
    // variables
    var total_numerator = 0;
    var curr_numerator = 0;
    var denominator = 0;
    var oInputs = new Array();      // stores the grades/weights coming in
    
    // store all of the input elements into an array to be looped through
    oInputs = document.getElementsByTagName('input'); 
     
    // loop through the elements and save them to their respective array
    for ( i = 0; i < oInputs.length; i++ ){
        if(oInputs[i].value != '' && oInputs[i].type == 'number'){
            if(oInputs[i].id == 'gweight'){
                weights.push(oInputs[i].value);
            } else if (oInputs[i].id == 'gscore') {
                grades.push(oInputs[i].value);
            } else if (oInputs[i].id == 'oscore_1'){
                option1 = oInputs[i].value;
            } else if (oInputs[i].id == 'oscore_2'){
                option2 = oInputs[i].value;
            } else {
                alert("Something went wrong, please try again.");
            }
        }
    }

    // check for valid entries (matching values and not empty arrays)
    if(grades.length != weights.length || grades.length == 0 || weights.length == 0){
        alert("Bad inputs, please try again.");
        return "Bad Inputs" // stop here
    };

    // loop through the grades and change the percentage based on the corresponding letter grade
    // https://pages.collegeboard.org/how-to-convert-gpa-4.0-scale
    for (i = 0; i < grades.length; i++){
        console.log('before', grades[i]);
        if( grades[i] >= 97 ){
            grades[i] = 4.33; // A+
        } else if ( grades[i] >= 93 ) {
            grades[i] = 4; // A
        } else if ( grades[i] >= 90 ) {
            grades[i] = 3.67; // A-
        } else if ( grades[i] >= 87 ) {
            grades[i] = 3.33 // B+
        } else if ( grades[i] >= 83 ) {
            grades[i] = 3; // B
        } else if ( grades[i] >= 80 ) {
            grades[i] = 2.67; // B-
        } else if ( grades[i] >= 77 ) {
            grades[i] = 2.33; // C+
        } else if ( grades[i] >= 73 ) {
            grades[i] = 2; // C
        } else if ( grades[i] >= 70 ) {
            grades[i] = 1.67; // C-
        } else if ( grades[i] >= 67 ) {
            grades[i] = 1.33; // D+
        } else if ( grades[i] >= 65 ) {
            grades[i] = 0.67; // D
        } else {
            grades[i] = 0; // F
        }
        console.log('after', grades[i]);
    }

    //calculations
    try{
        // loop through the arrays and calculate
        // we can assume theyre the same length since we made it here
        for ( i = 0; i < grades.length; i++ ){
            curr_numerator = (+weights[i]) * (+grades[i]);
            total_numerator = (+curr_numerator) + (+total_numerator);
            denominator = denominator + (+weights[i])
        }

        var gpa = Math.round((+total_numerator) / (+denominator) * 100) / 100;
        showGPA(gpa, denominator);

    } catch(error){

    }


}

/** 12 Point GPA */
function twlvPoint(){
    // clean the global arrays from any old inputs
    grades.splice(0, grades.length);
    weights.splice(0, weights.length);
    
    // variables
    var numerator = 0;
    var denominator = 0;
    var oInputs = new Array();      // stores the grades/weights coming in
    
    // store all of the input elements into an array to be looped through
    oInputs = document.getElementsByTagName('input'); 
     
    // loop through the elements and save them to their respective array
    for ( i = 0; i < oInputs.length; i++ ){
        if(oInputs[i].value != '' && oInputs[i].type == 'number'){
            if (oInputs[i].id == 'gscore') {
                grades.push(oInputs[i].value);
            } else if (oInputs[i].id == 'oscore_1'){
                option1 = oInputs[i].value;
            } else if (oInputs[i].id == 'oscore_2'){
                option2 = oInputs[i].value;
            } else {
                alert("Something went wrong, please try again.");
            }
        }
    }

    // check for valid entries (matching values and not empty arrays)
    if(grades.length == 0){
        alert("Bad inputs, please try again.");
        return "Bad Inputs" // stop here
    };

    // loop through the grades and change the percentage based on the corresponding range
    // https://students.wlu.ca/programs/lazaridis-school/business/news/2017/how-to-calculate-gpa.html
    // https://students.wlu.ca/academics/support-and-advising/gpa-calculator/index.html
    // !!! THE NUMBERS ARE HALVED ON THE ASSUMPTION THAT EACH CLASS CREDIT WEIGHT IS 0.5
    for (i = 0; i < grades.length; i++){
        console.log('before', grades[i]);
        if( grades[i] >= 90 ){
            grades[i] = 6 // 12
        } else if ( grades[i] >= 85 ) {
            grades[i] = 5.5 // 11
        } else if ( grades[i] >= 80 ) {
            grades[i] = 5 // 10
        } else if ( grades[i] >= 77 ) {
            grades[i] = 4.5; // 9
        } else if ( grades[i] >= 73 ) {
            grades[i] = 4; // 8 
        } else if ( grades[i] >= 70 ) {
            grades[i] = 3.5; // 7
        } else if ( grades[i] >= 67 ) {
            grades[i] = 3; // 6
        } else if ( grades[i] >= 63 ) {
            grades[i] = 2.5;  // 5
        } else if ( grades[i] >= 60 ) {
            grades[i] = 2; // 4
        } else if ( grades[i] >= 57 ) {
            grades[i] = 1.5; // 3
        } else if ( grades[i] >= 53 ) {
            grades[i] = 1; // 2
        } else if ( grades[i] >= 50 ) {
            grades[i] = 0.5; // 1
        } else {
            grades[i] = 0; // 0
        }
        console.log('after', grades[i]);
    }

    //calculations
    try{
        // loop through the arrays and calculate
        // we can assume theyre the same length since we made it here
        for ( i = 0; i < grades.length; i++ ){
            numerator = (+numerator) + (+grades[i]);
            denominator = denominator + (+0.5);
        }

        var pntgpa = (+numerator) / (+denominator);
        showGPA(pntgpa, denominator);

    } catch(error){

    }
}

/**
 * Show the GPA results
 * @param {*} gpa 
 * @param {*} credits 
 */
function showGPA(gpa, credits){
    // show the output. this is not permanent and will disappear after leaving/refreshing
    document.getElementById('radios').style.display = 'none';
    document.getElementById('gpaTable').style.display = 'none';
    document.getElementById('GPA').innerHTML = `Your current GPA is ${gpa} with ${credits} credits earned.`;
    document.getElementById('gpaResults').style.visibility = 'visible';

    // optional output
    // if(option1){
    //     document.getElementById('optionalOutput1').innerHTML = `If you get ${option1}% on the remaining assignments, your average will be ${o1Avg}%`;
    // }

    // if(option2){
    //     document.getElementById('optionalOutput2').innerHTML = `To end up with ${option2}%, you will need ${gradeNeeded}% on the remaining assignments.`;
    // }
}

