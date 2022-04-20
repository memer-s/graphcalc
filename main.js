const canvas = document.createElement("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let isDragging;
let mousePos = [0,0];
canvas.addEventListener("mousedown", (e) => {
	// console.log(e);
	isDragging = true;
})

canvas.addEventListener("mouseup", () => {
	isDragging = false;
})

canvas.addEventListener("mousemove", (e) => {
	if(isDragging) {
		xOffset += (e.pageX - mousePos[0]);
		yOffset += (e.pageY - mousePos[1]) / zoom[1];
		// console.log(xOffset);
		functionHandler()
	}
	mousePos[0] = e.pageX;
	mousePos[1] = e.pageY;
})

let zoom = [1,1];

canvas.addEventListener("wheel", (e) => {
	if(e.deltaY < 0) {
		zoom[0] *= 1.07
		zoom[1] *= 1.07
	}
	else {
		zoom[0] *= 0.97
		zoom[1] *= 0.97
	}
	document.getElementById("zoom").innerText = zoom
	functionHandler()
})

document.body.appendChild(canvas)

window.addEventListener("resize", () => {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	ctx.lineWidth = 4;
	functionHandler();
})

let functionInput = document.getElementById("function")
functionInput.addEventListener("input", functionHandler)


function functionHandler() {
	let terms = [];
	let functionTerms = functionInput.value; // I am a genius
	let result = 0;

	let splitString = functionTerms.replaceAll("+", "|")
	splitString = splitString.replaceAll("-", "|-")
	// console.log(splitString);
	let split = splitString.split("|");
	renderFunction(split, 1, zoom)

	for(let i = 0; i < split.length; i++) {
		terms.push(parseFloat(split[i]) ? parseFloat(split[i]) : 0);
	}	
	
	for(let i = 0; i < terms.length; i++) {
		result += parseFloat(terms[i]);
	}
	
	// console.log(result, terms);
	document.getElementById("result").innerText = "Result x = 1: "+result.toString()+",\n xOffset: "+xOffset+",\n yOffset: "+yOffset;
}
// Divide the input into terms, split by -, and +.

let ctx = canvas.getContext("2d");
ctx.lineWidth = 3

let xOffset = canvas.width/2;
let yOffset = 0;

function renderGrid() {
	ctx.beginPath()
	ctx.lineWidth = 1
	ctx.moveTo(0,((canvas.height/2)+yOffset)*zoom[1])
	ctx.lineTo(canvas.width, ((canvas.height/2)+yOffset)*zoom[1])
	ctx.moveTo(xOffset,0)
	ctx.lineTo(xOffset,canvas.height)
	ctx.moveTo(0,0)
	ctx.stroke()
	ctx.lineWidth = 4
}

function contains(token, string) {
	return (string == string.toString().replaceAll(token,"#") ? false : true)
}

function getCoefficients(funcSplit, x) {
	return (funcSplit[0] ? parseFloat(funcSplit[0]) : 1) * x * (funcSplit[1] ? parseFloat(funcSplit[1]) : 1);
}

function calculateY(x, func) {
	
	if(contains("sin ", func)) {
		funcSplit = func.split('sin x');
		return getCoefficients(funcSplit, Math.sin(x))
	}
	
	if(contains("x", func)) {
		funcSplit = func.split('x');
		return getCoefficients(funcSplit, x)
	}

	return x;
	// return x * parseFloat(funcSplit[0]);
	
	
}

function getYVal(x, functions) {
	let result = 0;
	for(let i = 0; i < functions.length; i++) {
		let func = functions[i];
		result += calculateY(x, functions[i])
	}
	return - result + yOffset + canvas.height/2
}

function renderFunction(func, accuracy) {
	// Init path and move to -10 and y/2
	ctx.beginPath()
	ctx.clearRect(0,0,canvas.width, canvas.height)
	// console.log("func", func);

	// X variable to be rendered
	// let x = -window.innerWidth/2+xOffset;

	// for(let i = 0; i < canvas.width/accuracy+1; i++) {
	// 	// Y variable to be rendered
	// 	let y = 0-(yOffset);
	// 	x += accuracy - xOffset
	// 	for(let j = 0; j < func.length; j++) {
	// 		if(func[j] != func[j].toString().replace('x', '$')) {
	// 			if(func[j] == "0x" || func[j] == "x") {
	// 				y += x*x
	// 			}
	// 			else {
	// 				y += parseFloat(func[j]) * x
	// 			}
	// 			// console.log(func[j], x);
	// 		}
	// 		else {
	// 			y += parseFloat(func[j]);
	// 		}
	// 	}
	// 	ctx.lineTo(x + canvas.width/2, -y/2 + (canvas.height/2))
	// }

	for (let i = 0; i < canvas.width + 2; i++) {
		ctx.lineTo(i, getYVal((i-xOffset)/zoom[1], func)*zoom[1]);
	}

	ctx.stroke()
	renderGrid()
}

