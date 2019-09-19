let p = $("<div>");
                    let imgDiv = $("<div>");
                    imgDiv.attr("class", "card m-2");

                    let cHeader = $("<p>");
                    cHeader.attr("class", "img-title text-muted");
                    if (response.data.title !== "") {
                        cHeader.text(`${response.data.title}`);
                    }
                    else {
                        cHeader.text(topic);
                    }

                    imgDiv.append(cHeader);

                    let newImage = $("<img>");
                    newImage.attr("src", response.data.images.fixed_height_still.url);
                    newImage.attr("class", "card-img-top ");
                    newImage.attr("data-state", "still")
                    $("#images").prepend(imgDiv);
                    imgDiv.append(newImage);
                    imgDiv.append(p);
                    p.attr("class", "card-footer text-muted text-center");
                    p.html(`<small>Rating: ${response.data.rating}</small>`)