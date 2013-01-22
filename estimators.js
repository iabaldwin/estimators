var IAB = window.IAB || {};

IAB.Estimators = {

    State: function( x,y,theta )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.theta = theta || 0;
    },

    EKF: function( start_state, measurement_covariance )
    {
        if ( !(start_state instanceof IAB.Estimators.State ))
        {
            throw "Require: IAB.Estimators.State";
        }

        this.x = start_state;

        this.P = [[.2,0,0],
                  [0,.2,0],
                  [0,0,.1]];

        Q = [[Math.pow(measurement_covariance,2),0],
            [0, Math.pow( measurement_covariance,2)]];

        this.update = function()
        {

        }
    }

};
