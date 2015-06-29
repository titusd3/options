function CND(x){

var a1, a2, a3, a4 ,a5, k ;

a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;

if(x<0.0)
	{return 1-CND(-x);}
else
	{k = 1.0 / (1.0 + 0.2316419 * x);
	return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI) * k
	* (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;
	}
}

function SND(x){

  return  Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI)
}


function BlackScholes(PutCallFlag, S, K, T, q, r, v) {

var d1, d2;
d1 = (Math.log(S / K) + (r - q + v * v / 2.0) * T) / (v * Math.sqrt(T));
d2 = d1 - v * Math.sqrt(T);

if (PutCallFlag== "c"){
	return Math.exp(-q*T) * S * CND(d1) - Math.exp(-r*T) * K * CND(d2);
	}
else{
	return Math.exp(-r*T) * K * CND(-d2) - Math.exp(-q*T) * S * CND(-d1);
	}
}


function Forward(S, T, q, r){
return S * Math.exp((r-q)*T);
}

function Delta(PutCallFlag, S, K, T, q, r, v) {

var d1, d2;
d1 = (Math.log(S / K) + (r - q + v * v / 2.0) * T) / (v * Math.sqrt(T));
d2 = d1 - v * Math.sqrt(T);

if (PutCallFlag== "c"){
	return CND(d1)
	}
else{
	return CND(d1)-1;
	}
 }

 function Gamma(S, K, T, q, r, v) {

  var d1, d2;
  d1 = (Math.log(S / K) + (r - q + v * v / 2.0) * T) / (v * Math.sqrt(T));
  d2 = d1 - v * Math.sqrt(T);

  return Math.exp(-r*T) * SND(d1) / (S*v*Math.sqrt(T));

 }
