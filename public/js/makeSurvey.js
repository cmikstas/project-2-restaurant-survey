var map;

var surveyUserArr = [];

var questionOptionsArr = [];
var surveyQuestionsArr = [];
var totalQuestionsArr = [];

var mapSelectionArray = [];
var markers = [];

var userCommentsArr = [];

$(document).ready(function ()
{
    geoInitialize();
    googlePlacesSearch()
    pullUsers();
    addCustomQuestion();
    clearQuestion();
    addQuestion();

    $("#comment-btn").on("click", function (event)
    {
        event.preventDefault();

        let userName = $(".navbar-user").attr("data-username");
        let userComment = $("#comment-text").val().trim();
        let fullComment = "<b>" + userName + "</b>" + ": " + userComment;
        let commentDiv = $("<div>");

        commentDiv.attr("contenteditable", "true");
        commentDiv.addClass("mx-2");

        commentDiv.append(fullComment);
        $("#commentsDiv").append(commentDiv);
        $("#comment-text").val("");

        let commentDetails =
        {
            userName: userName,
            userComment: userComment,
        }

        userCommentsArr.push(commentDetails);
        //console.log(userComments);
    });

    function geoInitialize()
    {
        // Create a map centered in SLC.
        map = new google.maps.Map(document.getElementById('map'),
        {
            center: { lat: 40.7608, lng: -111.8910 },
            zoom: 9
        });
    }

    function pullUsers()
    {
        $.ajax("/api/allusers",
        {
            type: "GET"
        })
        .then(function (data) {
            //console.log(data);
            for (let i = 0; i < data.length; i++)
            {
                let userName = data[i].username;

                let buttonIcon = "+";
                //console.log(userName);

                let addUserBtn = $("<button>");
                addUserBtn.addClass("addUserBtns");
                addUserBtn.attr("type", "button");
                //addUserBtn.attr("data-username", userName);

                let userBox = $("<label>");
                userBox.addClass("form-check-label mx-3");
                userBox.append(userName);

                let userNameDiv = $("<div>");
                userNameDiv.addClass("form-check");

                addUserBtn.append(buttonIcon);
                userNameDiv.append(addUserBtn);
                userNameDiv.append(userBox);
                $("#userResults").append(userNameDiv);

                addUserBtn.on("click", function (event)
                {
                    //let addUserNameBtn = ($(this).attr("data-username"));
                    //console.log(addUserNameBtn);

                    if (!surveyUserArr.includes(userName))
                    {
                        surveyUserArr.push(userName);
                        //console.log(surveyUserArr);

                        let deleteButtonIcon = "<span>&times</span>";
                        let deleteUserBtn = $("<button>");
                        deleteUserBtn.addClass("deleteUserBtns");
                        deleteUserBtn.attr("type", "button");
                        //deleteUserBtn.attr("data-username", userName);

                        let userBoxFinal = $("<label>");
                        userBoxFinal.addClass("form-check-label mx-3");
                        userBoxFinal.append(userName);

                        let userNameFinalDiv = $("<div>");
                        userNameFinalDiv.addClass("form-check");

                        deleteUserBtn.append(deleteButtonIcon);
                        userNameFinalDiv.append(deleteUserBtn);
                        userNameFinalDiv.append(userBoxFinal);
                        $("#usersAdded").append(userNameFinalDiv);

                        deleteUserBtn.on("click", function (event)
                        {
                            //let deleteUserNameBtn = ($(this).attr("data-username"));
                            //console.log(deleteUserNameBtn);

                            //Returns the index of the user name in the array.
                            //Returns -1 if not found. 
                            let index = surveyUserArr.indexOf(userName);

                            //Should always be found but check just to be safe.
                            if (index >= 0)
                            {
                                surveyUserArr.splice(index, 1);
                                //console.log(surveyUserArr);
                                userNameFinalDiv.remove();
                            }
                        });
                    }
                });
            }
        });
    }

    function addQuestion()
    {
        $("#addQ").on("click", function (event)
        {
            let questionName = $("#surveyQuestion").val().trim();

            let checkQName = surveyQuestionsArr.filter(function(checkName)
            {
                return checkName.questionName1 === questionName;
            })

            //console.log(checkQName);

            if (checkQName.length > 0)
            {
                return;
            }

            if(questionName !== "" && questionOptionsArr.length > 0)
            {
                let deleteQIcon = "Delete";
                let deleteQBtn = $("<button>");
                deleteQBtn.addClass("deleteQBtn");
                deleteQBtn.attr("type", "button");
                deleteQBtn.attr("data-username", questionName);
                deleteQBtn.append(deleteQIcon);

                let questionDiv = $("<div>");
                questionDiv.addClass("question-block");

                let ul = $("<ul>");
                let questionNameText = $("<div>");
                questionNameText.addClass("question-text");
                questionNameText.text(questionName);
                questionDiv.append(questionNameText);
                questionDiv.append(ul);

                for (let i = 0; i < questionOptionsArr.length; i++)
                {
                    let questionChoice = questionOptionsArr[i].surveyOption;
                    let choicesBlock = $("<div>");

                    choicesBlock.addClass("options-block");
                    questionDiv.append("<li>" + questionChoice + "</li>");
                }

                questionDiv.append(deleteQBtn);
                $("#surveyQuestionsDiv").append(questionDiv);

                deleteQBtn.on("click", function (event)
                {
                    for (let i = 0; i < surveyQuestionsArr.length; i++)
                    {
                        if (surveyQuestionsArr[i].questionName1 === questionName)
                        {
                            surveyQuestionsArr.splice(i, 1);
                            questionDiv.remove();
                        }
                    }

                    console.log(surveyQuestionsArr);
                });

                let surveyQuestion =
                {
                    questionName1: questionName,
                    questionOptions: questionOptionsArr
                }

                surveyQuestionsArr.push(surveyQuestion);
                console.log(surveyQuestionsArr);

                $("#surveyQuestion").val("");
                $("#questionOptions").empty();
                questionOptionsArr = [];
            }
            else
            {
                console.log("Fields cannot be blank")
                return;
            }
        });
    }

    function clearQuestion()
    {
        $("#clearQ").on("click", function (event)
        {
            $("#surveyQuestion").val("");
            $("#questionOptions").empty();
            questionOptionsArr = [];
        });
    }

    function addCustomQuestion()
    {
        $("#customQBtn").on("click", function (event)
        {
            let customChoice = $("#customQ").val().trim();

            if (customChoice !== "")
            {
                //console.log(customChoice);

                if (!questionOptionsArr.includes(customChoice))
                {
                    questionOptionsArr.push(
                    {
                        surveyOption: customChoice,
                        latLong: null,
                        address: null,
                        isGoogle: false
                    });
                    //console.log(questionOptionsArr);

                    let deleteOptionIcon = "<span>&times</span>";
                    let deleteOptionBtn = $("<button>");
                    deleteOptionBtn.addClass("deleteUserBtns");
                    deleteOptionBtn.attr("type", "button");
                    deleteOptionBtn.attr("data-username", customChoice);

                    let questionBox = $("<label>");
                    questionBox.addClass("form-check-label mx-3");
                    questionBox.append(customChoice);

                    let questionDiv = $("<div>");
                    questionDiv.addClass("form-check");

                    deleteOptionBtn.append(deleteOptionIcon);
                    questionDiv.append(deleteOptionBtn);
                    questionDiv.append(questionBox);
                    $("#questionOptions").append(questionDiv);

                    deleteOptionBtn.on("click", function (event)
                    {
                        //let surveyOption2 = ($(this).attr("data-username"));
                        //console.log(deleteUserNameBtn);

                        //Returns the index of the user name in the array.
                        //Returns -1 if not found. 
                        let index = questionOptionsArr.indexOf(customChoice);

                        //Should always be found but check just to be safe.
                        if (index >= 0)
                        {
                            questionOptionsArr.splice(index, 1);
                            //console.log(questionOptionsArr);
                            questionDiv.remove();
                        }
                    });
                }

            }
            else
            {
                console.log("Field cannot be blank");
                return;
            }
        })
    }

    function googlePlacesSearch()
    {
        $("#gPlacesSearch").on("click", function (event)
        {
            $("#gPlacesResults").empty();

            let googleLocation = $("#gPlacesLocation").val().trim();
            let googleState = $("#gPlacesState").val().trim();

            let query = googleLocation + ", " + googleState;
            //console.log(query);

            let radius = $("#gPlacesRadius").val().trim();
            let radiusInt = parseInt(radius);
            //console.log(radius);

            if (googleLocation !== "" && googleState !== "" && radiusInt !== "")
            {
                if (isNaN(radiusInt))
                {
                    console.log("radius must be an integer");
                    return;
                }

                $.ajax("/api/places/" + query + "/" + radius,
                {
                    type: "GET"
                }).then(function (data)
                {
                    //console.log(data);

                    for (let i = 0; i < data.length; i++)
                    {
                        let address = data[i].formatted_address;
                        let latLong = data[i].geometry.location;
                        let name = data[i].name;
                        //console.log(address);
                        //console.log(latLong);
                        //console.log(name);

                        let placesBtnIcon = "+";
                        let placesBtn = $("<button>");
                        placesBtn.addClass("addPlacesButton");
                        placesBtn.attr("type", "button");
                        placesBtn.attr("data-username", name);

                        let placesBox = $("<label>");
                        placesBox.addClass("form-check-label mx-3");
                        placesBox.append(name);

                        let placesResult = $("<div>");
                        placesResult.addClass("form-check");

                        placesBtn.append(placesBtnIcon);
                        placesResult.append(placesBtn);
                        placesResult.append(placesBox);

                        $("#gPlacesResults").append(placesResult);

                        placesBtn.on("click", function (event)
                        {
                            let surveyOption = ($(this).attr("data-username"));
                            //console.log(surveyOption);

                            if (!questionOptionsArr.includes(surveyOption))
                            {
                                questionOptionsArr.push(
                                {
                                    surveyOption: surveyOption,
                                    latLong: latLong,
                                    address: address,
                                    isGoogle: true
                                });
                                //console.log(questionOptionsArr);

                                let deleteOptionIcon = "<span>&times</span>";
                                let deleteOptionBtn = $("<button>");
                                deleteOptionBtn.addClass("deleteUserBtns");
                                deleteOptionBtn.attr("type", "button");
                                deleteOptionBtn.attr("data-username", surveyOption);

                                let questionBox = $("<label>");
                                questionBox.addClass("form-check-label mx-3");
                                questionBox.append(surveyOption);

                                let questionDiv = $("<div>");
                                questionDiv.addClass("form-check");

                                deleteOptionBtn.append(deleteOptionIcon);
                                questionDiv.append(deleteOptionBtn);
                                questionDiv.append(questionBox);
                                $("#questionOptions").append(questionDiv);

                                deleteOptionBtn.on("click", function (event)
                                {
                                    //let surveyOption2 = ($(this).attr("data-username"));
                                    //console.log(deleteUserNameBtn);

                                    //Returns the index of the user name in the array.
                                    //Returns -1 if not found. 
                                    let index = questionOptionsArr.indexOf(surveyOption);

                                    //Should always be found but check just to be safe.
                                    if (index >= 0)
                                    {
                                        questionOptionsArr.splice(index, 1);
                                        //console.log(questionOptionsArr);
                                        questionDiv.remove();
                                    }
                                });
                            }
                        });
                    }

                });

                $("#gPlacesLocation").val("");
                $("#gPlacesState").val("");
                $("#gPlacesRadius").val("");
            }
            else
            {
                console.log("Please make valid selections");
                return;
            }
        });
    }
});