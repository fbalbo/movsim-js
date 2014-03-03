movsim.namespace('movsim.simulation.vehicle');

(function (ns) {
    "use strict";

    var numberOfCreatedVehicles = 0;

    // @constructor
    function Vehicle(vehicleParameters) {
        // public variables
        this.id = ++numberOfCreatedVehicles;
        this.isTruck = vehicleParameters.isTruck;
        this.length = vehicleParameters.length;
        this.width = vehicleParameters.width;
        this.position = vehicleParameters.position;
        this.speed = vehicleParameters.speed;
        this.acc = vehicleParameters.acc;
        
        this.carFollowingModelParameters = vehicleParameters.isTruck ? movsim.carfollowing.idmParameters.getDefaultTruck() : movsim.carfollowing.idmParameters.getDefaultCar();
        this.vLimit = this.carFollowingModelParameters.v0; // if effective speed limits, vLimit<v0
        this.vMax = this.carFollowingModelParameters.v0; // if vehicle restricts speed, vMax<vLimit, v0

        // TODO create MOBIL lane-changing model       
       
    }

    ns.Vehicle = Vehicle;

    // Factory
    ns.create = function (vehicleParameters) {
        vehicleParameters = vehicleParameters || this.getDefaultParameters();
        return new Vehicle(vehicleParameters);
    };

    ns.getDefaultParameters = function (isTruck) {
        this.isTruck = isTruck || false;
        var vehicleParameters = {};
        vehicleParameters.isTruck = isTruck;
        vehicleParameters.length = (isTruck) ? 15 : 7;
        vehicleParameters.width = (isTruck) ? 3 : 2.5;
        vehicleParameters.position = 0;
        vehicleParameters.speed = 0;
        vehicleParameters.acc = 0;
        return vehicleParameters;
    };

    // public functions
    var p = Vehicle.prototype;
    p.updateAcceleration = function (leader) {
        this.acc = movsim.carfollowing.models.calculateAcceleration(this, leader);
    };

    p.updateSpeedAndPosition = function (dt) {
        this.position += this.speed * dt + 0.5 * this.acc * dt * dt;
        this.speed += this.acc * dt;
        if (this.speed < 0) {
            this.speed = 0;
        }
//        console.log('vehicle ', this.id, '   position: ', this.position, '   speed: ', this.speed, '    acc: ', this.acc);
    };

    return ns;

})(movsim.simulation.vehicle);