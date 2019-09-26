$(document).ready(function () {

    //styling the menu arrow
    $('.collapse').on('shown.bs.collapse', function () {
        $(".navbar-toggler-icon").html(`<i class="fas fa-caret-up fa-2x animate-it"></i>`)
        console.log("uno")
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(".navbar-toggler-icon").html(`<i class="fas fa-caret-down fa-2x animate-it"></i>`)
    });


    //hiding buttons
    $("#load_more").hide();
    $("#clear-all").hide();
    $("#show-fav").hide();

    //variables
    let apiKey = "DET5yjWOL7o3DyZDPcvkTj9qpsisIJKV";
    let limit = 10;
    let offset = 0;
    let topic = "";
    let favArray = [];
    let itemId;
    let queryUrl;
    let prevValueString = [];

    //clicking query buttons and here where is the magic happens
    $("body").on("click", ".query-button", function () {

        $("#desc-info").hide(); //hiding instructions
        $("#load_more").show(); //showing load more button
        $("#clear-all").show(); //showing clear all button



        //assigning the value of clicked button to topic
        topic = $(this).val();


        /*------------------------------------------
        HOLY SHIT!!!!!!!!!! IT WORKS!!!!!!!!!!!!!!!!!
        ------------------------------------------*/

        //this is a trick to find out the previuosly clicked button value
        prevValueString.push(topic);

        //checking if the button is load more, in that case setting offset
        if ($(this).attr("id") === "load_more") {
            offset += 10;
            console.log("first if: " + queryUrl)
        }
        //here i am trying to check if the clicked button value is equal to the one stored in array
        //if it is offset is + 10
        else if ($(this).val() === prevValueString[0]) {
            offset += 10;
        }
        //here checking if value is no equal, and also if my array is longer than 2, 
        //that means i've clicked the previuos more than one time and now im changing the subject
        else if ($(this).val() !== prevValueString[0] && prevValueString.length > 2) {
            offset = 0; // offset 0
            prevValueString.splice(0); // emptying the array
            prevValueString.push($(this).val()); // pushing new value
        }
        else {
            offset = 0;
        }

        /*------------------------------------------
                    HAPPY DANCING!!!!
        ------------------------------------------*/



        //query URL
        queryUrl = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;

        //assigning value to load more button, otherwise we don't have a keyword to pass to our link
        //it was a huge pain in the butt to make this work lol
        $("#load_more").attr("value", topic);

        //sending ajax request to gyphy
        for (let i = 0; i < limit; i++) {
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
                .then(function (response) {

                    //creating image div
                    let p = $("<div>");
                    let imgDiv = $("<div>");

                    //it's easier with bootstrap cards
                    imgDiv.attr("class", "card m-2");
                    let cHeader = $("<a>");
                    cHeader.attr("class", "img-title text-muted");


                    //this is important: some of the images don't have a title, so i have to assign a placeholder, 
                    //otherwise my card will break
                    if (response.data[i].title !== "") {
                        cHeader.text(`${response.data[i].title}`);
                        cHeader.attr("href", response.data[i].bitly_url)
                        cHeader.attr("target", "_blank");
                    }
                    else {
                        cHeader.text(topic);
                        cHeader.attr("src", "#")
                    }
                    imgDiv.append(cHeader);
                    let newImage = $("<img>");

                    //showing still image at first
                    newImage.attr("src", response.data[i].images.fixed_height_still.url);
                    newImage.attr("class", "card-img-top " + topic + [i]);
                    newImage.attr("data-state", "still");
                    $("#images").prepend(imgDiv);
                    imgDiv.append(newImage);
                    imgDiv.append(p);
                    p.attr("class", "card-footer text-muted text-center");
                    

                    //showing rating and add to favorites button
                    p.html(`
                    <small>Rating: ${response.data[i].rating}</small>
                    <button  id="empty-heart" 
                            class=" float-right" 
                            data-toggle="tooltip"
                             title="Add to favorites!">
                    <i class="fas fa-heart"></i></button>
                    `);

                    //---------- add to favorites is a toggle, click once - added, click second time - removed ---------------- //


                    //add to favorites functionality
                    $("#empty-heart").on("click", function () {
                        $("#show-fav").show(); // show button if we have at least one favorite
                        $(this).toggleClass("red"); // toggle between red(added) and black (not-added)
                        let questoId = response.data[i].id; //grab image ID

                        //check if it's not red and we dont have that id in the array
                        if ($(this).attr("class") !== "red" && !favArray.includes(questoId)) {
                            $(this).attr("title", "Remove from favorites!"); //tooltip (pretty!)
                            favArray.push(questoId); // pushing in the array image ID
                            console.log(favArray);
                        }

                        //remove from favorites 
                        else {
                            $(this).attr("title", "Add to favorites!"); // changing tootltip title
                            favArray.splice(questoId, 1); // removing from the array
                        }


                    })

                    //clicking on the image, switching status and animating our gifs :)
                    $("." + topic + [i]).on("click", function () {
                        console.log(response.data[i])
                        let state = newImage.attr("data-state");

                        if (state === "still") {
                            newImage.attr("src", response.data[i].images.fixed_height.url);
                            newImage.attr("data-state", "animate")
                        }
                        if (state === "animate") {

                            newImage.attr("src", response.data[i].images.fixed_height_still.url);
                            newImage.attr("data-state", "still")
                        }
                    })
                })
            /*  .then(function (error) {
                 // console.log(error); // if I uncoment this it shows in console anyway!
             }) */

        }
    })

    //defining topics
    let topics = ["cat", "dog", "bear", "horse", "lion", "tiger", "panda", "coala", "monkey", "elephant", "boar", "sloth", "crow"];

    //creating new button and pushing to array
    $("#add-glyph").on("click", function () {
        $("#glyphButtons").empty();
        event.preventDefault();
        let valueInside = $("#glyph-input").val();
        if (valueInside !== "") {
            topics.push($("#glyph-input").val());
            $("#glyph-input").val("");
            console.log(topics);

        }
        createButtons();
    })

    //creating buttons from element of the topics array
    function createButtons() {
        for (let i = 0; i < topics.length; i++) {
            let newButton = $("<button>");
            newButton.attr("class", "btn btn-light query-button pretty-button m-1");
            newButton.attr("value", topics[i]);
            newButton.attr("id", topics[i]);
            newButton.text(topics[i]);
            $("#glyphButtons").append(newButton)
        }

    }
    createButtons();


    //button clear all - emptying everything and hiding buttons
    $("#clear-all").on("click", function () {
        $("#images").empty();
        $("#load_more").hide();
        $("#desc-info").show();
        $(this).hide();
    })

    //favorites button: showing favorites section
    $("#show-fav").on("click", function () {
        $("#images").empty(); //empty everything
        $("#load_more").hide(); //hide this, we don't need it now

        //iterating the favorites array
        for (let j = 0; j < favArray.length; j++) {
            itemId = favArray[j]; // need it for my URL

            //this query sending the ID of images, so it will return all the data for that image
            queryUrl = `https://api.giphy.com/v1/gifs/${itemId}?api_key=${apiKey}`;
            // new ajax request
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
                .then(function (response) {
                    //creating cards
                    let p = $("<div>");
                    let imgDiv = $("<div>");
                    imgDiv.attr("class", "card m-2");
                    let newImage = $("<img>");
                    newImage.attr("src", response.data.images.fixed_height_still.url);
                    newImage.attr("class", "card-img-top");
                    newImage.attr("id", itemId);
                    newImage.attr("data-state", "still")
                    $("#images").prepend(imgDiv);
                    imgDiv.append(newImage);
                    console.log(response.data.id);

                    imgDiv.append(p);
                    p.attr("class", "card-footer text-muted text-center");

                    //showing rating and add to favorites button
                    p.html(`
                    <small>Rating: ${response.data.rating}</small>
                    <button  id="close-button" 
                            class=" float-right" 
                            data-toggle="tooltip"
                             title="Remove from favorites!">
                    <i class="fas fa-times"></i></button>
                    `);


                    $("#close-button").on("click", function () {
                        let x = $(this).closest(".card");
                        x.remove()
                        console.log("clicking close")
                        let questoId = response.data.id; //grab image ID
                        favArray.splice(questoId, 1); // removing from the array
                    })
                    //clicking on the image, toggling status
                    $("#" + itemId).on("click", function () {

                        let state = newImage.attr("data-state");

                        if (state === "still") {
                            newImage.attr("src", response.data.images.fixed_height.url);
                            newImage.attr("data-state", "animate")
                        }
                        if (state === "animate") {

                            newImage.attr("src", response.data.images.fixed_height_still.url);
                            newImage.attr("data-state", "still")
                        }
                    })

                })
                .then(function (error) {
                    //     console.log(error);
                })

        }





    })



})


