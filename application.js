/* 

TODO:
- penalización por repetir palabras (x2 si es en la misma frase)

	!!--> pensar en el diseño de la notificación de penalización
	para que el usuario se dé cuenta pero no pierda el flujo de escritura

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
	duration = 60, //in seconds
	started = false,
	ended = false;

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
		//calcPenalty();
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
	//calcPenalty();

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
		//time.innerText = ( mins | 0 ) + ':' + ( secs | 0 ).toString().padStart(2, "0");
		if (Math.floor(span / 1000) >= duration) {
			time.style.color = 'red';
			ended = true;
			window.alert('time = '+time.innerText+
				'\nkpm = '+kpm.innerText+', wpm = '+wpm.innerText+
				'\nsentences = '+sentences+', penalty for repeated words = '+penalty);
		}
	}
}, 100 );

function calcPenalty() {
	//TODO: check repeated words (x2 if it's repeated in the same sentence)

	penalty = 0;
	parsedWriting = writing.innerText.split(' ');

	for(i=0;i<=parsedWriting.length;i++) {
		if (parsedWritten.indexOf(parsedWriting[i])) { //FIX: condition not working properly
			penalty += -1;
			window.alert('parsedWriting['+i+']='+parsedWriting[i]); //DEBUGGING
		}
	}

	parsedWritten = parsedWritten.concat(parsedWriting);

	pen.innerText = penalty;
	
	if (penalty<0) {
		pen.style.color = 'darkred';
	} else {
		pen.style.color = '';
	}
}