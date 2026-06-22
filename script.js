const allQuestions=[
{cat:"national",q:"भारत का केंद्रीय बैंक कौन है?",o:["SBI","RBI","SEBI","NABARD"],a:1,e:"RBI भारत का central bank है।"},
{cat:"economy",q:"SEBI किस क्षेत्र को regulate करता है?",o:["Stock Market","Railway","School","Weather"],a:0,e:"SEBI securities market regulator है।"},
{cat:"sports",q:"Olympics कितने साल में एक बार होते हैं?",o:["2 साल","3 साल","4 साल","5 साल"],a:2,e:"Summer Olympics normally 4 साल में होते हैं।"},
{cat:"exam",q:"Mock Test का main benefit क्या है?",o:["Speed और accuracy","Time waste","Marks कम","No benefit"],a:0,e:"Mock test speed, accuracy और confidence बढ़ाता है।"},
{cat:"national",q:"भारत का संविधान दिवस कब मनाया जाता है?",o:["26 Jan","15 Aug","26 Nov","2 Oct"],a:2,e:"Constitution Day 26 November को मनाया जाता है।"},
{cat:"economy",q:"Budget आमतौर पर किससे जुड़ा होता है?",o:["Income-Expenditure plan","Weather","Sports","Movie"],a:0,e:"Budget income और expenditure का plan है।"},
{cat:"sports",q:"Cricket में ODI match कितने overs का होता है?",o:["20","50","90","10"],a:1,e:"ODI generally 50 overs per side होता है।"},
{cat:"exam",q:"Current Affairs याद रखने का best तरीका?",o:["Daily revision","Only guess","No notes","Skip"],a:0,e:"Daily revision सबसे useful है।"},
{cat:"national",q:"लोकसभा सदस्य का कार्यकाल सामान्यतः कितना होता है?",o:["3 साल","4 साल","5 साल","6 साल"],a:2,e:"Lok Sabha normal term 5 years है।"},
{cat:"economy",q:"GDP का full form क्या है?",o:["Gross Domestic Product","General Data Plan","Govt Digital Policy","None"],a:0,e:"GDP means Gross Domestic Product."},
{cat:"sports",q:"FIFA किस sport से जुड़ा है?",o:["Football","Cricket","Kabaddi","Hockey"],a:0,e:"FIFA football की world body है।"},
{cat:"exam",q:"Negative marking में क्या जरूरी है?",o:["Blind guess","Accuracy","Fast skip all","No reading"],a:1,e:"Negative marking में accuracy बहुत जरूरी है।"},
{cat:"national",q:"राज्यसभा एक ___ सदन है।",o:["स्थायी","अस्थायी","ग्राम","स्कूल"],a:0,e:"Rajya Sabha is a permanent house."},
{cat:"economy",q:"Inflation का मतलब क्या है?",o:["Price rise","Price zero","Only tax","Only saving"],a:0,e:"Inflation means सामान्य कीमतों में वृद्धि।"},
{cat:"exam",q:"Lage Raho website का founder कौन है?",o:["Rahul","Pawan Kumar","Aman","Neha"],a:1,e:"Founder name Pawan Kumar है।"}
];

let questions=[],current=0,score=0,locked=false,totalTime=600,timerInt=null;
let leaders=[{name:"Priya",score:142},{name:"Rahul",score:135},{name:"Aman",score:124},{name:"Neha",score:116}];

const $=id=>document.getElementById(id);
$("nextBtn").style.display="none";

let isRegisterMode=false;
let loggedUser = JSON.parse(localStorage.getItem("lageRahoLoggedUser") || "null");

function toggleAuth(){
  isRegisterMode = !isRegisterMode;
  $("authTitle").textContent = isRegisterMode ? "Student Register" : "Student Login";
  $("authBtn").textContent = isRegisterMode ? "Register" : "Login";
  $("switchBtn").textContent = isRegisterMode ? "Already registered? Login" : "New user? Register";
}

function loginUser(){
  const name=$("authName").value.trim();
  const email=$("authEmail").value.trim();
  const pass=$("authPassword").value.trim();
  if(!name || !email || !pass){ alert("Name, Email/Mobile aur Password भरें"); return; }

  const users=JSON.parse(localStorage.getItem("lageRahoUsers") || "[]");

  if(isRegisterMode){
    if(users.some(u=>u.email===email)){ alert("Ye email/mobile already registered hai."); return; }
    users.push({name,email,password:pass});
    localStorage.setItem("lageRahoUsers", JSON.stringify(users));
    alert("Register successful! Ab login ho gaya.");
    loggedUser={name,email};
    localStorage.setItem("lageRahoLoggedUser", JSON.stringify(loggedUser));
    updateAuthUI();
    return;
  }

  const found=users.find(u=>u.email===email && u.password===pass);
  if(!found){
    alert("Account nahi mila. Pehle Register karo ya password check karo.");
    return;
  }
  loggedUser={name:found.name,email:found.email};
  localStorage.setItem("lageRahoLoggedUser", JSON.stringify(loggedUser));
  updateAuthUI();
}

