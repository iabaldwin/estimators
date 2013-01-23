var IAB = window.IAB || {};

IAB.Math = 
{

    sec: function( val )
    {
        return 1/Math.cos(val);
    }

};

IAB.Estimators = {

    State: function( x,y,theta )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.theta = theta || 0;
    
   
        this.copy = function( s )
        {
            this.x = s.x;
            this.y = s.y;
            this.theta  = s.theta;
        }
    },

    Covariance: function( parameter, dim )
    {
        this.M = [[parameter,0,0],[0,parameter,0],[0,0,parameter]];
    },


    EKF: function( start_state, P, Q, control_action, model )
    {
        if ( !(start_state instanceof IAB.Estimators.State ))
        {
            throw "Require: IAB.Estimators.State";
        }

        this.state  = new IAB.Estimators.State();
        this.state.copy( start_state );

        this.P = P.slice(0);
        this.Q = Q.slice(0);

        this.control_action = control_action;

        var dt = .1;

        this.model = model;

        this.plotter = new IAB.Tools.Plotting();

        this.update = function()
        {
            //Compute Jacobians
            var JacFx = [[1,0,-dt*control_action.u*Math.sin( this.state.theta)],
                    [0,1,dt*control_action.v*Math.cos(this.state.theta)],
                    [0,0,1]];
     

            var JacFu =  [[dt*Math.cos( this.state.theta), 0],
                    [dt*Math.sin( this.state.theta), 0],
                    [dt*Math.tan(this.control_action.u/this.model.L), dt*this.control_action.v*IAB.Math.sec(Math.pow(this.control_action.v,2))]];
            
            
            this.P = numeric.add( numeric.dot( numeric.dot( JacFx, this.P), numeric.transpose(JacFx) ), numeric.dot( numeric.dot( JacFu, this.Q), numeric.transpose(JacFu) ) );
    
            this.plotter.drawCovarianceEllipse( null, this.P, 1 );
        }
    }

};
