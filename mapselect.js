var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i, slides = document.getElementsByClassName('slide');
	if (n > slides.length) {slideIndex = 1;}
	if (n < 1) {slideIndex = slides.length;}
	for (i=0; i<slides.length; i++) {
		slides[i].style.display = "none";
	}
	slides[slideIndex-1].style.display = "block";
}

var mySlides = ["Classic++", "East and West", "North and South", "Intersection", "Checkerboard", "Scenario: Red and Blue"].forEach(function(n) {
	var n2 = n.toLowerCase().replace(/ /g, '_').replace(/:/g, '/');
	var myElement = document.createElement('div');
	var myCaption = document.createElement('div');
	var myHref = document.createElement('a');
	var myImage = document.createElement('img');
	myElement.className = "slide";
	myHref.href = "game/?" + n2;
	myImage.src = "images/" + n2 + ".png";
	myImage.style = "width: 100%";
	myCaption.className = "caption";
	myCaption.innerHTML = n;
	myHref.appendChild(myImage);
	myElement.appendChild(myHref);
	myElement.appendChild(myCaption);
	document.getElementById("slideshow-container").appendChild(myElement);
});