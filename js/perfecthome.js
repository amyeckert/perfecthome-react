// source and inspiration: https://github.com/mjhea0/jquery-madlibs

$(document).ready(function() {	
	//clear any input values
	$(".js-input").val('');

 	// reset window hash to empty
	window.location.hash = '';

	// // HIDE STUFF	---------------------------//
	$(".q1").hide();
	$(".q2").hide();
	$(".q3").hide();
	$(".listings").hide();
	$(".js-list1").hide();
	$(".js-list2").hide();
	$(".js-list3").hide();
	$(".replay").hide();   
	$(".btn-reset").hide();
	$(".share").hide();
	$(".eliza").hide();

	// GLOBAL VBARIABLES -------------------------//
	var q1 = $(".q1");
 	var q2 = $(".q2");
 	var q3 = $(".q3");
	var allInputs = $('.js-input');

	// regular expressions  -------------------------------//
	var vowelRegExp = /^[aeiou]/gi; // for adding a(n) in front of nouns where required.
	var theRegExp = /\bthe\b/gi; //remove the word "the"
	var lettersRegExp = /[^a-z ]+$/gi; // allow ONLY alphabetic and whitespace
	var numbersRegExp = /[^0-9] $/gi;

	// VALIDATIONS ---------------------------//
	var cleanText = function(inputText) {
		var textIsClean = true;
		if (inputText.match(lettersRegExp)) {
			textIsClean = false;
		} 
		return textIsClean; 
	};

	var cleanNumbers = function(inputText) {
		var numbersClean = true;
		if (inputText.match(numbersRegExp)) {
			numbersClean = false;
		}
		return numbersClean;
	};

	var validateName = function(){
		var nameIsValid = false;
	 	playerName = $('.firstName').val();
	 	var errNameRequired = 'Pssst! What\'s your name?';

	 	if(!playerName) {
	 		nameIsValid = false;
			$('#' + 'firstName').next().text(errNameRequired);
	 	} else if(!cleanText(playerName)){
	 		nameIsValid = false;
	 		errNameRequired = '\*Please use only letters, thanks!';
	 		$('#' + 'firstName').next().text(errNameRequired);
	 	} else {
	 		return true;
	 	}
		return nameIsValid;
	};

	var pickForm = function(){
		var allQuestions = [q1, q2, q3];
		var chosen = allQuestions[Math.floor(Math.random() * allQuestions.length)];
		
		//for future investigation: 
		// source https://stackoverflow.com/questions/6625551/math-random-number-without-repeating-a-previous-number //

		// var getRand = (function() {
		//     var nums = [0,1,2,3,4,5,6];
		//     var current = [];
		//     function rand(n) {
		//         return (Math.random() * n)|0;
		//     }
		//     return function() {
		//       if (!current.length) current = nums.slice();
		//       return current.splice(rand(current.length), 1);
		//     }
		// }());

		//clear input values
		$(".js-input").val("");

	 	$(".enter-name").hide();
	 	$(".firstName").empty().append($("input.firstName").val());
  
		//	PICK A QUESTIONAIRE ------------//
		if (chosen == q1) {
			window.location.hash = '#q1';
			console.log('form #1 chosen');
	 	}
		 else if (chosen == q2) {
			window.location.hash = '#q2';
			console.log('form #2 chosen');
	 	}
		else { 
			window.location.hash = 'q3';
			console.log('form #3 chosen');
		}
	};

	var validateForm = function() {
		// determine which form is visible 
		var chosenForm = $('body').find('form:visible').not( '#name' );
		var chosenInputs = $('body').find('.js-input:visible').not('#firstName');
		var formIsValid = true;

		// check if each input is filled out correctly
		for (var i=0; i<chosenInputs.length; i++) {
			var currentAnswer = $(chosenInputs[i]).val();
			var currentInputId = $(chosenInputs[i]).attr('id');
			var currentErrorMessage = $(chosenInputs[i]).data('error-msg');
			var currentInputType = $(chosenInputs[i]).attr('type');		
			// remove any previous error msg
			$('#' + currentInputId).next().text('');
			
			// check the input is empty
			if(currentAnswer === '') {
				$('#' + currentInputId).next().text('\*' + currentErrorMessage); 
				formIsValid = false; 
			} else {
				if(currentInputType === 'number') { 
					// convert string max and min values to numbers 
					var min = 0;
					var maxValue = $(chosenInputs[i]).attr('max');
					var max = parseInt(maxValue, 10);
					var numberEntered = parseInt(currentAnswer, 10);
				
					// check numbers are in correct range
				 	if (numberEntered < min || numberEntered > max) {
						currentErrorMessage = '\*Please pick a number in the correct range.';
						$('#' + currentInputId).next().text(currentErrorMessage);
						formIsValid = false;	
					} else {
						$('#' + currentInputId).next().text('');		
					} 
				}
				if (currentInputType ==='text') { 
					if (!cleanText(currentAnswer)) {
						currentErrorMessage = '\*Please use only letters, thanks!';
						$('#' + currentInputId).next().text(currentErrorMessage);
						formIsValid = false;
					} else {
						$('#' + currentInputId).next().text('');
					}
				}			
			}
		} 
		return formIsValid;
	}; 

	//	save data ------------------------//
	var saveData = function(answers, listing) {
		this.listing = listing;
		var newName = [
			{name: 'firstName', value: playerName }
			];
		var newListing = [
			{ name: "listing", value: listing }
			];
		var newData = answers.serializeArray();
		newData.unshift(newName[0]);
		newData.push(newListing[0]);

		$.ajax({
		   	type: "POST",
		   	url: "buildJson.php", 
		   	data: newData,  
		  	success: function() {
	  		} 
		});
	};	
		
	// inject answers into the madlibs and grab all text----------------------//
	var createListing1= function(){
	    // if input starts with a vowel, add an n to make an before it.
	    var inputStartsWithVowel = $("input.adj2").val();
		var addN = $(".adj2").prev();
	    if(inputStartsWithVowel.match(vowelRegExp)) {
	    	// getprevious sibling
	    	addN.empty().text('an ');
	    	$(".adj2").empty().append(inputStartsWithVowel).val();
		 } else {
		 	addN.empty().text('a ');
		 	$(".adj2").empty().append(inputStartsWithVowel).val();
		 }
		 //check for and remove "the" before name of body of water
		 var waterInput = $("input.water").val(); 
		 if(waterInput.match(theRegExp)) {
		 	waterInput = waterInput.replace(theRegExp, '');
	    	$(".water").empty().append(waterInput).val();
		 } else {
	    	$(".water").empty().append(waterInput).val();	
		 }

		// grab the values from the input boxes, then append them to the DOM
		$(".firstName").empty().append($("input.firstName").val());
	    $(".adj1").empty().append($("input.adj1").val());
	    $(".favCountry").empty().append($("input.favCountry").val());
	    $(".bestie").empty().append($("input.bestie").val());
	    $(".noun1").empty().append($("input.noun1").val());
		$(".noun2").empty().append($("input.noun2").val());
	    $(".favCartoon").empty().append($("input.favCartoon").val());
	    $(".prez").empty().append($("input.prez").val());
	    $(".gem").empty().append($("input.gem").val());
	    $(".basement").empty().append($("input.basement").val());
	    $(".tree").empty().append($("input.tree").val());
	    $(".num1").empty().append($("input.num1").val());
	    $(".favAnimal").empty().append($("input.favAnimal").val());
	    $(".verb1").empty().append($("input.verb1").val());

	    // save data 
	    var form1 = $('#questions1');
	    
	    // hide the questions
	    $(".q1").hide();

	    //jump to top of page
	    $(window).scrollTop(0);

	    //	show the listing; 
	    $(".listings").show();
		$(".js-list1").show();
		$(".js-list2").hide();
		$(".js-list3").hide();

		//store listing and pass to saveData(); 
		var myListing = $(".listing1").text();
		myListing = $.trim(myListing);
		saveData(form1, myListing);
		copyTextToClipboard(myListing);

		$(".btn-reset").show();
		$(".share").show();
		$(".eliza").show();

	    //change the h1 message
	   	var message = document.querySelector(".message").innerHTML = "How about this little gem?";	   	
	};

	var createListing2 = function(){

  		var dir = $("#direction option:selected" ).text();
		var landmark = $("#landmark :selected").text();

		$(".firstName").empty().append($("input.firstName").val());
		$(".num5").empty().append($("input.num5").val());
		$(".adj3").empty().append($("input.adj3").val());
		$(".num2").empty().append($("input.num2").val());
		$(".num3").empty().append($("input.num3").val());
		$(".num4").empty().append($("input.num4").val());
		$(".emotion").empty().append($("input.emotion").val());
		$(".direction").empty().append(dir);
		$(".room").empty().append($("input.room").val());
		$(".adj4").empty().append($("input.adj4").val());
		$(".pubInst").empty().append($("input.pubInst").val());
		$(".favCity").empty().append($("input.favCity").val());
		$(".landmark").empty().append(landmark);

		//dave data to JSON
		var form2 = $('#questions2');

		// hide the questions
		$(".q2").hide();

		 //jump to top of page
	    $(window).scrollTop(0);

		//	show the listing
		$(".listings").show();
		$(".js-list1").hide();
		$(".js-list2").show();
		$(".js-list3").hide();

		//store listing and pass to saveData();
		var myListing = $(".listing2").text();
		myListing = $.trim(myListing);
		saveData(form2, myListing);
		copyTextToClipboard(myListing);

		$(".btn-reset").show();	
		$(".share").show();
		$(".eliza").show(); 

	    //change the h1 message
	   	var message = document.querySelector(".message").innerHTML = "This one says YOU all over it!";
	};

	var createListing3 = function(){

		var time = $("#time option:selected" ).text();

		$(".firstName").empty().append($("input.firstName").val());
		$(".num6").empty().append($("input.num6").val());
		$(".num7").empty().append($("input.num7").val());
		$(".disaster").empty().append($("input.disaster").val());
		$(".clothing").empty().append($("input.clothing").val());
		$(".mood").empty().append($("input.mood").val());
		$(".adj6").empty().append($("input.adj6").val());
		$(".adj7").empty().append($("input.adj7").val());
		$(".urban").empty().append($("input.urban").val());
		$(".room2").empty().append($("input.room2").val());
		$(".verb2").empty().append($("input.verb2").val());
		$(".time").empty().append(time);
		$(".pluAnimals").empty().append($("input.pluAnimals").val());
		$(".verb3").empty().append($("input.verb3").val());	

		//dave data to JSON
		var form3 = $('#questions3');
		
		// hide the questions
		$(".q3").hide();

		 //jump to top of page
	    $(window).scrollTop(0);

		//show the listing
		$(".listings").show();
		$(".js-list1").hide();
		$(".js-list2").hide();
		$(".js-list3").show();

		//store listing and pass to saveData();
		var myListing = $(".listing3").text();
		myListing = $.trim(myListing);
		saveData(form3, myListing);
		copyTextToClipboard(myListing);
	
		$(".btn-reset").show();
		$(".share").show();
		$(".eliza").show();

		var message = document.querySelector(".message").innerHTML = "Bring your toolbox!";
	};

	//-------  SHARE LISTING ON FACEBOOK OR TWITTER -------------------------//
 
	// source: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
	function copyTextToClipboard(text) {
		var textToCopy = text;
  		var textArea = document.createElement("textarea");

		// Place in top-left corner of screen regardless of scroll position.
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		// Ensure it has a small width and height. Setting to 1px / 1em
		// doesn't work as this gives a negative w/h on some browsers.
		textArea.style.width = '2em';
		textArea.style.height = '2em';

		// We don't need padding, reducing the size if it does flash render.
		textArea.style.padding = 0;

		// Clean up any borders.
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';

		// Avoid flash of white box if rendered for any reason.
		textArea.style.background = 'transparent';
		textArea.value = textToCopy;

		document.body.appendChild(textArea);

		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			// console.log('Copying text command was ' + msg);
		} catch (err) {
			// console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
	}

	//-------  HASH CHANGE EVENTS -------------------------//
	$(window).on('hashchange', function(e) {
		var currentHash = window.location.hash;
		var formToSave;
		if(currentHash === '#q1') {
			$(".q1").show(); 
	 		$(".q2").hide();
			$(".q3").hide();
			$('body').css({
				"background-image" : "url('img/tablebeast-sm.jpg')"
			});
			$(".listings").hide();
		}
		if(currentHash === '#q2') {
			$(".q2").show();
	 		$(".q1").hide();  
	 		$(".q3").hide();
	 		$('body').css({
				"background-image" : "url('img/couches-sm.jpg')"
			});
			$(".listings").hide();
		}
		if(currentHash === '#q3') {
			$(".q3").show();
	 		$(".q1").hide(); 
	 		$(".q2").hide();
	 		$('body').css({
				"background-image" : "url('img/seam2-sm.jpg')"
			});
			$(".listings").hide();				
		}
		if(currentHash === '#listing1' ) {
			createListing1();						
		}
		if(currentHash === '#listing2' ) {
			createListing2();
		}
		if(currentHash === '#listing3' ) {
			createListing3();								
		}
	});

	//validates that name is entered, chooses questionnaire
	$('#name').on('submit', function(e){
		e.preventDefault();
		// if passes
		if (validateName()) {
			//clear input values
			$(".js-input").val("");
			pickForm();
		} else {
			return false;
		}
	});
	
	//assemble listing only if form is valid------------//
	$("#btn-submit1").click(function(e) {
		e.preventDefault();
		if(!validateForm()) {
			$('#btn-submit1').next().text('\*Please correct the errors, THEN call the movers.');
			console.log('form is not valid');
			return false;
		} else {
			$('#btn-submit1').next().text('');
			window.location.hash = '#listing1';
			console.log('form is valid');				
		}	 
	});

	$("#btn-submit2").click(function(e) {
		e.preventDefault();
		if(!validateForm()) {
			$('#btn-submit2').next().text('\*Please correct the errors, THEN start packing.');
			console.log('form is not valid');
			return false;
		} else {
			$('#btn-submit2').next().text('');
			window.location.hash = '#listing2';
			console.log('form is valid');					   		
		}
	});
	
	$("#btn-submit3").click(function(e) {
		e.preventDefault();
		if(!validateForm()) {
			$('#btn-submit3').next().text('\*Please correct the errors, THEN call the bank.');
			console.log('form is not valid');
			return false;
		} else {
			$('#btn-submit3').next().text('');
			window.location.hash = '#listing3';
			console.log('form is valid');
		}
	});

	$('.js-copy-listing').click(function(e) {
		e.preventDefault();
		var textToCopy = $('.listings > :visible');
		textToCopy = textToCopy[0];
		textToCopy = $.trim($(textToCopy).text());
	  	copyTextToClipboard(textToCopy);

	});

	//  MODAL: ABOUT --------------------------------//
	var modal = function(state) {
		if(state === 'open') {
			$('.modal-container').fadeIn(function(){
				$('body').addClass('modal-on'); 
			});
		} 
		else {
			$('.modal-container').fadeOut(function(){
				$('body').removeClass('modal-on');
			});
		}	
	};
	//open the modal
	$('.js-modal-open').on('click', function(event) {
		event.preventDefault();
		modal('open');
	});

	//close the modal
	$('.close').on('click', function(event){
		event.preventDefault();
		modal('close');
	});

    //	UPDATE COPYRIGHT yearly------------------------------//

    var date = new Date();
    var year = date.getFullYear();
    var copyright = $('p.copyright').text();
    var copyrightNotice = '© ' + year + ' Amy Eckert';
    $('p.copyright').html(copyrightNotice);

});	
