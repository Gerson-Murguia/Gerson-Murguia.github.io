//1 Search

document.querySelector(".search").addEventListener("click",()=>{
  let input=document.querySelector(".js-search").value;
  var resultado=document.querySelector(".js-search-results");
  resultado.innerHTML="";
  soundCloudAPI.getPista(input);
});
document.querySelector(".btnLimpiar").addEventListener("click",()=>{
  var resultado=document.querySelector(".js-playlist");
  resultado.innerHTML="";
});
document.querySelector(".js-search").addEventListener("keydown",(evt)=>{
  if (evt.which==13) {
    let input=document.querySelector(".js-search").value;
    var resultado=document.querySelector(".js-search-results");
    //borrar las pista ya renderizadas si es que hay
    resultado.innerHTML="";
    soundCloudAPI.getPista(input);  
  }
});
//2 query souncloud api

  var soundCloudAPI={};
  soundCloudAPI.init=()=> {
    SC.initialize({
      client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });    
  };
  soundCloudAPI.init();

  soundCloudAPI.getPista=inputValue=> {
      SC.get('/tracks', {
      q: inputValue
    }).then(function(tracks) {
       console.log(tracks);
        soundCloudAPI.renderTracks(tracks);
    });  
  };
  //3 Display the cards
  soundCloudAPI.renderTracks=(tracks)=>{
      var fragmento=new DocumentFragment();
      
      tracks.forEach(pista => {
        //card
        let card=document.createElement('div');
        card.classList.add("card");
        //image
        let image=document.createElement('div');
        image.classList.add("image");
        let image_img=document.createElement('img');
        image_img.classList.add('image_img');
        //content
        let content=document.createElement('div');
        content.classList.add("content");
        let add=document.createElement('div');
        add.classList.add('ui','bottom', 'attached', 'button', 'js-button');
        
        let header=document.createElement('div');
        header.classList.add('header');
        let a=document.createElement('a');
        
       
        //el href y el innerHTML se cambiara dinamico
        let add_icon=document.createElement('i');
        add_icon.classList.add('add','icon');
        let span=document.createElement('span');
        let lrgcaratula=pista.artwork_url;
        if (lrgcaratula!==null) {
           lrgcaratula=lrgcaratula.replace('large.jpg','crop.jpg');
           image_img.src=lrgcaratula;
        }
        else{
          image_img.src="http://lorempixel.com/290/290/nightlife";
        }
         //caratula en mejor calidad y agrwgar datos
       
        span.innerHTML="Add to playlist";
        a.innerHTML=pista.title;
        a.href=pista.permalink_url;
        a.target="_blank";
        //reproducir la cancion con auto playlist
        add.addEventListener('click',()=>{
          soundCloudAPI.getEmbed(pista.permalink_url);
        });
        card.appendChild(image);
        card.appendChild(content);
        card.appendChild(add);
        image.appendChild(image_img);
        content.appendChild(header);
        add.appendChild(add_icon);
        add.appendChild(span);
        header.appendChild(a);
        fragmento.appendChild(card);
      });
        var resultado=document.querySelector(".js-search-results");
        resultado.appendChild(fragmento);
  };


soundCloudAPI.getEmbed=(cancionURL)=>{
SC.oEmbed(cancionURL, {
  auto_play: true
}).then(function(embed){
  console.log('oEmbed response: ', embed);
  let sideBar=document.querySelector(".js-playlist");
  sideBar.insertAdjacentHTML("afterbegin",embed.html);
});
}

//Add to playlist and play