var IAB = window.IAB || {};

IAB.Estimators = {

    EKF: function( measurement_covariance, estimation_covariance )
    {
        Q = [[Math.pow(measurement_covariance,2),0],
            [0, Math.pow( measurement_covariance,2)]];

        console.log( Q );
    }


};
