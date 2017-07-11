THREE.FirstPersonControls = function(a, b) {
    function c(a, b) {
        return function() {
            b.apply(a, arguments)
        }
    }
    this.object = a;
    this.target = new THREE.Vector3(0,0,0);
    this.domElement = void 0 !== b ? b : document;
    this.movementSpeed = 1;
    this.lookSpeed = 0.005;
    this.noFly = false;
    this.lookVertical = true;
    this.autoForward = false;
    this.activeLook = true;
    this.heightSpeed = false;
    this.heightCoef = 1;
    this.heightMin = 0;
    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;
    this.theta = this.phi = this.lon = this.lat = this.mouseY = this.mouseX = this.autoSpeedFactor = 0;
    this.mouseDragOn = this.freeze = this.moveRight = this.moveLeft = this.moveBackward = this.moveForward = false;
    this.domElement === document ? (this.viewHalfX = window.innerWidth / 2,
    this.viewHalfY = window.innerHeight / 2) : (this.viewHalfX = this.domElement.offsetWidth / 2,
    this.viewHalfY = this.domElement.offsetHeight / 2,
    this.domElement.setAttribute("tabindex", -1));
    this.onMouseDown = function(a) {
        this.domElement !== document && this.domElement.focus();
        a.preventDefault();
        a.stopPropagation();
        if (this.activeLook)
            switch (a.button) {
            case 0:
                this.moveForward = true;
                break;
            case 2:
                this.moveBackward = true
            }
        this.mouseDragOn = true
    }
    ;
    this.onMouseUp = function(a) {
        a.preventDefault();
        a.stopPropagation();
        if (this.activeLook)
            switch (a.button) {
            case 0:
                this.moveForward = false;
                break;
            case 2:
                this.moveBackward = false
            }
        this.mouseDragOn = false
    }
    ;
    this.onMouseMove = function(a) {
        this.domElement === document ? (this.mouseX = a.pageX - this.viewHalfX,
        this.mouseY = a.pageY - this.viewHalfY) : (this.mouseX = a.pageX - this.domElement.offsetLeft - this.viewHalfX,
        this.mouseY = a.pageY - this.domElement.offsetTop - this.viewHalfY)
    }
    ;
    this.onKeyDown = function(a) {
        switch (a.key) {
        case "ArrowUp":
        case "W":
        case "w":
            this.moveForward = true;
            break;
        case "ArrowLeft":
        case "A":
        case "a":
            this.moveLeft = true;
            break;
        case "ArrowDown":
        case "S":
        case "s":
            this.moveBackward = true;
            break;
        case "ArrowRight":
        case "D":
        case "d":
            this.moveRight = true;
            break;
        case "R":
        case "r":
            this.moveUp = true;
            break;
        case "F":
        case "f":
            this.moveDown = true;
            break;
        case "Q":
        case "q":
            this.freeze = !this.freeze
        }
        this.shiftKey = a.shiftKey;
    }
    ;
    this.onKeyUp = function(a) {
        switch (a.key) {
        case "ArrowUp":
        case "W":
        case "w":
            this.moveForward = false;
            break;
        case "ArrowLeft":
        case "A":
        case "a":
            this.moveLeft = false;
            break;
        case "ArrowDown":
        case "S":
        case "s":
            this.moveBackward = false;
            break;
        case "ArrowRight":
        case "D":
        case "d":
            this.moveRight = false;
            break;
        case "R":
        case "r":
            this.moveUp = false;
            break;
        case "F":
        case "f":
            this.moveDown = false;
            break;
        }
    }
    ;
    this.update = function(a) {
        var b = 0;
        if (!this.freeze) {
            this.heightSpeed ? (b = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax) - this.heightMin,
            this.autoSpeedFactor = a * b * this.heightCoef) : this.autoSpeedFactor = 0;
            b = a * this.movementSpeed * (this.shiftKey?10:1);
            (this.moveForward || this.autoForward && !this.moveBackward) && this.object.translateZ(-(b + this.autoSpeedFactor));
            this.moveBackward && this.object.translateZ(b);
            this.moveLeft && this.object.translateX(-b);
            this.moveRight && this.object.translateX(b);
            this.moveUp && this.object.translateY(b);
            this.moveDown && this.object.translateY(-b);
            a *= this.lookSpeed;
            this.activeLook || (a = 0);
            this.lon += this.mouseX * a;
            this.lookVertical && (this.lat -= this.mouseY * a);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            var b = this.target
              , c = this.object.position;
            b.x = c.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = c.y + 100 * Math.cos(this.phi);
            b.z = c.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
            b = 1;
            this.constrainVertical && (b = Math.PI / (this.verticalMax - this.verticalMin));
            this.lon += this.mouseX * a;
            this.lookVertical && (this.lat -= this.mouseY * a * b);
            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;
            if (this.constrainVertical)
                this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
            b = this.target;
            c = this.object.position;
            b.x = c.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            b.y = c.y + 100 * Math.cos(this.phi);
            b.z = c.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
            this.object.lookAt(b)
        }
    }
    ;
    this.domElement.addEventListener("contextmenu", function(a) {
        a.preventDefault()
    }, false);
    this.domElement.addEventListener("mousemove", c(this, this.onMouseMove), false);
    this.domElement.addEventListener("mousedown", c(this, this.onMouseDown), false);
    this.domElement.addEventListener("mouseup", c(this, this.onMouseUp), false);
    this.domElement.addEventListener("keydown", c(this, this.onKeyDown), false);
    this.domElement.addEventListener("keyup", c(this, this.onKeyUp), false)
}
;
