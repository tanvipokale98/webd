async function submit(location=null){
    const search=location || document.getElementById("search").value;
const apikey="Your_APi_Key";
let url=`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${search}&days=6`;
const options = {
	method: 'GET'
};
document.getElementById("loading").classList.remove("hidden");
try{
    const response=await fetch(url,options);
    const results=await response.json();
    console.log(results);
    let date=new Date();
    let d=date.getDate();
    let m=date.toLocaleString('default', { month: 'long' });
    document.getElementById("Temp").innerHTML=results.current.temp_c+"`C";
    document.getElementById("date").innerHTML=d+" "+m;
    document.getElementById("loca").innerHTML= location || results.location.name+", "+results.location.region;
    document.getElementById("weather").innerHTML=results.current.condition.text;
    document.getElementById("Humidity").innerHTML="Humidity:"+results.current.humidity;
    document.getElementById("Visibility").innerHTML="Visibility:"+results.current.vis_km+"km";
    document.getElementById("pressure").innerHTML="Pressure:"+results.current.pressure_mb+"mb";
    document.getElementById("uv_index").innerHTML="UV Index:"+results.current.uv;
    document.getElementById("currimg").src=`/public/img/animated/`+results.current.condition.code+".svg";
    
    for(let i=1;i<=5;i++){
        document.getElementById(`${i}date`).innerHTML=results.forecast.forecastday[i].date;
        document.getElementById(`${i}temp`).innerHTML=results.forecast.forecastday[i].day.avgtemp_c+"`C";
        document.getElementById(`${i}weather`).innerHTML=results.forecast.forecastday[i].day.condition.text;
        document.getElementById(`${i}img`).src=`/public/img/animated/`+results.forecast.forecastday[i].day.condition.code+".svg";
    }
    document.getElementById("loading").classList.add("hidden");
}
catch(e){
    console.log(e);
    document.getElementById("loading").classList.add("hidden");
}
}

window.onload = () => {
    submit("Pune");
};