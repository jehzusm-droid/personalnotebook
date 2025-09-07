// ======= Storage helpers =======
if(!confirm('Tem certeza que deseja apagar TUDO?')) return
localStorage.removeItem('pn_tasks')
localStorage.removeItem('pn_settings')
localStorage.removeItem('pn_last')
state.tasks=[]
state.settings={wake:'',sleep:'',waterEvery:60,exerciseEvery:8,meals:'07:30, 12:00, 19:30'}
state.last={water:Date.now(),exercise:Date.now()}
loadSettingsToUI(); renderTasks();
})


// ======= Habits logic =======
function minutesSince(ts){ return (Date.now()-ts)/60000 }
function renderStatus(){
const s = state.settings
els.statusBar.innerHTML = ''
const addPill = (label)=>{
const el=document.createElement('div'); el.className='pill'; el.textContent=label; els.statusBar.appendChild(el)
}
if(s.wake) addPill('Acordar: '+s.wake)
if(s.sleep) addPill('Dormir: '+s.sleep)
addPill('Água: a cada '+s.waterEvery+' min')
addPill('Exercício: a cada '+s.exerciseEvery+' h')
if(s.meals?.trim()) addPill('Refeições: '+s.meals)
}


function habitsTick(){
const s = state.settings
if(minutesSince(state.last.water) >= s.waterEvery){
toast('💧 Hora de hidratar-se!')
state.last.water = Date.now(); storage.set('pn_last', state.last)
}
if(minutesSince(state.last.exercise) >= (s.exerciseEvery*60)){
toast('🏃‍♂️ Pequena pausa para alongar/exercitar!')
state.last.exercise = Date.now(); storage.set('pn_last', state.last)
}
const now = new Date()
const nowHM = pad(now.getHours())+':'+pad(now.getMinutes())
const meals = (s.meals||'').split(',').map(x=>x.trim()).filter(Boolean)
for(const m of meals){ if(m === nowHM){ toast('🍽️ Hora da refeição ('+m+')') } }
}


// ======= Toast (alerta visual) =======
let toastTimer
function toast(msg){
const bar = document.createElement('div')
bar.className='alert show'
bar.textContent = msg
const host = document.querySelector('section.card')
host.insertBefore(bar, host.children[1])
clearTimeout(toastTimer)
toastTimer = setTimeout(()=>bar.remove(), 4500)
}


// ======= Task proximity tick =======
function tasksTick(){ renderTasks() }


// ======= Init =======
function init(){
loadSettingsToUI()
renderTasks()
setInterval(habitsTick, 60*1000) // hábitos a cada minuto
setInterval(tasksTick, 30*1000) // atualizar estados das tarefas
habitsTick(); tasksTick()
}


init()
