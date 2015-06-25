// debugger;



var totalw = 800

var w = 400;
var leftPadding = 30;
var rightPadding = 30;

var uw = w - leftPadding - rightPadding
var iterations = uw / 2;

var topPadding = 10;
var bottomPadding = 25;

var uh = uw/2;
var h = topPadding + bottomPadding + uh;

var top2 = uh + topPadding + bottomPadding;
var bottom2 = 1.5 * uh + topPadding + bottomPadding;  


var svg = d3.select("#mainGraph")
			.append("svg")
			.attr("width", w)
   			.attr("height", 1.5 * h + topPadding);




$(document).ready(function(){
  
	$("#sliderSpot").slider({
		min: 1,
  		max: 200,
  		step: 1,
  		value: 100,
  		change:function(){update();}
		});

	$("#sliderStrike").slider({
		min: 1,
  		max: 200,
  		step: 1,
  		value: 100,
  		change:function(){update();}
		});

	$("#sliderMaturity").slider({
		min: 0,
  		max: 5,
  		step: 0.1,
  		value: 2.5,
  		change:function(){update();}
		});

	$("#sliderR1").slider({
		min: -0.1,
  		max: 0.1,
  		step: 0.005,
  		value: 0.0,
  		change:function(){update();}
		});

  $("#sliderR2").slider({
    min: -0.1,
      max: 0.1,
      step: 0.005,
      value: 0.0,
      change:function(){update();}
    });

	$("#sliderVol").slider({
		min: 0.05,
  		max: 0.5,
  		step: 0.01,
  		value: 0.4,
  		change:function(){update();}
		});

//	update();
	setTimeout(update,10);



	$('.article').click(function(){
		console.log('hop');
        $('.article').removeClass('current');
        $('.description').hide();
        
        $(this).addClass('current');
        $(this).children('.description').show();
        
        });
    
    $(document).keypress(function(event){
        if(event.which===111) {
            $('.current').children('.description').toggle();
        }
        else if(event.which===110) {
               var currentArticle = $(".current");
               var nextArticle = currentArticle.next();
               $(currentArticle).removeClass("current");
               $(nextArticle).addClass("current");
        }
        });
    

});

var main = function(){
    
    };

var callPremium, putPremium, callDelta, putDelta, spotForward; 

function update(){

	Spot=$("#sliderSpot").slider("value");
	Strike=$("#sliderStrike").slider("value");
	Mat=$("#sliderMaturity").slider("value");
	R1=$("#sliderR1").slider("value");
  R2=$("#sliderR2").slider("value");
	Vol=$("#sliderVol").slider("value");

  Drift = R1 - R2;

  spotForward = Forward(Spot, Mat, Drift);

  callPremium = BlackScholes("c", Spot, Strike, Mat, Drift, Vol, R2);

	putPremium = BlackScholes("p", Spot, Strike, Mat, Drift, Vol, R2);

	callDelta = Delta("c", Spot, Strike, Mat, Drift, Vol);

	putDelta = Delta("p", Spot, Strike, Mat, Drift, Vol);	

  
  $("#Drift span").html(Math.round(10000*Drift)/100);
  $("#spotForward span").html(Math.round(100*spotForward)/100);
	$("#Strike span").html(Strike);
	$("#Maturity span").html(Mat);
	$("#R1 span").html(100 * R1);
	$("#R2 span").html(100 * R2);
  $("#Volatility span").html(100*Vol);
	$("#Spot span").html(Spot);

	$("#callPremium span").html(Math.round(callPremium*100)/100);
  $("#callPremiumPct span").html(Math.round(callPremium/Spot*10000)/100);
	$("#putPremium span").html(Math.round(putPremium*100)/100);
	$("#putPremiumPct span").html(Math.round(putPremium/Spot*10000)/100);

  $("#callDelta span").html(Math.round(callDelta*10000)/10000);
	$("#putDelta span").html(Math.round(putDelta*10000)/10000);

	xScale.domain([0, 2 * Strike]);
	yScale.domain([Strike, 0]);
	yScale2.domain([1, 0]);

	callCurve(Strike, Mat, Drift, Vol);
  
	plot();


}

var Spot=0.0;
var Strike=0.0;
var Mat=0.0;
var Drift=0.0;
var Vol=0.0;

var xScale = d3.scale.linear().range([0, uw]);
var yScale = d3.scale.linear().range([0, uh]);
var yScale2 = d3.scale.linear().range([0, uh/2]);
var circle_a, circle_temoin, tang;

svg.append("line")
  .attr("x1", uw/2 + leftPadding)
  .attr("y1", uh + topPadding)
  .attr("x2", uw + leftPadding)
  .attr("y2", topPadding)
  .attr("stroke-width", 1)
    .attr("stroke", "grey");

