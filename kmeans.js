var dataset = [];
var k = 0;
var lastBelongs = [];
function start() {
	k = parseInt(document.getElementById("k").value);
	var center = [];
	for (var i = 0; i < k; i++) {
		center[i] = dataset[i];
	}
	while(true) {
		var newCenter = kmeans(center);
		var flag = true;
		for(var i = 0; i < k; i ++) {
			if (getDistance(center[i],newCenter[i]) > 0.0001) {
				flag = false;
				break;
			}
		}
		center = newCenter;
		if (flag) {
			break;
		}
	}

	console.log(newCenter);
	console.log(lastBelongs);

	var clusters = [];
	for (var i = 0; i < dataset.length; i++) {
		if (clusters[lastBelongs[i]] == undefined) {
			clusters[lastBelongs[i]] = [];
		}
		clusters[lastBelongs[i]].push(dataset[i]);	
	}
	console.log(clusters);
	var mySeries = [];
	for (var i = 0; i < clusters.length; i++) {
		var oneSerie = {
			type: 'scatter',
			name: 'cluster ' + i,
			data: clusters[i],
			marker: {
                	radius: 3
            }
		}
		mySeries.push(oneSerie);
	}
	var oneSerie = {
			type: 'scatter',
			name: 'center ',
			data: newCenter,
			color: 'red',
			marker: {
                	radius: 6
            }
	};
	mySeries.push(oneSerie);
    drawPoints(mySeries);

    var SSE = calSSE(newCenter,clusters);
    document.getElementById("sse").innerHTML = SSE;
    console.log(SSE);
}

function calSSE(center,clusters) {
	var SSE = 0;
	for (var i = 0; i < clusters.length; i++) {
		for (var j = 0; j < clusters[i].length; j++) {
			SSE += Math.pow(getDistance(clusters[i][j],center[i]),2);
		}
	}
	return SSE;
}

function kmeans(center) {
	var belongs = [];
	var newCenter = [];
	for (var i = 0; i < dataset.length; i++) {
		var oneBelongs = getBelongs(dataset[i],center);
		belongs.push(oneBelongs);
	}
	// console.log(belongs);
	for (var i = 0; i < k; i++) {
		var allValue = [0,0];
		var allCount = 0;
		for (var j = 0; j < dataset.length; j++) {
			if (belongs[j] == i) {
				allCount++;
				allValue[0] += dataset[j][0];
				allValue[1] += dataset[j][1];
			}
		}
		newCenter[i] = [allValue[0]/allCount,allValue[1]/allCount];
		
	}
	lastBelongs = belongs;
	return newCenter;
}

function getBelongs(point,center) {
	var belongs = 0;
	var minDistance = getDistance(point,center[0]);
	for (var i = 1; i < center.length; i++) {
		var distance = getDistance(point,center[i]);
		if (distance < minDistance) {
			belongs = i;
			minDistance =distance;
		}
	}
	return belongs;
}



function getDistance(x,y) {
	return Math.sqrt(Math.pow(x[0]-y[0],2) + Math.pow(x[1]-y[1],2));
}

function loadData() {
	dataset = [];
	lastBelongs = [];

	var file = document.getElementById("dataset").files[0];
	var reader = new FileReader();  
    reader.onload = function() {  
        var content = this.result.split("\n");
        for (var i = 0; i < content.length; i++) {
        	if (content[i] == "") {
        		continue;
        	}
        	var oneRow = content[i].split(",");
        	dataset.push([Number(oneRow[0]),Number(oneRow[1])]);
        };
        
    };  
    reader.readAsText(file); 
}


function drawPoints(mySeries) {
	$(function () {
    	$('#container').highcharts({
        	
        	title: {
            	text: 'kmeans with k=' + k 
        	},
        	series: mySeries
   		});
	});

}