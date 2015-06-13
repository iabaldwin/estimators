var IAB = window.IAB || {};

IAB.Mapping = 
{
    GridMap: function()
    {
        this.randomMap = function(x,y)
        {
            return numeric.random([x,y]);
        }
    }
};
