IAB.Sensors = {

    Sensor: function()
    {

        this.update = function()
        {
            this.last_update_time += 1;

            // Do some stuff
            IAB.Patterns.Observer.postUpdate.prototype.call(this);
        }
    }
}

IAB.Sensors.Sensor.prototype = new IAB.Patterns.Observer();
IAB.Sensors.Sensor.prototype.constructor = IAB.Sensors.Sensor;

var s = new IAB.Sensors.Sensor();

s.update( s.last_update_time );