function logoutUser(){
  localStorage.removeItem("lageRahoLoggedUser");
  loggedUser=null;
  updateAuthUI();
}

function updateAuthUI(){
  if(loggedUser){
    $("authBox").classList.add("hidden");
    $("profileBox").classList.remove("hidden");
    $("profileName").textContent=loggedUser.name;
  } else {
    $("authBox").classList.remove("hidden");
    $("profileBox").classList.add("hidden");
  }
}

function startQuiz(){
  if(!loggedUser){ alert("Pehle login/register karo."); return; }
  const cat=$("category").value;
  questions = cat==="all" ? [...allQuestions] : allQuestions.filter(q=>q.cat===cat);
  current=0; score=0; locked=false; totalTime=600;
  $("resultBox").classList.add("hidden");
  $("questionBox").classList.remove("hidden");
  $("dashScore").textContent=0; $("dashRank").textContent="--";
  clearInterval(timerInt);
  timerInt=setInterval(tick,1000);
  loadQuestion();
}

function loadQuestion(){
  locked=false; $("feedback").textContent=""; $("nextBtn").style.display="none";
  const item=questions[current];
  $("quizTitle").textContent = `${$("category").selectedOptions[0].text} Quiz`;
  $("qCount").textContent=`Question ${current+1}/${questions.length}`;
  $("question").textContent=item.q;
  $("progress").style.width=`${(current/questions.length)*100}%`;
  $("options").innerHTML="";
  item.o.forEach((op,i)=>{
    const b=document.createElement("button");
    b.className="option"; b.textContent=op; b.onclick=()=>check(i,b);
    $("options").appendChild(b);
  });
}

function check(i,btn){
  if(locked)return; locked=true;
  const item=questions[current];
  const buttons=document.querySelectorAll(".option");
  buttons[item.a].classList.add("correct");
  if(i===item.a){ score+=10; $("feedback").textContent=`✅ Correct! ${item.e}`; }
  else{ btn.classList.add("wrong"); $("feedback").textContent=`❌ Wrong! ${item.e}`; }
  $("dashScore").textContent=score;
  $("nextBtn").style.display="block";
}

function nextQuestion(){
  current++;
  if(current<questions.length) loadQuestion(); else showResult();
}

function showResult(){
  clearInterval(timerInt);
  $("questionBox").classList.add("hidden");
  $("resultBox").classList.remove("hidden");
  $("progress").style.width="100%";
  const name=(loggedUser && loggedUser.name) ? loggedUser.name : "Student";
  $("resultName").textContent=`Student: ${name}`;
  $("finalScore").textContent=score;
  let max=questions.length*10;
  leaders=leaders.filter(x=>x.name!==name);
  leaders.push({name,score});
  leaders.sort((a,b)=>b.score-a.score);
  const rank=leaders.findIndex(x=>x.name===name)+1;
  $("dashRank").textContent="#"+rank;
  $("finalRank").textContent=`Your Rank: #${rank}`;
  $("performanceText").textContent = score>=max*0.8 ? "Excellent performance! Lage Raho 🔥" : score>=max*0.5 ? "Good! Daily revision se rank improve hogi." : "Practice continue rakho. Lage Raho!";
  renderLeaderboard();
}

function renderLeaderboard(){
  $("leaderboard").innerHTML="";
  leaders.forEach((l,i)=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>#${i+1}</td><td>${l.name}</td><td>${l.score}</td>`;
    $("leaderboard").appendChild(tr);
  });
}

function tick(){
  totalTime--;
  if(totalTime<=0){showResult();return;}
  const m=String(Math.floor(totalTime/60)).padStart(2,"0");
  const s=String(totalTime%60).padStart(2,"0");
  $("timer").textContent=`${m}:${s}`;
  $("dashTime").textContent=`${m}:${s}`;
}

function restartQuiz(){ startQuiz(); }

function downloadCertificate(){
  const name=(loggedUser && loggedUser.name) ? loggedUser.name : "Student";
  const cert=`LAGE RAHO CERTIFICATE\n\nThis certificate is awarded to ${name}\nFor completing Current Affairs Quiz\nScore: ${score}\nFounder: Pawan Kumar\n\nDisclaimer: For study purpose only.`;
  const blob=new Blob([cert],{type:"text/plain"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=`Lage-Raho-Certificate-${name}.txt`;
  a.click();
}

$("themeBtn").onclick=()=>document.body.classList.toggle("light");
updateAuthUI();
renderLeaderboard();
