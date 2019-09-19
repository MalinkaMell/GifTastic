$(document).ready(function () {
    $("#load_more").hide();

    let apiKey = "DET5yjWOL7o3DyZDPcvkTj9qpsisIJKV";
    let limit = 10;
    let offset = 0;
    let topic = "";

    //clicking query buttons and here where is the magic happens
    $("body").on("click", ".query-button", function () {
        $("#load_more").show();
        // offset = 0;
        topic = $(this).val();
        if ($(this).attr("id") === "load_more") {
            offset += 10;
        }
        else {
            offset = 0;
        }

        let queryUrl = `https://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;

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
                    p.html(`<small>Rating: ${response.data[i].rating}</small>`);


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

    //defuning topics
    let topics = ["cats", "dogs", "bears", "horses"];

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
            newButton.attr("class", "btn btn-light query-button m-1");
            newButton.attr("value", topics[i]);
            newButton.attr("id", topics[i]);
            newButton.text(topics[i]);
            $("#glyphButtons").append(newButton)

        }

    }
    createButtons();































})