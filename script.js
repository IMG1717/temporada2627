fetch('data.json').then(r=>r.json()).then(data=>{
const equipos={};
data.forEach(j=>{
if(!equipos[j.equipo]) equipos[j.equipo]=[];
equipos[j.equipo].push(j);
});
const div=document.getElementById('equipos');
for(let e in equipos){
let h=`<details><summary>${e}</summary>`;
equipos[e].forEach(j=>{
h+=`<p>${j.dorsal} - ${j.jugador}<br><input type='checkbox'> Correcto<br><input placeholder='Error'></p>`;
});
h+='</details>';
div.innerHTML+=h;
}
});