$(document).ready(function () {
    $("#load_more").hide();
    $("#clear-all").hide();
    $("#show-fav").hide();
    let apiKey = "DET5yjWOL7o3DyZDPcvkTj9qpsisIJKV";
    let limit = 10;
    let offset = 0;
    let topic = "";
    let favArray = [];
    let itemId;

    let queryUrl;

    //clicking query buttons and here where is the magic happens
    $("body").on("click", ".query-button", function () {

        $("#load_more").show();
        $("#clear-all").show();
   
        // offset = 0;
        topic = $(this).val();
        if ($(this).attr("id") === "load_more") {
            offset += 10;
        }
        else {
            offset = 0;
        }

        queryUrl = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;

        $("#load_more").attr("value", topic);

        for (let i = 0; i < limit; i++) {
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
                .then(function (response) {

                    let p = $("<div>");
                    let imgDiv = $("<div>");
                    imgDiv.attr("class", "card m-2");

                    let cHeader = $("<p>");
                    cHeader.attr("class", "img-title text-muted");
                    if (response.data[i].title !== "") {
                        cHeader.text(`${response.data[i].title}`);
                    }
                    else {
                        cHeader.text(topic);
                    }

                    imgDiv.append(cHeader);

                    let newImage = $("<img>");
                    newImage.attr("src", response.data[i].images.fixed_height_still.url);
                    newImage.attr("class", "card-img-top " + topic + [i]);
                    newImage.attr("data-state", "still")
                    $("#images").prepend(imgDiv);
                    imgDiv.append(newImage);
                    imgDiv.append(p);
                    p.attr("class", "card-footer text-muted text-center");
                    p.html(`<small>Rating: ${response.data[i].rating}</small>
                    <button  id="empty-heart" class=" float-right" data-toggle="tooltip" title="Add to favorites!">
                    <i class="fas fa-heart " ></i></button>`);

                    //---------- add to favorites is a toggle, click once - added, click second time - removed ---------------- //
                    //have to write functionality to check if the items ID is in the array, and if it it, delete it


                    $("#empty-heart").on("click", function () {
                        $("#show-fav").show();
                        $(this).toggleClass("red");
                        let questoId = response.data[i].id;
                        
                        if ($(this).attr("class") !== "red" && !favArray.includes(questoId)) {
                            $(this).attr("title", "Remove from favorites!")
                            
                            favArray.push(questoId)
                            console.log(favArray);
                        }
                        else {
                            console.log($(this).attr("title"))
                            $(this).attr("title", "Add to favorites!")
                            console.log(favArray.indexOf(questoId))
                            favArray.splice(questoId, 1)
                            //  favArray.indexOf(response.data[i]).splice(response.data[i], 1)
                            console.log(favArray);
                        }


                        //document.cookie = JSON.stringify(favArray);
                        // document.cookie = favArray;

                    })

                    //clicking on the image, toggling status
                    $("." + topic + [i]).on("click", function () {

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
                .then(function (error) {
                    // console.log(error);
                })

        }
    })
    // console.log(favArray)
    //defuning topics
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

    //creating buttons
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

    $("#clear-all").on("click", function () {
        $("#images").empty();
        $("#load_more").hide();

    })


    $("#show-fav").on("click", function () {
        $("#images").empty();
        $("#load_more").hide();
        for (let j = 0; j < favArray.length; j++) {
            itemId = favArray[j];
            queryUrl = `https://api.giphy.com/v1/gifs/${itemId}?api_key=${apiKey}`;


            $.ajax({
                url: queryUrl,
                method: "GET"
            })
                .then(function (response) {

                    let imgDiv = $("<div>");
                    imgDiv.attr("class", "card m-2");
                    let newImage = $("<img>");
                    newImage.attr("src", response.data.images.fixed_height_still.url);
                    newImage.attr("class", "card-img-top " + itemId);
                    newImage.attr("data-state", "still")
                    $("#images").prepend(imgDiv);
                    imgDiv.append(newImage);
                    console.log(response.data.id);

                    //clicking on the image, toggling status
                    $("." + itemId).on("click", function () {

                        state = newImage.attr("data-state");

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


