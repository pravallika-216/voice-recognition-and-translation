

let recognition;
let speechText = "";

const speechOutput = document.getElementById("speechOutput");
const translatedText = document.getElementById("translatedText");

const languageMap = {
en:"en-US",
te:"te-IN",
hi:"hi-IN",
ta:"ta-IN",
kn:"kn-IN",
ml:"ml-IN",
bn:"bn-IN",
mr:"mr-IN",
gu:"gu-IN",
pa:"pa-IN",
ur:"ur-IN",
fr:"fr-FR",
de:"de-DE",
ja:"ja-JP",
ko:"ko-KR",
es:"es-ES"
};

function startListening(){

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(!SpeechRecognition){
alert("Speech Recognition not supported in this browser.");
return;
}

recognition = new SpeechRecognition();

const inputLang = document.getElementById("inputLang").value;

recognition.lang = inputLang === "auto" ? "en-US" : inputLang;

recognition.continuous = false;
recognition.interimResults = false;

document.getElementById("micAnimation").style.display = "flex";

recognition.start();

recognition.onresult = (event)=>{
speechText = event.results[0][0].transcript;
speechOutput.value = speechText;

handleVoiceCommands(speechText);

document.getElementById("micAnimation").style.display = "none";
};

recognition.onerror = (event)=>{
alert("Error : " + event.error);
document.getElementById("micAnimation").style.display = "none";
};

recognition.onend = ()=>{
document.getElementById("micAnimation").style.display = "none";
};

}

async function translateText(){

if(!speechOutput.value.trim()){
alert("Please speak or type something.");
return;
}

const targetLang = document.getElementById("targetLang").value;

const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(speechOutput.value)}`;

try{

const response = await fetch(url);

const data = await response.json();

const translated = data[0].map(item=>item[0]).join("");

translatedText.value = translated;

speakTranslatedText(translated,targetLang);

saveHistory(speechOutput.value,translated);

}catch(error){

alert("Translation failed.");

}

}

function speakTranslatedText(text,lang){

speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(text);

utterance.lang = languageMap[lang] || "en-US";

utterance.rate = document.getElementById("speed").value;

utterance.pitch = document.getElementById("pitch").value;

speechSynthesis.speak(utterance);

}

function stopSpeaking(){
speechSynthesis.cancel();
}

function copyText(){

navigator.clipboard.writeText(translatedText.value);

alert("Copied!");

}

function clearAll(){

speechOutput.value = "";
translatedText.value = "";

}

function toggleTheme(){

document.body.classList.toggle("light");

localStorage.setItem("theme",
document.body.classList.contains("light") ? "light" : "dark"
);

}

if(localStorage.getItem("theme")==="light"){
document.body.classList.add("light");
}

function swapLanguages(){

const input = document.getElementById("inputLang");
const target = document.getElementById("targetLang");

const temp = input.value;
input.value = languageMap[target.value] || "en-US";

const reverse = temp.split("-")[0];
target.value = reverse;

}

function saveHistory(original,translated){

const historyDiv = document.getElementById("history");

const item = document.createElement("div");

item.className = "history-item";

item.innerHTML = `
<b>Original:</b> ${original}<br>
<b>Translated:</b> ${translated}
`;

historyDiv.prepend(item);

}

function downloadText(){

const text = translatedText.value;

const blob = new Blob([text],{type:"text/plain"});

const a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = "translation.txt";

a.click();

}

function handleVoiceCommands(command){

const text = command.toLowerCase();

if(text.includes("dark mode")){
document.body.classList.add("light");
}

if(text.includes("clear text")){
clearAll();
}

}

