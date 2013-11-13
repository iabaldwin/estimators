var IAB = window.IAB || {};

IAB.Patterns = {

    Observer: function()
    {
        this.last_update_time = 0;

        this.postUpdate = function()
        {
            console.log( this.last_update_time );
        }
    }
}
