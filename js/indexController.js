(function () {
    var indexApp = angular.module('indexApp', []);

    indexApp.controller('AppCtrl', function ($scope, $timeout) {

        var menNames = ['Bart', 'James', 'Luke', 'Anthony'],
            womenNames = ['Katherine', 'Amy', 'Abbey', 'Zoe'];

        $scope.usedQuestionsIndexes = [];
        var index, answerElemIdv;

        $scope.startToConnect = function () {
            if (!$scope.interest || !$scope.age)
                return $scope.showValidationErr = true;

            $('#get-data').hide();
            $('#searching').show();

            setTimeout(function () {
                $('#searching').hide();
                $('#connected').show();
            }, 1500);

            // set name & picture
            var chosenArr;

            if ($scope.interest == 'Men'){
                chosenArr = menNames;
                $scope.profileImgUrl = 'images/m1.jpg';
            }
            else{
                chosenArr = womenNames;
                $scope.profileImgUrl = 'images/k1.jpg';
            }

            $scope.personName = chosenArr[Math.floor(Math.random() * chosenArr.length)];

            // set first question
            $scope.questioNo = 1;

            var indexQ = chooseQuestionIndex(),
                chosenQA = qa[indexQ];

            $scope.question = chosenQA.q;
            $scope.answers = chosenQA.a;
            

            // init checkboxes for answers
            reinitcheckboxes();

            mixpanel.track("Get started - Go button clicked", { interest: $scope.interest, age: $scope.age, chosenPersonName: $scope.personName });
        };

        $scope.interestedIn = function (option) {
            $scope.interest = option;

            mixpanel.track("Get started - Chose interest", { interest: $scope.interest });
        };

        $scope.chooseAnswer = function (answerElemId) {
            index = Number(answerElemId.replace(/^\D+/g, ''));
            answerElemIdv = answerElemId;

            $scope.personChoseAnswer = true;

            if ($scope.aiChoseAnswer)
                validateAnswer();
            else
                $('.response-status p#picked-answear b').hide();

            mixpanel.track("Chose answer for " + $scope.questioNo + " question.", { question: $scope.question, answer: $scope.answers[index] });
        };

        $scope.questionActionStart = function () {
            $('.response-status > p:first').show();
            $('.response-status > p#answearing').hide();
            $('.response-status p#picked-answear').hide();

            $scope.aiChoosedAnswer = false;

            setTimeout(function () {
                $('.response-status > p:first').hide();
                $('.response-status p#answearing').show();

                setTimeout(function () {
                    $('.response-status > p#answearing').hide();
                    $('.response-status p#picked-answear').show();

                    $scope.aiChoseAnswer = true;

                    if ($scope.personChoseAnswer)
                        validateAnswer();
                    else
                        $('.response-status p#picked-answear b').show();

                }, getRandomInt(2000, 4500));
            }, getRandomInt(2000, 4500));
        };

        function reinitcheckboxes() {
            $timeout(function () {
                radiobxsFill = Array.prototype.slice.call(document.querySelectorAll('form.ac-fill input[type="radio"]'))
                radiobxsFill.forEach(function (el, i) { controlRadiobox(el, 'fill'); });
            }, 1000);
        }

        function chooseQuestionIndex() {
            var index = Math.floor(Math.random() * qa.length);

            while ($scope.usedQuestionsIndexes.indexOf(index) > -1) {
                index = Math.floor(Math.random() * qa.length);
            }

            $scope.usedQuestionsIndexes.push(index);
            return index;
        }

        function validateAnswer() {
            $scope.chosenAnswer = index;
            $timeout(function () {
                $('#' + answerElemIdv).parent().addClass('selectedAnswear');
                $('#question-congrats').show();
            }, 500);

            if ($scope.questioNo < 3)
                $timeout(function () {
                    var index = chooseQuestionIndex(),
                    chosenQA = qa[index];

                    $scope.question = chosenQA.q;
                    $scope.answers = chosenQA.a;

                    $scope.chosenAnswer = undefined;
                    $scope.questioNo++;
                    $('#question-congrats').hide();

                    // init checkboxes for answers
                    reinitcheckboxes();

                    $scope.questionActionStart();

                    mixpanel.track($scope.questioNo + " question shown");
                }, 4000);
            else {
                $timeout(function () {
                    $('#questions').hide();
                    $('#great-match').show();

                    mixpanel.track("Match page shown");
                }, 3500);
            }

            $scope.aiChoseAnswer = false;
            $scope.personChoseAnswer = false;
            $scope.choseAnswerIndex = null;
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    });


    var qa = [
        {
            q: 'You just inherited a large amount of money from family relative. What would you do with the money?',
            a: ['Put all the money in your savings', 'Invest all this money and start a business', 'Have fun and travel the world']
        },
        {
            q: "You've just been fired and are having a midlife crisis. Bills are piling up, job market in your field is really tight and you are not able get a job too soon. What would you do?",
            a: ['Keep looking for a job within your field until you will succeed', 'Invest all your savings into your business idea', 'Move back your parents house and live in the basement until you figure out what you want to do with your life']
        },
        {
            q: 'You have been in a serious relationship for couple of years. You partner is offered an once in a lifetime career opportunity, but in another city/country. What would you do?',
            a: ['Move with your partner to the new location', 'Persuade your partner to stay', 'Let your partner move to the new place without you']
        },
        {
            q: 'Your partner is invited to go for few days with the group of friends to Vegas. What would you do?',
            a: ['Convince your partner not to go', "Trust your partner and accept your partner's freedom", "Start planning for your partner's 'funeral'"]
        },
        {
            q: "If you had one day left to live, what would you do?",
            a: ["Worry, cry all day and seek consolation from family and friends", "Make the day memorable with friends and family, have fun and go out laughing", "Leave detailed instructions about the disposal of your ashes"]
        },
        {
            q: "You arrived at a party and see your partner talking to a guy/girl from French class. How do you react?",
            a: ["Completely loose your cool, react jealously and interrupt your partner's conversation", "Feel a little jealous, but just keep walking because you know your partner would never cheat on you", "Don't care too much because you know you are considered very attractive by your peers"]
        },
        {
            q: "One day your partner comes to you and tells you that he/she wants to go live on a sailboat. How would you react?",
            a: ["You are thrilled about the idea and start packing your stuff", "You think your partner is nuts and urge her/him to go see a psychiatrist", "You think that the idea might have some merit, but you want to take some time to take a rational decision"]
        },
        {
            q: "You and your partner are planning to go to a movie. How do you decide which movie to see?",
            a: ["I have a good taste in movies, so my partner should trust me on this one", "I don't really care about what movie we're going to, so my partner can choose", "I'd prefer to alternate who gets to pick"]
        }
    ]

})();