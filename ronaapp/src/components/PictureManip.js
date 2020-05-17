import React from 'react';
var wizardry = require('wizardry');
var task = require('./imageTask.json');

function Compress(){
	wizardry(['./Pallet.png'], task, console.log("done"));
	console.log("Called Test");
	return(
		<div>
			Text
		</div>
	);
}

export default Compress;