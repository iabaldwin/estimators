//A = [[1,2,3],
  //[4,5,6],
  //[7,3,9]];

//console.log( A );

//x = [3,1,2];

//console.log( x );

//console.log( numeric.dot(A,x) );

//B = [[4,5,6],[7,8,9],[0,1,2]];

//console.log( numeric.mul( A, B ) );
//numeric.prettyPrint( numeric.mul( A, B ) );
//console.log( numeric.prettyPrint( numeric.mul( A, B ) ) );

//A = numeric.identity(2);
//B = numeric.identity(2);
//C = [[0,0],[0,0]];

//console.log( numeric.prettyPrint( numeric.mul( A, B, C) ) );

A = [[1,1],[1,1],[1,1]];
B = numeric.identity(2);

console.log( numeric.prettyPrint( numeric.dim(A) ) );
console.log( numeric.prettyPrint( numeric.dim(B) ) );

console.log( numeric['*']( A, B ) );

//console.log( numeric.prettyPrint( A ) );
//console.log( numeric.prettyPrint( B ) );

//console.log( numeric.prettyPrint( numeric.mulSV(A,B) ) );
//console.log( numeric.prettyPrint( numeric.mulVS(A,B) ) );
//console.log( numeric.prettyPrint( numeric.mulVV(A,B) ) );
//console.log( numeric.prettyPrint( numeric.muleq(A,B) ) );
//console.log( numeric.prettyPrint( numeric.muleqS(A,B) ) );
//console.log( numeric.prettyPrint( numeric.muleqV(A,B) ) );
//console.log( numeric.prettyPrint( numeric['*'](B,A) ) );