function plot(){
	    
	circle_a = svg.selectAll(".a").data(callLineData);
  circle_b = svg.selectAll(".b").data(callLineData);
	circle_temoin = svg.selectAll(".temoin");
  tang = svg.selectAll(".lineTemoin");

;

    circle_a.enter()
        .append("circle")
        .attr("class", 'a')
        .attr("r", 1)
        .attr("cx", function(d) {return d[0];})
        .attr("cy", function(d) {return d[1];})
        .append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
        ;

        //update
    circle_a
    	.transition(200).delay(100)
        .attr("r", 1)
        .attr("cx", function(d) {return d[0];})
        .attr("cy", function(d) {return d[1];})
        //.append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
        ;

        circle_a.exit().remove();


var xAxis1 = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom");
    
    svg.selectAll("g").remove();
    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(" + leftPadding + "," + (uh + topPadding) + ")")
        .call(xAxis1);

var yAxis1 = d3.svg.axis()
              .scale(yScale)
              .orient("left");

   
    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(" + leftPadding + ", " + topPadding + ")")
        .call(yAxis1);    

var xAxis2 = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");
    
    svg.append("g")
        .attr("class","axis")
       .attr("transform", "translate(" + leftPadding  + "," + bottom2 + ")")
         //     .attr("transform", "translate(" + leftPadding + 300 + "," + (uh + topPadding) + ")")
        .call(xAxis2);

var yAxis2 = d3.svg.axis()
              .scale(yScale2)
              .orient("left")
              .ticks(4);

   
    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(" + (leftPadding) + ", " + (uh + topPadding + bottomPadding) + ")")
        .call(yAxis2);


	bar = svg.selectAll("rect").data(callLineData);

    bar.enter()
        .append("rect")
        .attr("class", "bar1")
     	.attr("x", function(d) {return d[0]})
        .attr("width", 1)
       	.attr("y", function(d) {return (top2 + d[2]);})
        .attr("height", function(d) {return uh/2 - d[2];})
//        .attr("height", function(d) {return d[3];} )
    //    .append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
        ;

        //update
    bar
    	.transition(1000).delay(200)
    	.attr("x", function(d) {return d[0] })
      .attr('height', function(d) {return uh/2 - d[2];})
      .attr("width",1)
      .attr("y", function (d) {return (top2 + d[2]);})
        //.append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
        ;

    bar.exit().remove();

var ySpot = BlackScholes("c", Spot, Strike, Mat, Drift, Vol);
var zSpot = Math.max(0, Spot - Strike);

    svg.append("rect")
        .attr("class","rectTemoin")
        .attr("x", xScale(Spot) + leftPadding - 1)
        //.attr("y", 150)
       .attr("height", uh/2 - yScale2(callDelta))
            .attr("width",2)
        .attr("y", (top2 + yScale2(callDelta)));
  //      .attr("height", yScale(100))
    

  svg.append("circle")
       .attr("class", 'temoin')
       .attr("r", 3)
      .attr("cx", leftPadding + xScale(Spot))
      .attr("cy", topPadding + yScale(callPremium))
      //.attr("cy", topPadding + yScale(BlackScholes("c", Spot, Strike, Mat, Drift, Vol)))
//  .append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
      ;

  circle_temoin
      .transition(200).delay(100)
      .attr("r", 3)
      .attr("cx", leftPadding + xScale(Spot))
      .attr("cy", topPadding + yScale(callPremium))
  //    .attr("cy", topPadding + yScale(BlackScholes("c", Spot, Strike, Mat, Drift, Vol)))
//  .append("title").text(function(d,i){return i+":"+d[0]+"x"+d[1];});
      ; 


  svg.append("line")
    .attr("class","lineTemoin")
    .attr("x1", leftPadding + xScale(Spot) - 40)    
    .attr("y1", topPadding + yScale(callPremium) + 40 * callDelta)
    .attr("x2", leftPadding + xScale(Spot) + 40)    
    .attr("y2", topPadding + yScale(callPremium) - 40 * callDelta);

  tang
      .transition(200).delay(100)
    .attr("x1", leftPadding + xScale(Spot) - 40)    
    .attr("y1", topPadding + yScale(callPremium)  + 40 * callDelta )
    .attr("x2", leftPadding + xScale(Spot) + 40)    
    .attr("y2", topPadding + yScale(callPremium) - 40 * callDelta);


}

svg.append("text").text("Pay-out and Option Value").attr("x",leftPadding*2).attr('y',20 + topPadding);
svg.append("text").text("Delta").attr("x",leftPadding*2).attr('y',20 + topPadding + bottomPadding + uh);





var callLineData = [];

function callCurve(K, T, r, v){
	callSpotData = [];
  callLineData = [];
  	// var path = Math.round(100* K / uw)/100;
	// console.log(K, T, r, v, Strike);	
	for (var i = 0; i < uw ; i +=2) {           				
	    var x = i  * 2 *  K / uw;
	    var y = BlackScholes("c", x, K, T, r, v, R2);  
	   // var z = Math.max(0, x - K);
	   // var optionvalue = y - z;
      var delta = Delta("c", x, K, T, r, v);
	  //  var highlight = function(t){if (Math.round(t)==Spot) {return 1} else {return 0}};
	  
	  //console.log( Math.round(x), y, optionvalue, highlight(x));
      console.log(delta, yScale2(1 - delta), (1.5 * uh + + bottomPadding + topPadding)-yScale2(1 - delta)) ;
	    callLineData.push([xScale(x) + leftPadding, yScale(y) + topPadding, yScale2(delta)]);
	};

  
 
	
  return callLineData;

}	






