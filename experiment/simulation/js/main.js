document.addEventListener('DOMContentLoaded', function() {

	const playButton = document.getElementById('play');
	const pauseButton = document.getElementById('pause');
	const restartButton = document.getElementById('restart');

	let displacement = 50;
	let height = 15;
	let time = 2 * Math.PI * Math.sqrt(15 / 9.8) * 1000;
	let mass = 600;

	// slider for initial angle
	const slider_dis = document.getElementById("displacement");
	const output_dis = document.getElementById("id_dis");
	output_dis.innerHTML = slider_dis.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_dis.oninput = function() {
		output_dis.innerHTML = this.value;
		updatePara();
	};


	// slider for length of pendulum
	const slider_len = document.getElementById("height");
	const output_len = document.getElementById("id_len");
	output_len.innerHTML = slider_len.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_len.oninput = function() {
		output_len.innerHTML = this.value;
		updatePara();
	};


	// slider for mass of bob
	const slider_mass = document.getElementById("mass");
	const output_mass = document.getElementById("id_mass");
	output_mass.innerHTML = slider_mass.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider_mass.oninput = function() {
		output_mass.innerHTML = this.value;
		updatePara();
	};

	let myAnimation = anime({
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

	function updatePara()
	{
		displacement = document.getElementById("displacement").value;
		height = document.getElementById("height").value;
		mass = document.getElementById("mass").value;

		const rod_css = document.querySelector("#rod");
		const ball_css = document.querySelector("#ball");

		rod_css.style.height = height + "em";
		ball_css.style.height = mass / 300 + "em" ;
		ball_css.style.width = mass / 300 + "em" ;
		ball_css.style.left = mass / (-600) + "em" ;

		time = 2 * Math.PI * Math.sqrt((height) / 9.8) * 1000;
		drawDisGraph();
		drawLenGraph();

		anime.remove(myAnimation);
		myAnimation = anime({
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
	}

	function drawDisGraph() {
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

				width: 250,
				height: 250,

				xaxis: {
					title: {
						text: 'Time(s)',
						font: {
							family: 'Courier New, monospace',
							size: 10,
							color: '#000000'
						}
					},
				},
				yaxis: {
					title: {
						text: 'Angular Displacement(Deg)',
						font: {
							family: 'Courier New, monospace',
							size: 10,
							color: '#000000'
						}
					}
				}
			};

			const config = {responsive: true};
			Plotly.newPlot('disPlot', data, layout, config);
		}

		catch (err) {
			console.error(err);
			alert(err);
		}
	}

	drawDisGraph();

	function drawLenGraph() {
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
				width: 250,
				height: 250,
				xaxis: {
					title: {
						text: 'Length(m)',
						font: {
							family: 'Courier New, monospace',
							size: 10,
							color: '#000000'
						}
					},
				},
				yaxis: {
					title: {
						text: 'Time Period (s)',
						font: {
							family: 'Courier New, monospace',
							size: 10,
							color: '#000000'
						}
					}
				}
			};

			const config = {responsive: true};
			const data = [trace1];
			Plotly.newPlot('lenPlot', data,layout,config);
		}

		catch (err) {
			console.error(err);
			alert(err);
		}
	}

	drawLenGraph();
})

function openGraph(evt, graphName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("graphcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(graphName).style.display = "block";
  evt.currentTarget.className += " active";
}
