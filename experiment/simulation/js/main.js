document.addEventListener('DOMContentLoaded', function() {

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');
	const progress = document.getElementById('submit');

	let displacement = 50;
	let height = 15;
	let time = 2 * Math.PI * Math.sqrt(15 / 9.8) * 1000;
	let mass = 600;

	// slider for initial angle
	const slider_dis = document.getElementById("displacement");
	const output_dis = document.getElementById("demo_dis");
	output_dis.innerHTML = slider_dis.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_dis.oninput = function() {
		output_dis.innerHTML = this.value;
	};


	// slider for length of pendulum
	const slider_len = document.getElementById("height");
	const output_len = document.getElementById("demo_len");
	output_len.innerHTML = slider_len.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_len.oninput = function() {
		output_len.innerHTML = this.value;
	};


	// slider for mass of bob
	const slider_mass = document.getElementById("mass");
	const output_mass = document.getElementById("demo_mass");
	output_mass.innerHTML = slider_mass.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_mass.oninput = function() {
		output_mass.innerHTML = this.value;
	};

	const myAnimation = anime({
		targets: '#rod',
		rotate: [displacement, -1 * displacement],
		duration: function(){
			return time;
		},
		easing: 'easeInOutSine',
		direction: 'alternate',
		loop: true,
	});   

	playButton.addEventListener('click', function() { myAnimation.play(); });
	pauseButton.addEventListener('click', function() { myAnimation.pause(); });
	restartButton.addEventListener('click', function() { myAnimation.restart(); });
	progress.addEventListener('click', function() { updatePara() });

	function updatePara()
	{
		displacement = document.getElementById("displacement").value;
		height = document.getElementById("height").value;
		mass = document.getElementById("mass").value;

		const myElement = document.querySelector("#rod");
		const myElement1 = document.querySelector("#ball");

		myElement.style.height = height + "em";
		myElement1.style.height = mass / 300 + "em" ;
		myElement1.style.width = mass / 300 + "em" ;
		myElement1.style.left = mass / (-600) + "em" ;

		time = 2 * Math.PI * Math.sqrt((height) / 9.8) * 1000;
		draw();
		draw2();

		anime.remove(myAnimation);
		const myAnimation2 = anime({
			targets: '#rod',
			rotate: [displacement, -1 * displacement],
			duration: function(){
				return time;
			},
			easing: 'easeInOutSine',
			direction: 'alternate',
			loop: true,
		});

		playButton.addEventListener('click', function() { myAnimation2.play(); });
		pauseButton.addEventListener('click', function() { myAnimation2.pause(); });
		restartButton.addEventListener('click', function() { myAnimation2.restart(); });
	}

	function draw() {
		try {
			// compile the expression once
			const omega = Math.sqrt(9.8 / height);
			const expression = String(displacement) + "*cos(" + String(omega) + "x)";
			const expr = math.compile(expression);

			// evaluate the expression repeatedly for different values of x
			const xValues = math.range(0, 10, 0.1).toArray();
			const yValues = xValues.map(function (x) {
				return expr.evaluate({x: x});
			});

			// render the plot using plotly
			const trace1 = {
				x: xValues,
				y: yValues,
				type: 'scatter'
			};

			const data = [trace1];
			const layout = {
				// title: {
				//   text:'Plot Title',
				//   font: {
				//     family: 'Courier New, monospace',
				//     size: 24
				//   },
				//   xref: 'paper',
				//   x: 0.05,
				// },

				width: 500,
				height: 500,

				xaxis: {
					title: {
						text: 'Time(s)',
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					},
				},
				yaxis: {
					title: {
						text: 'Angular Displacement(Deg)',
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					}
				}
			};

			const config = {responsive: true};
			Plotly.newPlot('plot', data, layout, config);
		}

		catch (err) {
			console.error(err);
			alert(err);
		}
	}

	draw();

	function draw2() {
		try {
			// compile the expression once
			const coef = 2 * Math.PI / (math.sqrt(9.8));
			const expression = String(coef) + "*sqrt(x)";
			const expr = math.compile(expression);

			// evaluate the expression repeatedly for different values of x
			const xValues = math.range(0, 10, 0.1).toArray();
			const yValues = xValues.map(function (x) {
				return expr.evaluate({x: x});
			});

			// render the plot using plotly
			const trace1 = {
				x: xValues,
				y: yValues,
				type: 'scatter'
			};

			const layout = {
				width: 500,
				height: 500,
				xaxis: {
					title: {
						text: 'Length(m)',
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					},
				},
				yaxis: {
					title: {
						text: 'Time Period (s)',
						font: {
							family: 'Courier New, monospace',
							size: 18,
							color: '#000000'
						}
					}
				}
			};

			const config = {responsive: true};
			const data = [trace1];
			Plotly.newPlot('plot2', data,layout,config);
		}

		catch (err) {
			console.error(err);
			alert(err);
		}
	}

	draw2();
})
