/*
* RPZ - Efficient 404 Pages
* Build Date: November 2015
* Author: Madeon08
* Copyright (C) 2015 Madeon08
* This is a premium product available exclusively here : http://themeforest.net/user/Madeon08/portfolio
*/

/* ------------------------------------- */
/* Opening Animations .................. */
/* ------------------------------------- */

$(document).ready(function(){
    "use strict";

    $(window).load(function(){

        $(".right-part").addClass("animated-middle fadeIn").removeClass("opacity-0");

        $('.timer').countTo({
            from: 999,
            to: 404,
            speed: 2000,

            onComplete: function() {

                $(".timer").addClass("alert-text animated-quick tada");

            }
        });

    });

    (function() {

        var dlgtrigger = document.querySelector( '[data-dialog]' ),
            somedialog = document.getElementById( dlgtrigger.getAttribute( 'data-dialog' ) ),
            dlg = new DialogFx( somedialog );

        dlgtrigger.addEventListener( 'click', dlg.toggle.bind(dlg) );

    })();

});