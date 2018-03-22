/* 

TODO:
- poder fijar al principio la duración del ejercicio

- penalización por repetir palabras (x2 si es en la misma frase)

	pensar en el diseño de la notificación de penalización para que el usuario se dé cuenta pero no pierda el flujo de escritura

- imprimir resultados al final: tiempo, kpm, wpm, frases, penalización

- registrar los ejercicios (tanto los contadores como el texto) durante la sesión

- ofrecer la opción de guardarlos después

*/

var beginTime,
	started = false,
	stroken = 0,
	writtenWords = 0,
	current;

writing.addEventListener( 'click', function(){

	if (writing.innerText=='haz click aquí para empezar a escribir') {
		writing.contentEditable = true;
		writing.innerText = '';
	}

	if( !started ){

		started = true;
		stroken = 0;
		beginTime = Date.now();
	}

});

writing.addEventListener( 'keydown', function(e){

	if( !started ){

		started = true;
		beginTime = Date.now();
	}

	reset.style.display = 'block';
	explain_intro.style.display = 'block';
	++stroken;

	if( e.keyCode === 13 ){ // return key

		writtenWords += writing.innerText.match(/(\w+)/g).length;
		written.style.display = 'block';
		written.innerText += writing.innerText + '\r\n';
		writing.innerText = '';
		e.preventDefault();
	} else if( e.keyCode === 8 ) --stroken; // delete
});

var interval = window.setInterval( function(){
	
	if( started ){

		var span = ( Date.now() - beginTime )
				min = span / 60000;

		kpm.innerText = ( stroken / min ) | 0; // | 0: convert anything to integer
		if (writing.innerText.trim() == '') {
			words = writtenWords;
		} else {
			words = writing.innerText.match(/(\w+)/g).length + writtenWords; //regex: \w+ between one and unlimited word characters, /g greedy - don't stop after the first match
		}
		wpm.innerText = ( words / min ) | 0;
		sec = ( span % 60000 ) / 1000;
		time.innerText = ( min | 0 ) + ':' + ( sec | 0 ).toString().padStart(2, "0");
	}
}, 50 );

reset.addEventListener( 'click', function(){

	writing.innerText = '';
	written.innerText = '';

	started = false;
	written.style.display = 'none';
	reset.style.display = 'none';
	explain_intro.style.display = 'none';
	kpm.innerText = 0;
	wpm.innerText = 0;
	time.innerText = '0:00';

	writing.focus();
	stroken = 0;
});