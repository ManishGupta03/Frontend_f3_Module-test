let address=document.getElementById("ip-address");
let container=document.getElementById("container");
let getData=document.getElementById("get-data");
let cardsContainer=document.querySelector(".cardscontainer");


let IP;
function getUserIP() {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        IP=data.IP;
        document.getElementById('ip-address').textContent = data.ip;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  getUserIP();

  async function fetching(IP)
{
    try{
        let response=await fetch(`https://ipinfo.io/${IP}/geo/json?token=6ec335e9ea2c05`);
    let data= await response.json();
    console.log(data);
    localStorage.setItem('pincode',JSON.stringify(data.postal));
    appendUser(data);
    }catch(err)
    {
        alert("Unable to fetch Geolocation");
    }
    
}
fetching(IP);
function appendUser(arr){
    let datetime_str = new Date().toLocaleString("en-US", { timeZone: arr.timeZone });

    
    let latLong=arr.loc.split(",");

        let innerCard=` <div class="det">
        <p>Lat:${latLong[0]}</p>
        <p>city:${arr.city}</p>
        <p>Organization:${arr.org}</p>
        </div>
        <div class="det">
        <p>Long:${latLong[1]}</p>
        <p>Region:${arr.region}</p>
        <p>HostName:dns.google.com</p>
        </div>
        <iframe src="https://maps.google.com/maps?q=${latLong[0]}, ${latLong[1]}&output=embed" width="100%" height="300" frameborder="0" style="border:0"></iframe>
        <p>Time Zone:${arr.timezone}</p>
        <p>Date And Time:${datetime_str}</p>
        <p>Pincode:${arr.postal}</p>
        <p>Message:<span id="numberOfpost"></span></p>
        <input type="text" placeholder="Filter" id="searchBar" oninput="Filter()">`;
        let generalInfo=document.createElement("div");
        generalInfo.className="genralInfo";
        generalInfo.innerHTML=innerCard;
        container.append(generalInfo);
}
async function postalFetching()
{

    let pin=JSON.parse(localStorage.getItem('pincode'));
    try{
        let response= await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    let data= await response.json(); 
    console.log(data);
    postalAppend(data);
    }catch(error)
    {
        alert("Unable to fetch Postoffice");
    }
    
}
postalFetching();
let postofficeArray=[];
 function postalAppend(data){
    let numberofPostOffice=document.getElementById("numberOfpost");
    numberofPostOffice.innerText=data[0].Message;
    postofficeArray=data[0].PostOffice;
    appendItem(data[0].PostOffice);
 }
 function appendItem(arr)
 {
    cardsContainer.innerHTML="";
    for(let i=0;i<arr.length;i++)
    {
        let temp=arr[i];
        let innerCard=`
         <div id="name">Name:${temp.Name}</div>
         <div id="BT">Branch Type:${temp.BranchType}</div>
         <div id="DS">Delivery Staus:${temp.DeliveryStatus}</div>
         <div id="district">District:${temp.District}</div>
         <div id="division">Division:${temp.Division}</div>`; 
     let cardContainer=document.createElement("div");
     cardContainer.className="cardcontainer";
     cardContainer.innerHTML=innerCard;
    cardsContainer.append(cardContainer);
    }
    container.append(cardsContainer);      
 }
 function Filter()
 {
    let tempArr=[];
    let input=event.target.value;
    for(let i=0;i<postofficeArray.length;i++)
    {
        if(postofficeArray[i].Name.includes(input.charAt(0).toUpperCase()+input.slice(1)) || postofficeArray[i].BranchType.includes(input.charAt(0).toUpperCase()+input.slice(1))||postofficeArray[i].District.includes(input.charAt(0).toUpperCase()+input.slice(1))|| postofficeArray[i].Division.includes(input.charAt(0).toUpperCase()+input.slice(1)))
        {
         tempArr.push(postofficeArray[i]);
        }
    }
    if(tempArr.length!=0)
    {
        appendItem(tempArr);
    }

 }
 Filter();
 