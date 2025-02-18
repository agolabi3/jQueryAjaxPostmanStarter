// this iife updates the copyright year in the footer
(function(){
	let now = new Date();
	let span = $("footer span");
	span.html(now.getFullYear());
})();

// global variable to store our returned data - we'll reduce the calls made to the server with this
let cupcakesCollection = null;

// use get to grab and display the cupcakes in their default order (this endpoint should return all of the cupcakes in  JSON in alphabetical order])
//TODO
//the end point
$.get("https://61e93050-cc69-4fce-9d6c-418d5aaa780b.mock.pstmn.io/cupcakes", function(data){
  //if the call fails, this annonymouse function will do this
  //console.log the return data
  console.log(data);

  //if it successes display to the page
  //this is the helper function that is lower down
  displayCupcakes(data);

  //add the data to the global var
  cupcakesCollection = data;
}, "json").fail(function(){
  //empty out the sting
  $("#cupcakes").empty();
  //give them a message
  $("#cupcakes").append("<div>There is an error while connecting.</div>");
});//end with the data we are expecting from the surver

// display sorted in ascending order (this is calling a different endpoint than the original, but you can use the same one or the global variable, we're just writing this as another call to the server so we can see the syntax for this type of call)
//TODO
$("#alpha").click(function(){
  $.ajax({
    url: "https://6f186305-ab26-4839-b806-380e3560e049.mock.pstmn.io/cupcakes.json?alpha=asc",
    method: "GET",
    datatype: "json"
  })
  .done(function(data){
    //pars text into json
    let json = jQuery.parseJSON(data);  
    //display the soarted cupakes to the page
    displayCupcakes(json);
  })

  .fail(function(){
    //empty out the sting
    $("#cupcakes").empty();
    //give them a message
    $("#cupcakes").append("<div>There is an error while connecting.</div>");
  });
});

// display the cupcakes sorted in descending order, but we'll use some built-in methods to handle this on the cupcakes we already have rather than making another call to the endpoint 
//TODO
$("#zed").click(function(){
  if(cupcakesCollection[0].name == "Bubble Gum Pop"){
    //copu the stuff to new var
    let backwardsCupcakes = cupcakesCollection;
    //now revers order in new array
    backwardsCupcakes = backwardsCupcakes.reverse();
    //diplsay the new order of cakes
    displayCupcakes(backwardsCupcakes);
  }else{
    return;
  }
});

// helper function to display the cupcakes given the data returned from the call
function displayCupcakes(data){
  console.log(data);
  // clear out any previous output from the container
  $("#cupcakes").empty();
  // an empty string to build our output
  let string = "";
  
  // iterate through the returned cupcakes collection and display to the screen in semantic tags
  for(let cupcake of data){
    string += 
      `<section>
        <img src="${cupcake.image}" alt="${cupcake.alt}">
        <h4>${cupcake.name}</h4>
        <b>Ingredients:</b>
        <p class='ingredients'>${cupcake.ingredients}</p>
        <b>${cupcake.frosting} Frosting</b>
        <p class='frosting'>${cupcake.frostingIngredients}</p>
      </section>`;
  }
  //add the html to the page
  $("#cupcakes").html(string);
}

// helper function for displaying the filtered results - called on change of select drop down
// this looks at the JSON of our collection, specifically each cupcake's value attribute, to return only the cupcakes whose tag list includes the correct tags for that category of cupcakes (when you choose chocolate, you will see all of the cupcakes that have a tag of chocolate in their tags property)
$("#filter").change(function (){
  // get the currently selected option from the select drop down
  let tag = $(this).val();

  // if the user selected "all", display all of the cupcakes from our global variable
  if(tag === "all"){
    // displays all of the cupcakes
    displayCupcakes(cupcakesCollection);

    // enables the user to sort alphabetically again
    $("#alpha").prop("disabled", false);
    $("#zed").prop("disabled", false);
  }else{
    // store the cupcake objects with that tag to a new variable, this is the collection we'll display to the screen
    let filteredCupcakes = cupcakesCollection.filter(cupcake => cupcake.tags.includes(tag));
    console.log(filteredCupcakes);

    // display the filtered array to the screen
    displayCupcakes(filteredCupcakes);

    // disables the buttons to sort alphabetically for now. We could add this feature for filtered results later
    $("#alpha").prop("disabled", true);
    $("#zed").prop("disabled", true);
  }
});