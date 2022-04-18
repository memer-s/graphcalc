const canvas = document.createElement("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let isDragging;
let mousePos = [0,0];
canvas.addEventListener("mousedown", (e) => {
	console.log(e);
	isDragging = true;
})

canvas.addEventListener("mouseup", () => {
	isDragging = false;
})

canvas.addEventListener("mousemove", (e) => {
	if(isDragging) {
		xOffset += e.pageX - mousePos[0];
		yOffset += e.pageY - mousePos[1];
		console.log(xOffset);
		functionHandler()
	}
	mousePos[0] = e.pageX;
	mousePos[1] = e.pageY;
})

let zoom = 2;

canvas.addEventListener("wheel", (e) => {
	if(e.deltaY < 0) {
		zoom *= 1.1
	}
	else {
		zoom *= 0.9
	}
	document.getElementById("zoom").innerText = zoom
	functionHandler()
})

document.body.appendChild(canvas)

window.addEventListener("resize", () => {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	console.log("sd");
	ctx.lineWidth = 4
	functionHandler()
})

let functionInput = document.getElementById("function")
functionInput.addEventListener("input", functionHandler)


function functionHandler() {
	let terms = []
	let functionTerms = "0"+functionInput.value; // I am a genius
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
	document.getElementById("result").innerText = "Result: "+result.toString()
}
// Divide the input into terms, split by -, and +.

let ctx = canvas.getContext("2d");
ctx.lineWidth = 3

let xOffset = 0;
let yOffset = 0;

function renderGrid() {
	ctx.beginPath()
	ctx.lineWidth = 1
	ctx.moveTo(0,(canvas.height/2)+yOffset)
	ctx.lineTo(canvas.width, (canvas.height/2)+yOffset)
	ctx.moveTo(canvas.width/2+xOffset,0)
	ctx.lineTo(canvas.width/2+xOffset,canvas.height)
	ctx.moveTo(0,0)
	ctx.stroke()
	ctx.lineWidth = 4
}

function renderFunction(func, accuracy) {
	ctx.beginPath()
	ctx.moveTo(-10,window.innerHeight/2);
	ctx.clearRect(0,0,canvas.width, canvas.height)
	console.log("func", func);
	let x = -window.innerWidth/2-xOffset;
	for(let i = 0; i < canvas.width/accuracy+1; i++) {
		let y = 0-(yOffset*zoom);
		x += accuracy / zoom
		for(let j = 0; j < func.length; j++) {
			if(func[j] != func[j].toString().replace('x', '$')) {
				if(func[j] == "0x" || func[j] == "x") {
					y += x*x
				}
				else {
					y += parseFloat(func[j]) * x
				}
				// console.log(func[j], x);
			}
			else {
				y += parseFloat(func[j]);
			}
			y *= 1/zoom
		}
		ctx.lineTo(x/zoom+canvas.width/2, -y + (canvas.height/2))
	}
	ctx.stroke()
	renderGrid()
}

