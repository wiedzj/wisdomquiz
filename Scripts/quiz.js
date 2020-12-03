let questionIndex = 0;

function renderQuestion() {
    var questionText = questions[questionIndex].question;
    document.getElementById("question").innerHTML = questionText;
}

const choicesContainer = document.getElementById("choices-container");

let visibleChoicesList = new Array();

function renderChoices() {

    for(i = 0; i < questions[questionIndex].choices.length; i++) {
        choiceNode = document.createElement('div');
        choiceNode.className = "choice";
        choiceNode.id = i;

        visibleChoicesList.push({
            node: choiceNode, index: 0
        });

        choiceElement = document.createElement('h1');
        choiceText = document.createTextNode(questions[questionIndex].choices[i].choiceText);
        choiceElement.appendChild(choiceText);
        choiceNode.appendChild(choiceElement);

        choiceImage = document.createElement("img");
        choiceImage.src = `Images/${questionIndex}/${questions[questionIndex].choices[i].choiceText}.png`;
        choiceImage.addEventListener("click", makeChoice);

        choiceNode.appendChild(choiceImage);

        quoteContainer = document.createElement('div');
        quoteContainer.className = 'quotes-container';

        previousQuoteButton = document.createElement("button");
        previousQuoteButton.innerHTML = "<";
        previousQuoteButton.className ='previous-quote-btn';
        quoteContainer.appendChild(previousQuoteButton);
        previousQuoteButton.addEventListener('click', previousQuote);

        quoteElement = document.createElement('p');
        quoteElement.className = "quote"
        quoteElement.innerHTML = questions[questionIndex].choices[i].quotes[0];
        quoteContainer.appendChild(quoteElement);

        nextQuoteButton = document.createElement('button');
        nextQuoteButton.innerHTML = ">";
        nextQuoteButton.className = 'next-quote-btn';
        quoteContainer.appendChild(nextQuoteButton);
        nextQuoteButton.addEventListener('click', nextQuote);

        choiceNode.appendChild(quoteContainer)

        choicesContainer.appendChild(choiceNode);
    }
}

function changeQuote(event, number) {
    element = event.target;
    index = element.parentNode.parentNode.id;
    visibleChoicesList[index].index += number;

    if(visibleChoicesList[index].index > questions[questionIndex].choices[index].quotes.length - 1) {
        visibleChoicesList[index].index = 0;
    } else if (visibleChoicesList[index].index < 0) {
        visibleChoicesList[index].index = questions[questionIndex].choices[index].quotes.length - 1;
    }

    element.parentNode.querySelectorAll("p")[0].innerHTML = questions[questionIndex].choices[index].quotes[visibleChoicesList[index].index];
}

function nextQuote(event) {
    changeQuote(event, 1)
}

function previousQuote(event) {
    changeQuote(event, -1);
}

function removeOldChoices() {
    visibleChoicesList.length = 0;
    oldChoices = document.querySelectorAll(".choice");
    for(i = 0; i < oldChoices.length; i++) {
        oldChoices[i].parentNode.removeChild(oldChoices[i]);
    }
}

renderQuestion();
removeOldChoices();
renderChoices();

var nextQuestionButton = document.getElementById("next-question-btn");
nextQuestionButton.hidden = true;

nextQuestionButton.addEventListener('click', nextQuestion);

function nextQuestion() {
    pushChoicesToList();
    madeChoices.length = 0;
    questionIndex = questionIndex + 1;
    renderQuestion();
    removeOldChoices();
    renderChoices();
    nextQuestionButton.hidden = true;
}

var madeChoices = new Array();

function makeChoice(event) {
    element = event.target;
    choiceIndex = element.parentNode.id;
    quoteIndex = visibleChoicesList[choiceIndex].index;
    if (madeChoices.length < 3 && element.parentNode.querySelectorAll(".rank").length < 1){
        madeChoices.push({choice: questions[questionIndex].choices[choiceIndex].choiceText, quote: questions[questionIndex].choices[choiceIndex].quotes[quoteIndex]});
        var rank = document.createElement("h1");
        rank.className = "rank";
        rank.innerHTML = madeChoices.length;
        element.parentNode.appendChild(rank);
        event.target.parentNode.querySelectorAll(".quotes-container")[0].innerHTML = questions[questionIndex].choices[choiceIndex].quotes[quoteIndex];
        event.target.parentNode.querySelectorAll(".quotes-container")[0].className = "quote";

        if(madeChoices.length === 3 && questionIndex != questions.length - 1) {
            nextQuestionButton.hidden = false;
        } else if (madeChoices.length === 3 && questionIndex === questions.length - 1) {
            doneButton.hidden = false;
        }
    }
}

function printChoices() {
    let printText = new Array();
    printText.push(studentName + "\n");
    for (i = 0; i < allChoicesAndQuotes.length; i++) {
        printText.push(`Vraag ${i+1} - ${questions[i].question}\n`);
        console.log(`Vraag ${i+1} - ${questions[i].question}`)
        for (u = 0; u < 3; u++) {
            console.log(`${u+1}. ${allChoicesAndQuotes[i][u].choice}: ${allChoicesAndQuotes[i][u].quote}`);
            printText.push(`${u+1}. ${allChoicesAndQuotes[i][u].choice}: ${allChoicesAndQuotes[i][u].quote}\n`);
        }
    }
    return printText;
}

var refreshButton = document.getElementById("refresh");
refreshButton.addEventListener("click", deleteMadeChoices);

function deleteMadeChoices() {
    madeChoices.length = 0;
    removeOldChoices();
    renderChoices();
    nextQuestionButton.hidden = true;
}

let allChoicesAndQuotes = new Array(); // Alle gekozen antwoorden samen

function pushChoicesToList() {
    choices = new Array();
    for (i = 0; i < 3; i++){
        choices.push(madeChoices[i]);
    }
    allChoicesAndQuotes.push(choices);
}

var doneButton = document.getElementById("done-btn");

doneButton.addEventListener("click", done);

const studentName = localStorage.getItem("name");
localStorage.clear();

function done() {
    pushChoicesToList();
    array = printChoices();
    blob = new Blob(array, {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${studentName}WijsheidsQuiz.txt`);
}


