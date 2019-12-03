'use strict';
//axios helps to send a API request to openweathermap API and get info for a city
const axios = require("axios");
const apiKey="5e3c4a05e6db9436d1ae340d69fdb46e";


/// show the available  genre list

module.exports.getGenreList = async (event) => {
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"genre/movie/list?language=en-US&api_key="+apiKey;
  var genreName="";
  try {
    const response = await axios.get(url);
    const data=response.data;
    for (var i=0;i<data.genres.length;i++){
      var genreName=genreName+(i+1)+" ."+data.genres[i].name+";";
    }
  
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":  genreName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/// show the movies with genre type

module.exports.getMoviesByGenre = async (event) => {

  const keyword= event.currentIntent.slots["genre"];
  //const keyword= "Action";
  const genreName=keyword.toLowerCase();
  console.log(genreName);
  const baseURL="https://api.themoviedb.org/3/";
  const genreUrl = baseURL+"genre/movie/list?api_key="+apiKey+"&language=en-US";
  var movieName="";
  try {
    const response = await axios.get(genreUrl);
    const data=response.data;

    if (data.genres.length <= 0){
      answer = answer + "No genre with name " + keyword + " found. Please make sure you type the name correctly."
    }
    
    for (var i=0;i<data.genres.length;i++){
      if(data.genres[i].name.toLowerCase() == genreName){
        
        var genreId=data.genres[i].id;
      }
    }
   console.log(genreId)
   const movieUrl="https://api.themoviedb.org/3/discover/movie?with_genres="+genreId+"&api_key="+apiKey+"&sort_by=popularity.desc";
   const newResponse = await axios.get(movieUrl);
   const newData=newResponse.data;

    if (newData.results.length <= 0){
      answer = answer + "No genre with name " + keyword + " found. Please make sure you type the name correctly."
    }

    for (var i=0;i<5;i++){  
        var randomIndex=Math.floor((Math.random() * newData.results.length) + 0);
        var movieName= movieName+(i+1)+ " . "+ newData.results[randomIndex].original_title + " ,  Release Date : "+newData.results[i].release_date + " ; ";
       
    }
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":  movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the latest playing movie

module.exports.getLatestMovies = async (event) => {

  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/now_playing?page=1&language=en-US&api_key="+apiKey+"&language=en-US&sort_by=popularity.desc";
  var movieName="";

  try {
  
    const response = await axios.get(url);
    const data=response.data;
    if (data.results.length <= 0){
      answer = answer + "No movies found sorry";
    }
    else {
    for (var i=0;i<5;i++){
     
      var randomIndex=Math.floor((Math.random() * data.results.length) + 0);
      var movieName= movieName+ (i+1)+" . "+ data.results[randomIndex].original_title + " ,  Release Date : "+data.results[i].release_date + " ; ";
  
    }
  }
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


/// show the list of upcoming  movies

module.exports.getUpcomingMovies = async (event) => {

  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"movie/upcoming?api_key="+apiKey+"&language=en-US&page=1&sort_by=popularity.desc";
  var movieName="";
  var today = new Date();
  var currentDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var data_final = [];
  try {
    const response = await axios.get(url);
    const data=response.data;
    if (data.results.length <= 0){
      answer = answer + "No movies found sorry";
    }
    
    else{
    for (var i=0;i<data.results.length;i++){
      if (currentDate<=data.results[i].release_date ){
       
          data_final.push(data.results[i]);
       
      }  
    }
    for (var i=0;i<data_final.length;i++){
       var randomIndex=Math.floor((Math.random() * data_final.length) + 0);
        var movieName= movieName+ (i+1)+" . "+ data_final[randomIndex].original_title + " ,  Release Date : "+data_final[i].release_date + " ; ";    
      }
    }
  
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};



/// show the list of  movies that came in year  "X"

module.exports.getMoviesByYear = async (event) => {
  
  const yearInput= event.currentIntent.slots["Year"];
  console.log(yearInput)
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"discover/movie?primary_release_year="+yearInput+"&sort_by=vote_average.desc&api_key="+apiKey ;
  var movieName="";
  var flag=0;
  try {
    const response = await axios.get(url);
    const data=response.data;
    if (data.results.length <= 0){
      answer = answer + "No movies found sorry";
    }
    else {
    for (var i=0;i<data.results.length;i++){
      var year=data.results[i].release_date.substring(0, 4);
      if (year ==yearInput){
         flag=1;
         var movieName= movieName + "Name :" + data.results[i].original_title + " , Release Date : " +data.results[i].release_date +"  ;  "
    }
  }
}
  if (flag==0){
    var movieName= "Sorry I couldn't find any";
  }
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState":  "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// get kids movies
module.exports.getKidsMovies = async (event) => {
  
  const yearInput= event.currentIntent.slots["kids"];
  console.log(yearInput)
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&api_key="+apiKey ;
  var movieName="";
  var flag=0;
  try {
    const response = await axios.get(url);
    const data=response.data;
    if (data.results.length <= 0){
      answer = answer + "No movies found sorry";
    }
    else {
    for (var i=0;i<5;i++){
      
      var randomIndex=Math.floor((Math.random() * data.results.length) + 0);
      var movieName= movieName+(i+1)+ " . "+ data.results[randomIndex].original_title + " ,  Release Date : "+data.results[i].release_date + " ; ";
  
    }
  }
  
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState":  "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   movieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Show similar movies

module.exports.getSimilarMovies = async (event) => {
  const name = event.currentIntent.slots["nameMovie"];
  const baseURL="https://api.themoviedb.org/3/";
  //const name = "terminator";
  const popular = baseURL+"search/movie?api_key="+apiKey+"&query="+name+"&sort_by=release_date.desc";
 
  var movieNames="";
  try {
    const response = await axios.get(popular);
    const data = response.data;
    
    if (data.results[0].original_title.toLowerCase().includes(name.toLowerCase()))
    {
      var id=data.results[0].id;
    }
    
    console.log(id);
    const similar = baseURL+"movie/"+id+"/similar?api_key="+apiKey+"&language=en-US&page=1";
    
    const newResponse = await axios.get(similar);
    const newData = newResponse.data;
    for (var i=0;i<5;i++){
      var randomIndex=Math.floor((Math.random() * newData.results.length) + 0);
     movieNames = movieNames+(i+1)+" . "+newData.results[randomIndex].title+" ; ";
    }
   
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": movieNames
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// show movies by actor
module.exports.getActor= async (event) => {
  const keyword = event.currentIntent.slots["Actor"];
  const yearInput = event.currentIntent.slots["actorYear"];
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key="+apiKey+"&query=" + keyword;
  var answer = "";

  try {
    const response = await axios.get(url);
    const data=response.data;

    /**
     * Filter actors
     */
    var data_final = [];
    var flag=0;
    for(var i=0;i<data.results.length;i++){
      if(data.results[i].known_for_department=="Acting"){
        data_final.push(data.results[i]);
      }
    }

    /**
     * If no people are found, return error message
     */
    if (data_final.length <= 0){
      answer = answer + "No actor with name " + keyword + " found. Please make sure you write the name correctly."
    }

    /**
     * If different people are found, return list of possible people
     */
    else if (data_final.length > 1 && data.results[0].name!=data.results[1].name){
      answer = answer + "Your actor query lead to more than one result. Please specify which person you want to search for: ";  

      for (var i=0;i<data.results.length-1;i++){
          if (data.results[i].known_for_department == "Acting")
            answer = answer + data.results[i].name + ", ";
      }
      answer = answer + data.results[data.results.length-1].name;
    }

    /**
     * If exactly one match found, print movie recommendation
     */
    else if (data_final.length == 1 || data.results[0].name==data.results[1].name){
      var actor_id = data.results[0].id;
      try {
        const url_actor = baseURL + "discover/movie?api_key=5e3c4a05e6db9436d1ae340d69fdb46e&with_cast=" + actor_id + "&sort_by=popularity.desc";
        const response_actor = await axios.get(url_actor);
        const data_actor=response_actor.data;
        for (var i=0;i<data_actor.results.length;i++){
          //var randomIndex=Math.floor((Math.random() * data_actor.results.length) + 0);
          var year=data_actor.results[i].release_date.substring(0, 4);
           if (year ==yearInput){
             flag=1;
             var answer= answer + "Name :" + data_actor.results[i].original_title + " , Release Date : " +data_actor.results[i].release_date +"  ;  "
          }
      }
      if (flag==0){
        var answer= "Sorry I couldn't find any in your year";
      }
       
       
        //answer = answer + "Name: " + data_actor.results[randomIndex].original_title + " , Release Date: "+ data_actor.results[randomIndex].release_date+" ; ";

      } catch (error) {
        console.log(error);
      }
    }
    console.log(answer);

    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
    
  } catch (error) {
    console.log(error);
  }
};

// get the movies by director name
module.exports.getDirector= async (event) => {
  const keyword = event.currentIntent.slots["Director"];
 // const yearInput = event.currentIntent.slots["directorYear"];
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"search/person?api_key="+apiKey+"&query=" + keyword;
  var answer = "";

  try {
    const response = await axios.get(url);
    const data=response.data;

    /**
     * Filter directors
     */
    var data_final = [];
    for(var i=0;i<data.results.length;i++){
      if(data.results[i].known_for_department=="Directing"){
        data_final.push(data.results[i]);
      }
    }

    /**
     * If no people are found, return error message
     */
    if (data_final.length <= 0){
      answer = answer + "No director with name " + keyword + " found. Please make sure you write the name correctly."
    }

    /**
     * If different people are found, return list of possible people
     */
    else if (data_final.length > 1 && data.results[0].name!=data.results[1].name){
      answer = answer + "Your director query lead to more than one result. Please specify which person you want to search for: ";  

      for (var i=0;i<5;i++){
         var randomIndex=Math.floor((Math.random() * data.results.length) + 0);
          if (data.results[randomIndex].known_for_department == "Directing")
            answer = answer + data.results[randomIndex].name + ", ";
      }
      answer = answer + data.results[data.results.length-1].name;
    }

    /**
     * If exactly one match found, print movie recommendation
     */
    else if (data_final.length == 1 || data.results[0].name==data.results[1].name){
      var director_id = data.results[0].id;
      try {
        const url_director = baseURL + "discover/movie?api_key="+apiKey+"&with_crew=" + director_id + "&sort_by=popularity.desc";
        const response_director = await axios.get(url_director);
        const data_director=response_director.data;
        for (var i=0;i<data_director.results.length;i++){
          var answer= answer + (i+1)+ " ." + data_director.results[i].original_title + " , Release Date : " +data_director.results[i].release_date +"  ;  "
          /*var year=data_director.results[i].release_date.substring(0, 4);
           if (year ==yearInput){
             flag=1;
             var answer= answer + "Name :" + data_director.results[i].original_title + " , Release Date : " +data_director.results[i].release_date +"  ;  "
          }
      }
      if (flag==0){
        var answer= "Sorry I couldn't find any in your year";
      }*/
      }

     } catch (error) {
        console.log(error);
      }
    }
    //console.log(answer);

    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
    
  } catch (error) {
    console.log(error);
  }
};


// get top rated movies
module.exports.getTopRatedMovieList = async (event) => {
  const baseURL="https://api.themoviedb.org/3/";
  //const yearInput= event.currentIntent.slots["Year"];
  //var flag=0;
  const url = baseURL+"movie/top_rated?api_key="+apiKey+"&language=en-US&page=1&sort_by=popularity.desc";
  var topMovieName=" ";
  try {
    const response = await axios.get(url);
    const data = response.data;
    for (var i=0;i<5;i++){
      var randomIndex=Math.floor((Math.random() * data.results.length) + 0);
       topMovieName= topMovieName + (i+1)+"." + data.results[randomIndex].original_title + " , Release Date : " +data.results[randomIndex].release_date +"  ;  ";
     /* if (year ==yearInput){
           flag=1;
           var topMovieName= topMovieName + "Name :" + data.results[randomIndex].original_title + " , Release Date : " +data.results[randomIndex].release_date +"  ;  "
      }*/
    }
  
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
       //"fulfillmentState": "ElicitIntent",
        "message": {
          "contentType": "PlainText",
          "content":topMovieName
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// get the details of a movie
module.exports.getMovieDetails = async (event) => {
  const key = event.currentIntent.slots["movieName"];
  //const yearInput = event.currentIntent.slots["yearVal"];
  //const key="the shawshank redemption";
  //const yearInput=2019;
  const baseURL="https://api.themoviedb.org/3/";
  
  const url = baseURL+"search/movie?api_key="+apiKey+"&query="+key+"&sort_by=release_date.desc";
  var movieDetail=" ";
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data.results.length);
    if (data.results.length ==0){
      movieDetail = movieDetail + "No movie found. Please make sure you write the name correctly."
    }
    else 
    {
      
      movieDetail=movieDetail+"Name : "+data.results[0].original_title +" , Release Date : "+ data.results[0].release_date+
      " , Details: "+ data.results[0].overview+" ;  ";
    }
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":movieDetail
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};


// get the reviews of a movie

module.exports.getMovieReviews = async (event) => {
  const key = event.currentIntent.slots["movieReview"];

  const baseURL="https://api.themoviedb.org/3/";
  const movieUrl=baseURL+"search/movie?api_key="+apiKey+"&query="+key;
  var movieDetail=" ";

  try {
    const response = await axios.get(movieUrl);
    const data = response.data;

    if (data.results.length ==0){
      movieDetail = movieDetail + "No movie found. Please make sure you write the name correctly."
    }
    else 
    {
      const movieId=data.results[0].id;
      console.log(movieId);
      const reviewUrl = baseURL+"movie/"+movieId+"/reviews?page=1&language=en-US&api_key="+apiKey;
      const reviewResponse = await axios.get(reviewUrl);
      const reviewData = reviewResponse.data;
      if(reviewData.total_results==0){
        movieDetail = movieDetail + "No review for "+key+" found yet";
      }
      else 
      {
      for (var i=0;i<reviewData.results.length;i++){
        movieDetail=movieDetail+(i+1)+".Name : "+reviewData.results[i].author +" , Review Given: "+ reviewData.results[i].content+" ; ";
      } 
      }
   
    }
   
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeX doesn't expect anyresponse back from user
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":movieDetail
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// get movie by certification 
module.exports.getMovieByCertification = async (event) => {
  const keyword = event.currentIntent.slots["Certification"];
  
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"discover/movie?api_key="+apiKey+"&sort_by=popularity.desc&certification_country=US&certification.gte=G&certification.lte=" + keyword;
  var answer = "";

  try {

    const response = await axios.get(url);
    const data=response.data;
    answer = answer + "The following five movies are age appropriate and randomly chosen among the most popular movies: "; 
    const numbers = [ ...Array(data.results.length).keys() ].map(num => num + 1);
    numbers.sort(() => Math.random() - 0.5);
    var rndm = numbers.slice(0, 5);
    
    for (var i=0; i<4; i++) {
      answer = answer + (i+1) + ". "  + data.results[rndm[i]].original_title + " (" + data.results[rndm[i]].release_date+ "), ";
    };
    answer = answer + "5. " + data.results[rndm[4]].original_title + " (" + data.results[rndm[4]].release_date+ ")";

    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// get movie by language 
module.exports.getMovieByLanguage = async (event) => {
  const keyword = event.currentIntent.slots["language"];
  //const keyword="French";
  const languageDb=new Map();
  languageDb.set('english','en');
  languageDb.set('french','fr');
  const language=languageDb.get(keyword.toLowerCase());
  console.log(language);
  const baseURL="https://api.themoviedb.org/3/";
  const url = baseURL+"discover/movie?api_key="+apiKey+"&sort_by=popularity.desc&with_original_language=" + language;
  var answer = "";

  try {

    const response = await axios.get(url);
    const data=response.data;
    //answer = answer + "The following five movies are age appropriate and randomly chosen among the most popular movies: "; 
    //const numbers = [ ...Array(data.results.length).keys() ].map(num => num + 1);
    //numbers.sort(() => Math.random() - 0.5);
 
    for (var i=0; i<5; i++) {
      var randomIndex=Math.floor((Math.random() * data.results.length) + 0);
      answer= answer + (i+1)+". Name :" + data.results[randomIndex].original_title + " , Release Date : " +data.results[randomIndex].release_date +"  ;  ";
    };

    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// ending the conversation

module.exports.getEndingMessage = async (event) => {
 
 const userInput= event.currentIntent.slots["choice"];
 //const userInput= "Continue";
  var userChoice=String(userInput).toLowerCase();
  var goodbyeMessage=" ";
  try {
   
   if (userChoice.localeCompare("continue" )==0){
    goodbyeMessage=goodbyeMessage+ "Ok ! Continue your converstaion ";
   }
   else if (userChoice.localeCompare("exit")==0){
    goodbyeMessage=goodbyeMessage+ "Good Bye. Have a nice day !!! ";
   }
   else {
    goodbyeMessage=goodbyeMessage+ "Enter your choice ";
   }
 
    
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",//close means LeEX doesn't expect anyresponse back from user
        "fulfillmentState":  "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content":   goodbyeMessage
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};