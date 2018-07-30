// var bodyHeaderContent = document.querySelector('#body-header-content');

// console.log(bodyHeaderContent);
// var colors=['red','green','blue'];
// var currentColor=0;
// bodyHeaderContent.addEventListener('click', function(){
// 	// this.style.backgroundColor="green";
// 	// this.style.fontSize="100px";
// 	this.style.backgroundColor = colors[currentColor%3];
// 	currentColor += 1;

// });
$('#work-link').click(function(){
	$('html, body').animate({
        scrollTop: $("#work").offset().top
    }, 500);
});
$('#about-link').click(function(){
	$('html, body').animate({
        scrollTop: $("#about").offset().top
    }, 500);
});
$('#portfolio-link').click(function(){
	$('html, body').animate({
        scrollTop: $("#images").offset().top
    }, 500);
});
// $('#contact-link').click(function(){
// 	$('html, body').animate({
//         scrollTop: $("#work").offset().top
//     }, 500);
// });
document.querySelector('#contact-link').addEventListener('click', (function(){
    $('html, body').animate({
        scrollTop: $("#about").offset().top
    }, 500);
}));
$('#take-up').click(function(){
    $('html, body').animate({
        scrollTop: $("#body-header").offset().top
    }, 500);
});

document.getElementById("button").addEventListener('click', function(){
    alert("Still working on this link")
});






