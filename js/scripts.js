(function ($) {
    "use strict";

    $(document).ready(function () {
        Parse.initialize("tRcI9IoC5odAAY8vSjH1zev4c6jGabkR9J24dyyi", "fVm3SwB6IxaeQEzRzDeUHiVEONB8Xd83ydn9uXvy");

        $(document).on('click', '.share-button-sizing', function (e) {
            mixpanel.track("Share button clicked", { service: e.toElement.className });
            //console.log('click' + e.toElement.className, e);
        });
    });

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 60
    });

    $('#topNav').affix({
        offset: {
            top: 200
        }
    });

    new WOW().init();

    $('a.page-scroll').bind('click', function (event) {
        var $ele = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($ele.attr('href')).offset().top - 60)
        }, 1450, 'easeInOutExpo');
        event.preventDefault();
    });

    $('.navbar-collapse ul li a').click(function () {
        /* always close responsive nav after click */
        $('.navbar-toggle:visible').click();
    });

    $('#galleryModal').on('show.bs.modal', function (e) {
        $('#galleryImage').attr("src", $(e.relatedTarget).data("src"));
    });

    //MY

    $('header .btn-primary').on('click', function () {
        $('.game').fadeTo("slow", 1);
        $('header').fadeTo(300, 0);

        $('.navbar').addClass('increase-opacity');

        mixpanel.track("Try it now - button clicked");
    });

    $('.btn.start').on('click', function () {
        $('#connected').hide();
        $('#get-ready').show();

        setTimeout(function () {
            $('#get-ready .one').show();
        }, 500);

        setTimeout(function () {
            $('#get-ready .two').show();
        }, 1000);

        setTimeout(function () {
            $('#get-ready .three').show();
        }, 1500);

        setTimeout(function () {
            $('#get-ready .four-go').show();
        }, 2000);

        setTimeout(function () {
            $('#get-ready').hide();
            $('#questions').show();

            angular.element($('.game')).scope().questionActionStart();

            mixpanel.track("First question shown");
        }, 2500);

        mixpanel.track("Start game of life");
    });

    $('.btn.sign-up-now').on('click', function () {
        showSwall();
        mixpanel.track("Join now button clicked");
    });

    $('.btn-social.btn-facebook').on('click', function () {
        showSwall();
        mixpanel.track("Facebook sign up button clicked");
    });

    $('.btn.sign-up').on('click', function () {
        showSwall();
        mixpanel.track("Sign up via username - button clicked");
    });

    var emailSent = false,
        textSuccess = "Share this unique url with your friends: " +
            '<div class="url-display-box"><p>http://hookchat.co/?share-id=' + Math.random().toString(36).substring(7) + "</p> </div>" + "<div class='shareaholic-canvas' data-app='share_buttons' data-app-id='23635315'></div>";

    function showSwall() {

        if (!emailSent)
            swal({
                title: "VIP only!",
                text: "Sign up now for the waiting list to get access first on March 29.",
                imageUrl: "images/vip-only.jpg",
                html: true,
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                inputPlaceholder: "Enter Your Email Here",
                inputType: 'email',
                confirmButtonText: "Get me in!",
                confirmButtonColor: '#A5114D'
            }, function (inputValue) {
                if (inputValue === false) return false;
                if (!validateEmail(inputValue)) {
                    swal.showInputError("Please enter a valid email if you want to join :)");
                    return false;
                };

                // save email
                mixpanel.track("Sent Email", { email: inputValue });
                saveEmail(inputValue);

                swal({
                    title: "Spread the love!",
                    text: textSuccess,
                    type: "success",
                    html: true,
                });
            });

        else
            swal({
                title: "Spread the love!",
                text: textSuccess,
                type: "success",
                html: true,
            });
    }

    function saveEmail(email) {
        var EmailObject = Parse.Object.extend("Email"),
            emailObject = new EmailObject();

        emailObject.save({ email: email }).then(function (object) {
            console.log(object);
            emailSent = true;
        });
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

})(jQuery);