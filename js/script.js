console.log("Entrei");


let githubList = [];

let sortedList = [];

let languagesList = [];

let isListCharged = false;

let repos = document.getElementById('github')

let calendarEl = document.getElementById('calendar');
let events = [];

const sort_by = (field, reverse, primer) => {
  const key = primer
    ? function (x) {
        return primer(x[field])
      }
    : function (x) {
        return x[field]
      }

  reverse = !reverse ? 1 : -1

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a))
  }
}


const carregarGithubList = async () => {  
  let github = []
  for (let index = 1; index < 100; index++) {
    let githubs = await fetch(`https://api.github.com/users/alissonrangel/repos?page=${index}`).then(res => res.json())    
    console.log('Aqui:,', index)
    if (githubs.length > 0) {
      github = [...github,...githubs]
    } else {
      break;
    }
  }

  let githubs = [...github]

  githubs = githubs.filter((item) => item.fork === false);

  sortedList = await githubs.sort(sort_by('pushed_at', true, (a) => a.toLowerCase()))

  events = await sortedList.map((item) => { 
    return  { 
        title: `${item.name.length > 10 ? item.name.substring(0,15) : item.name}`,
        start: `${item.pushed_at.substring(0,10)}`,
        color: '#284b63',
        url: `${item.html_url}`
      }
    }
  );

  calendar();
  
  githubList = await [...sortedList]
 
}

function calendar() {  
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    events: events
  });
  calendar.render();
}

const languagesListFunction = () => {
  let languages = []
  for (const item of githubList) {
    if (item.language === 'Hack'){
      console.log("hack, ", item);   
    }
    if (languages.includes(item.language)) {
      
    } else {
      languages.push(item.language)
    }
  }
  return languages
}

const getGithubReposJavascript = async(lang) => {

  if (isListCharged){

  } else {

    let select = document.getElementById('select')

    console.log("Aqui papai");

    select.innerHTML = ''

    await carregarGithubList()
    languagesList = languagesListFunction()
    let options = '<option selected="false">Select a language</option>'
    options += '<option>todos</option>'

    for (const item of languagesList) {  
      console.log('aquuu, ', item);          
      options += `<option>${item}</option>`
    }    
    select.innerHTML = options

    isListCharged = true
  }  

  // let githubs1 = await fetch('https://api.github.com/users/alissonrangel/repos?page=1').then(res => res.json())

  // let githubs2 = await fetch('https://api.github.com/users/alissonrangel/repos?page=2').then(res => res.json())

  // let githubs3 = await fetch('https://api.github.com/users/alissonrangel/repos?page=3').then(res => res.json())

  // let githubs4 = await fetch('https://api.github.com/users/alissonrangel/repos?page=4').then(res => res.json())

  // let githubs = [...githubs1, ...githubs2, ...githubs3, ...githubs4]

  // let sortedList = await githubs.sort(sort_by('pushed_at', true, (a) => a.toLowerCase()))
  
  // githubList = await [...sortedList]

  if (lang !== 'todos') {
    sortedList = githubList.filter((item) => item.language === lang)                            
  } else {
    sortedList = githubList
  }
  
  console.log('Repos: ', sortedList) 

  let child = ''
  for (const item of sortedList) {
    child += `<a href="${item.html_url}" target="_blank" class="github-item"><h4>Name: ${item.name}</h4><h4>Pushed at: ${item.pushed_at}</h4><h4>Created at: ${item.created_at}</h4><h4><p>Description: ${item.description}</p><h4>Language: ${item.language}</h4></a>`
  }
  
  //repos.appendChild(child)
  repos.innerHTML = child  
  

  //let opt = document.createElement("option");
  //opt.innerHTML = "todos";
  //select.appendChild(opt);
}

getGithubReposJavascript('todos')
