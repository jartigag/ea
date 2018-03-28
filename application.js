/* 

TODO:

- registrar los ejercicios (tanto los contadores como el texto) durante la sesión

- ofrecer la opción de guardarlos después

*/

var strokes = 0,
	writtenStrokes = 0,
	words = 0,
	writtenWords = 0,
	parsedWritten = [],
	sentences = 0,
	penalty = 0,
	beginTime,
	durationSecs = 120,
	started = false,
	ended = false;

duration.addEventListener( 'click', function(){
	duration.contentEditable = true;
	duration.focus();
});

duration.addEventListener( 'blur', function(){
	duration.contentEditable = false;
	if (parseInt(duration.innerText) < 1200){
		durationSecs = duration.innerText;
	} else {
		window.alert("la duración del ejercicio debe ser un número entero de segundos menor que 1200");
		duration.innerText='120';
	}
});

duration.addEventListener( 'keydown', function(e){
	if( e.keyCode === 13 ){ // return key
		duration.contentEditable = false;
		if (parseInt(duration.innerText) < 1200){
			durationSecs = duration.innerText;
		} else {
			window.alert("la duración del ejercicio debe ser un número entero de segundos menor que 1200");
			duration.innerText='120';
		}
	}
});

writing.addEventListener( 'click', function(){

	if( !started && !ended ){
		started = true;
		strokes = 0;
		beginTime = Date.now();
	}

	if (writing.innerText=='haz click aquí para empezar a escribir') {
		writing.contentEditable = true;
		writing.innerText = '';
		writing.focus();
	}
});

writing.addEventListener( 'keydown', function(e){

	if( !started && !ended ){
		started = true;
		beginTime = Date.now();
	}

	reset.style.display = 'block';
	explain_intro.style.display = 'block';

	if( e.keyCode === 13 ){ // return key
		sentences++;
		writtenStrokes = strokes;
		writtenWords = words;
		strokes = 0;
		words = 0;
		calcPenalty();
		written.style.display = 'block';
		written.innerText += writing.innerText + '\r\n';
		writing.innerText = '';
		e.preventDefault();
	} 
	//else if( e.keyCode === 8 ) --strokes; // delete
});

reset.addEventListener( 'click', function(){

	writing.innerText = '';
	written.innerText = '';
	kpm.innerText = '0';
	wpm.innerText = '0';
	time.innerText = '0:00';

	time.style.color = '';
	written.style.display = 'none';
	reset.style.display = 'none';
	explain_intro.style.display = 'none';

	writtenStrokes = 0;
	writtenWords = 0;
	strokes = 0;
	words = 0;
	sentences = 0;
	parsedWritten = [];
	penalty = 0;
	calcPenalty();

	writing.focus();
	beginTime = Date.now();
	started = true;
	ended = false;
});

var interval = window.setInterval( function(){
	
	if( started && !ended ){
		var span = ( Date.now() - beginTime ),
			mins = span / 60000;

		if (writing.innerText.trim() == '') {
			strokes = writtenStrokes;
			words = writtenWords;
		} else {
			strokes = writing.innerText.length + writtenStrokes;
			words = writing.innerText.match(/(\w+)/g).length + writtenWords;
			//	regex:	\w+ between one and unlimited word characters, 
			//			/g greedy - don't stop after the first match
		}
		kpm.innerText = ( strokes / mins ) | 0; // | 0: convert anything to integer
		wpm.innerText = ( words / mins ) | 0;

		secs = ( span % 60000 ) / 1000;
		time.innerText = ( mins | 0 ) + ':' + ( secs | 0 ).toString().padStart(2, "0");
		if (Math.floor(span / 1000) >= durationSecs) {
			time.style.color = 'red';
			ended = true;
			window.alert('tiempo = '+time.innerText+
				'\npulsaciones/minuto = '+kpm.innerText+
				'\npalabras/minuto = '+wpm.innerText+
				'\nfrases = '+sentences+
				'\npenalización por palabras repetidas = '+penalty);
		}
	}
}, 100 );

function calcPenalty() {

	parsedWriting = writing.innerText.toLowerCase().split(' ');

	repeatedWords = [];

	for (i=0;i<parsedWriting.length;i++) {
		if (parsedWriting[i].length>3) { // only consider words larger than 3 letters
			for (j=i+1;j<parsedWriting.length;j++) {
				if (parsedWriting[j].match(parsedWriting[i])) {msgpen.innerText += parsedWriting[i];
					repeatedWords = repeatedWords.concat(parsedWriting[i]);
					penalty += -2; // penalty for repeating a word in the same sentence
				}	
			}
			if (parsedWritten.length>0) { // exclude first sentence
				if (parsedWritten.indexOf(parsedWriting[i])>-1) {
					repeatedWords = repeatedWords.concat(parsedWriting[i]);
					penalty += -1; // penalty for repeating a word which was written before
				}
			}
		}
	}

	for (i=0; i<parsedWriting.length; i++) {
	  parsedWritten = parsedWritten.concat(parsedWriting[i].toLowerCase());
	}

	//parsedWritten = parsedWritten.concat(parsedWriting.toLowerCase());

	if (repeatedWords.length>0) {
		msgpen.innerText = repeatedWords.join(', ');
	}


	if (pen.innerText==penalty) {    //if penalty doesn't change, hide explanation message
		repeated.style.display = 'none';
		msgpen.innerText = '';
		msgpen.style.display = 'none';
	} else {                         //if it changes, show its new value and explanation message
		pen.innerText = penalty;
		repeated.style.display = 'block';
		msgpen.style.display = 'block';
	}

	if (penalty<0) {
		pen.style.color = 'darkred';
	} else {
		pen.style.color = '';
	}
}