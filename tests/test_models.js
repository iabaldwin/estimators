var model = new IAB.Models.Ackermann();

var state = new IAB.Estimators.State(0,0,0);
var control = new IAB.Controllers.ControlInput(10,1);

var update = model.predict( state, control, .1, 10 );

console.log( update );

var controller = new IAB.Controllers.Wiggle();
console.log( controller.update() );

