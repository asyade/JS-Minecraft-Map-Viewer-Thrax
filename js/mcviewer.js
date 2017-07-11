var BLOCK_SIZE = 1;
//var BLOCKS_TO_HORIZON = BLOCK_SIZE*
var CHUNK_ROWSIZE = 16;
var REGION_ROWSIZE = 32;

$(function()
{   
    var unknownIDs = {};

    var textureLoadsRemaining = 0;

    var debugIDs = false;
    var dbgCanv;

    var materials = loadMaterials('textures/nicetex.png');
    var solidMaterial = materials.solidMat;
    var transparentMaterial = materials.transpMat;
    var regions = {};
    //var rgnKeySpread = Math.sqrt(Number.MAX_SAFE_INTEGER) | 0;
    //var regionKey = (x,z)=>x + (z * rgnKeySpread)

    var defaultMat = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0xFF0000)
    });

    var nv2 = (x,y)=>{
        return new THREE.Vector2(x,y);
    }

    var tileStride = 1.0 / 16;
    var tileCoord = (tx,ty)=>{
        return [nv2(tx / 16, ty / 16), nv2((tx / 16) + tileStride, (ty / 16) + tileStride)]
    }

    for (var i in tileDefs) {
        var td = tileDefs[i];
        td.uvs = [];
        if (debugIDs) {
            var row = i & 15;
            var col = (i / 16) | 0;
            for (var j = 0; j < td.faces.length; j += 2)
                td.uvs.push(tileCoord(row, col));
        } else
            for (var j = 0; j < td.faces.length; j += 2)
                td.uvs.push(tileCoord(td.faces[j], td.faces[j + 1]));
    }

    function loadMaterials(path, ) {

        var image = new Image();
        image.onload = function() {
            textureLoadsRemaining--;

            if (debugIDs && (!dbgCanv)) {
                var canv = dbgCanv = document.createElement("canvas");
                canv.width = canv.height = 2048;
                var ctx = canv.getContext("2d");
                var step = (canv.width / 16) | 0;
                var off = (step / 2) | 0;
                ctx.fillStyle = 'white';

                ctx.font = "24px Georgia";
                ctx.drawImage(texture.image, 0, 0, canv.width, canv.height)

                for (var y = 0; y < 16; y++) {
                    for (var x = 0; x < 16; x++) {
                        var txt = ((y * 16) + x).toString(16);
                        ctx.fillText(txt, (x * step) + off, (y * step) + off);
                    }
                }
                //	ctx.fillRect(0,0,512,512);
            }
            if (debugIDs) {
                texture.image = dbgCanv
            }
            ;texture.needsUpdate = true;
            texture.mats.solidMat.needsUpdate = true;
            //		texture.mats.transpMat.needsUpdate = true;
        }
        ;
        textureLoadsRemaining++;
        image.src = path;
        var texture = new THREE.Texture(image,THREE.Texture.DEFAULT_MAPPING,THREE.ClampToEdgeWrapping,THREE.ClampToEdgeWrapping,THREE.NearestFilter,THREE.LinearMipMapLinearFilter);
        //LinearMipMapNearestFilter);//NearestFilter);//
        texture.flipY = false;
        texture.mats = {
            texture: texture,
            solidMat: new THREE.MeshStandardMaterial({
                map: texture
            }),
            transpMat: new THREE.MeshStandardMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide
            })//,})
        }
        return texture.mats;
    }

    function saveCameraState(){
        var controlState = {
            "phi": controls.phi,
            "theta": controls.theta,
            "position": controls.object.position
        };
        localStorage.controlState = JSON.stringify(controlState);
        console.log(controlState);
    }
    
    function loadCameraState(){
        if (localStorage.controlState) {
            var controlState = JSON.parse(localStorage.controlState);
            controls.phi = controlState.phi;
            controls.theta = controlState.theta;
            controls.object.position.copy(controlState.position);
            console.log(controlState);
            var sv = controls.freeze;
            controls.freeze=false;
            controls.update(0);
            controls.freeze = sv;
        }
    }

    window.onbeforeunload = (e)=>{
        saveCameraState();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
    window.addEventListener('resize', onWindowResize, false);


    var getBlockDef = function(blockID) {
        var def = tileDefs[blockID];
        if (false && def == undefined) {
            blockID = blockID | 0;
            var row = blockID % 16;
            var col = (blockID / 16) | 0;
            if (!unknownIDs[blockID]) {
                unknownIDs[blockID] = true;
                console.log("Unknown id:", blockID.toString(16));
            }
            var unk = {
                name: "unk",
                faces: [row, col, row, col, row, col, row, col, row, col, row, col],
                bad: true
            };
            unk.uvs = [];
            for (var i = 0; i < 6; i++)
                unk.uvs.push(tileCoord(row, col));

            return unk;
        }
        return def;
    }

    function needsFaceBetween(def, blockID) {
        
        if (blockID == 0) {
            return true;
        }

        var bdef = tileDefs[blockID];
        if (!bdef)
            return true;

        if (def.transparent)
            return bdef.transparent ? false : true;

        return bdef.transparent ? true : false;
    }

    var bsz = BLOCK_SIZE;
    var unitBox = new THREE.CubeGeometry(bsz,bsz,bsz,1,1,1);

    function generateGeometry(def, sides, target, x, y, z) {
        if (def.transparent)
            bsz -= (BLOCK_SIZE / 128);
        var matUVs = def.uvs;
        var txEpsi = 0.01;

        var geometry = unitBox.clone();
        var vbase = target.vertices.length;
        for (var i = 0; i < geometry.vertices.length; i++) {
            var v = geometry.vertices[i];
            v.x += x;
            v.y += y;
            v.z += z;
            target.vertices.push(v);
        }
        for (var i = 0; i < geometry.faceVertexUvs[0].length; i++) {
            var fc = geometry.faceVertexUvs[0][i];
            var side = (i / 2) | 0;
            for (var j = 0; j < fc.length; j++) {
                var v = fc[j];
                if (v.x > 0.5)
                    v.x -= txEpsi;
                else
                    v.x += txEpsi;
                if (v.y > 0.5)
                    v.y -= txEpsi;
                else
                    v.y += txEpsi;
                v.set((fc[j].x / 16) + matUVs[side][0].x, ((1.0 - fc[j].y) / 16) + matUVs[side][0].y);
            }
        }
        for (var i = 0; i < geometry.faces.length; i++) {
            var fc = geometry.faces[i];
            fc.a += vbase;
            fc.b += vbase;
            fc.c += vbase;
        }

        var fvuvs = geometry.faceVertexUvs[0];
        var faces = geometry.faces
        var nfaces = target.faces;
        var nvuvs = target.faceVertexUvs[0];
        var pusher = (idx)=>{
            idx *= 2;
            nfaces.push(faces[idx + 0], faces[idx + 1]);
            nvuvs.push(fvuvs[idx + 0], fvuvs[idx + 1]);
        }
        if (sides.nx)
            pusher(1);
        if (sides.px)
            pusher(0);
        if (sides.ny)
            pusher(3);
        if (sides.py)
            pusher(2);
        if (sides.nz)
            pusher(5);
        if (sides.pz)
            pusher(4);
        //	geometry.faces = nfaces;
        //	geometry.faceVertexUvs[0] = nvuvs;
        target.needsUpdate = true;
        return target;
    }

    buildSectionMesh = function(cx, cz, cy) {
        var c = this.getChunk(cx, cz);
        var mesh = null;
        var forceSideFaces = false;
        if (c !== undefined && c !== null) {
            var s = c.sections[cy];
            if (s !== undefined && s !== null) {
                var blocks = s.Blocks;
                var geom = new THREE.Geometry();
                var transgeom = new THREE.Geometry();

                for (var x = 0; x < 16; x++) {
                    for (var y = 0; y < 16; y++) {
                        for (z = 0; z < 16; z++) {
                            var blockIndex = ((y * 16 + z) * 16 + x);
                            var block = blocks[blockIndex];
                            if (block === 0x00) {//air
                            } else {
                                var def = getBlockDef(block);
                                if (!def)
                                    continue;
                                var matUVs = def.uvs;
                                var sides = {
                                    px: false,
                                    nx: false,
                                    py: false,
                                    ny: false,
                                    pz: false,
                                    nz: false
                                };
                                
                                //======================================================================
                                var calcAdjacency=(dx,dy,dz)=>{
                                  
                                }
                                var dx = x - 1;
                                if (dx < 0) {
                                    // load the chunk adjecent to it
                                    var adjChunk = this.getChunk(cx - 1, cz);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['nx'] = needsFaceBetween(def, adjSection.Blocks[((y * 16 + z) * 16 + 15)]);
                                            // === 0x00;
                                        }
                                    }
                                    else sides['nx']=forceSideFaces;
                                } else {
                                    sides['nx'] = needsFaceBetween(def, blocks[((y * 16 + z) * 16 + dx)]);
                                    // === 0x00;
                                }
                                dx = x + 1;
                                if (dx > 15) {
                                    var adjChunk = this.getChunk(cx + 1, cz);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['px'] = needsFaceBetween(def, adjSection.Blocks[((y * 16 + z) * 16 + 0)]);
                                            // === 0x00;
                                        }
                                    }
                                    else sides['px']=forceSideFaces;
                                } else {
                                    sides['px'] = needsFaceBetween(def, blocks[((y * 16 + z) * 16 + dx)]);
                                    // === 0x00;
                                }

                                var dz = z - 1;
                                if (dz < 0) {
                                    // load the chunk adjecent to it
                                    var adjChunk = this.getChunk(cx, cz - 1);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['nz'] = needsFaceBetween(def, adjSection.Blocks[((y * 16 + 15) * 16 + x)]);
                                            //=== 0x00;
                                        }
                                    }
                                    else sides['nz']=forceSideFaces;
                                } else {
                                    sides['nz'] = needsFaceBetween(def, blocks[((y * 16 + dz) * 16 + x)]);
                                    // === 0x00;
                                }

                                dz = z + 1;
                                if (dz > 15) {
                                    var adjChunk = this.getChunk(cx, cz + 1);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['pz'] = needsFaceBetween(def, adjSection.Blocks[((y * 16 + 0) * 16 + x)]);
                                            // === 0x00;
                                        }
                                    }
                                    else sides['pz']=forceSideFaces;
                                } else {
                                    sides['pz'] = needsFaceBetween(def, blocks[((y * 16 + dz) * 16 + x)]);
                                    // === 0x00;
                                }

                                var dy = y - 1;
                                if (dy < 0) {
                                    // load the chunk adjecent to it
                                    var adjChunk = this.getChunk(cx, cz);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy - 1]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['ny'] = needsFaceBetween(def, adjSection.Blocks[((15 * 16 + z) * 16 + x)]);
                                            // === 0x00;
                                        }
                                    }
                                    else sides['ny']=forceSideFaces;
                                } else {
                                    sides['ny'] = needsFaceBetween(def, blocks[((dy * 16 + z) * 16 + x)]);
                                    // === 0x00;
                                }

                                dy = y + 1;
                                if (dy > 15) {
                                    var adjChunk = this.getChunk(cx, cz);
                                    if (adjChunk !== null) {
                                        var adjSection = adjChunk.sections[cy + 1]
                                        if (adjSection !== undefined && adjSection !== null) {
                                            sides['py'] = needsFaceBetween(def, adjSection.Blocks[((0 * 16 + z) * 16 + x)]);
                                            // === 0x00;
                                        }
                                    }
                                    else sides['py']=forceSideFaces;
                                } else {
                                    sides['py'] = needsFaceBetween(def, blocks[((dy * 16 + z) * 16 + x)]);
                                    // === 0x00;
                                }
                                //===================================================================================

                                var flag = false
                                for (k in sides) {
                                    if (sides[k]) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    generateGeometry(def, sides, def.transparent ? transgeom : geom, x * BLOCK_SIZE + 16 * cx * BLOCK_SIZE, y * BLOCK_SIZE + cy * 16 * BLOCK_SIZE, z * BLOCK_SIZE + 16 * cz * BLOCK_SIZE);
                                }
                            }
                        }
                    }
                }
                mesh = new THREE.Mesh(geom,solidMaterial);
                var transmesh = new THREE.Mesh(transgeom,transparentMaterial);
                mesh.castShadow = mesh.receiveShadow = transmesh.castShadow = transmesh.receiveShadow = true;
                mesh.add(transmesh);
            }
        }
        return mesh
    }
    ;

        
    var downloadArrayBuffer = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function() {
            var status = xhr.readyState;
            if (status === 200) {
                callback(null, xhr.response);
            } else if(status===4) {
                callback(xhr.response);
            }
        };
        xhr.send();
    };
    

    function loadRegionFromServer(rx,ry){
        var rname = {name:"map/r."+rx+"."+ry+".mca"}
        var r = new Region(rname);

        downloadArrayBuffer(rname.name,(data,res)=>{
            regions[[rx,ry]] = "loading";

            if(data){
                r.loadFromArrayBuffer(data);
                regions[[rx,ry]] = r;
            }
            else
                regions[[rx,ry]] = "missing";            
        })
    }
    
    
    $("#files").bind('change', function(event) {
        var f = event.target.files[0];
        var r = new Region(f);
        regions[[r.location.x, r.location.z]] = "loading";
        r.load(function() {
            regions[[r.location.x, r.location.z]] = r;
        });
    });

    var camera, scene, renderer, geometry, material, mesh, controls, clock;

    var sectionBuffer = {};
    var loadedSectionCount = 0;
    var buildQueue = [];

    var lightShadowMapViewer;
    var directionalLight;
    var dirLightOffset;

    init();
    animate();

    function init() {
        clock = new THREE.Clock();
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,70000);
        camera.position.z = 0;
        camera.position.y = 64 * BLOCK_SIZE;
        camera.position.x = 0;


        controls = new THREE.FirstPersonControls(camera);

        controls.movementSpeed = 10*BLOCK_SIZE;
        controls.lookSpeed = 0.100;
        controls.lookVertical = true;
        controls.activeLook = false;
        document.addEventListener('keydown', (evt)=>{
            if (evt.key == "Escape") {
                controls.activeLook = !controls.activeLook;
                if (!controls.activeLook) {
                    saveCameraState();
                }
            }
            if (evt.key == "Tab") {
                controls.phi = Math.PI * 0.25;
                controls.theta = Math.PI * -0.5
                controls.object.position.set(53,72,173);
            }
        }
        )

        scene.fog = new THREE.Fog(0x8EE3FA,1000,70000);
        scene.add(camera);

        var ambientLight = new THREE.AmbientLight(0x999999);
        scene.add(ambientLight);

        var cube = new THREE.Mesh(new THREE.CubeGeometry(64,64,64),new THREE.MeshNormalMaterial());
        cube.position.y = 64 * BLOCK_SIZE;
        scene.add(cube);

        directionalLight = new THREE.DirectionalLight(0xcccccc,1);

        directionalLight.castShadow = true;
        var width = 100;
        var height = 100;
        directionalLight.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 7000));//new THREE.PerspectiveCamera(50,1,10,7000));
        directionalLight.shadow.bias = 0;//0.001;
        var SHADOW_MAP_WIDTH = 2048
          , SHADOW_MAP_HEIGHT = 2048;
        directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        directionalLight.shadow.radius = 1.0;

        scene.add(directionalLight);
        directionalLight.target = camera;

        dirLightOffset = new THREE.Vector3(1500,3000,1500);
        //		camera.add(directionalLight);

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor("#8EE3FA");

        $("#container").append($(renderer.domElement));

        function toggleHUD() {
            if(lightShadowMapViewer){
                lightShadowMapViewer.dispose();
            }
            lightShadowMapViewer = new THREE.ShadowMapViewer( directionalLight );
            lightShadowMapViewer.position.x = 10;
            lightShadowMapViewer.position.y = renderer.domElement.height - ( SHADOW_MAP_HEIGHT / 4 ) - 10;
            lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
            lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
            lightShadowMapViewer.update();
        }
        //toggleHUD();
        loadCameraState();



        loadRegionFromServer(0,0);
        
        controls.activeLook = true;

    }

    function animate() {
        requestAnimationFrame(animate);
        var frameDelta = clock.getDelta();
        controls.update(frameDelta);
        if (textureLoadsRemaining == 0) {
            var startTime = performance.now();
            buildGeometry();



            directionalLight.position.copy(camera.position);

            var shadowPixelSize = 1.0;
            directionalLight.position.x -= directionalLight.position.x % shadowPixelSize;
            directionalLight.position.y -= directionalLight.position.y % shadowPixelSize;
            directionalLight.position.z -= directionalLight.position.z % shadowPixelSize;
            directionalLight.position.add(dirLightOffset);
            
            var endTime = performance.now();
            var taskTime = endTime - startTime;
            if (taskTime > 500)
                console.log("TaskTime:", taskTime);
            render();

        }
    }

    var CHUNK_SIZE = BLOCK_SIZE * 16;
    var chunkCenter = new THREE.Vector3(CHUNK_SIZE / 2,CHUNK_SIZE / 2,CHUNK_SIZE / 2);
    var defCube = new THREE.Mesh(new THREE.BoxGeometry(CHUNK_SIZE * 0.25,CHUNK_SIZE * 0.25,CHUNK_SIZE * 0.25),new THREE.MeshLambertMaterial());
    defCube.castShadow = defCube.receiveShadow = true;

    var coordkey = (x,y,z)=>[x, y, z]

    var lastPos;

    var liveTiles = [];
    var tv30= new THREE.Vector3();
    var tv31= new THREE.Vector3();

    function buildGeometry() {
        var playerPosition = {
            x: Math.floor(camera.position.x / BLOCK_SIZE),
            y: Math.floor(camera.position.y / BLOCK_SIZE),
            z: Math.floor(camera.position.z / BLOCK_SIZE)
        };
        var playerChunk = {
            x: Math.floor(playerPosition.x / 16),
            z: Math.floor(playerPosition.z / 16),
            y: Math.floor(playerPosition.y / 16)
        };
        var playerRegion = {
            x: Math.floor(playerChunk.x / 32),
            z: Math.floor(playerChunk.z / 32)
        }
        var coords = "(" + playerPosition.x + ", " + playerPosition.y + ", " + playerPosition.z + ")";
        var chunkCoords = "(" + playerChunk.x + ", " + playerChunk.y + ", " + playerChunk.z + ")";
        var regionCoords = "(" + playerRegion.x + ", " + playerRegion.z + ")";

        var infoStr = "World Player: " + coords + " World Chunk: " + chunkCoords + " World Region: " + regionCoords + " Loaded: " + loadedSectionCount + " Queued: " + buildQueue.length;
        infoStr += "</br>"+JSON.stringify([renderer.info.render,renderer.info.memory]);
        $("#info").text(infoStr);


        var px = playerChunk.x;
        var pz = playerChunk.z;
        var py = playerChunk.y;

        var radius = 8;
        var h = 2;
        var MAX_CHUNKS = (radius*2)*(radius*2)*(h*2);
        var buildRgnsPerFrame = 3;
       // var radius = 16;
       // var h = 2;
        //2;

        var posChanged = false;
        if (!lastPos) {
            lastPos = new THREE.Vector3();
            posChanged = true;
        } else if ((lastPos.x != px) || (lastPos.y != py) || (lastPos.z != pz))
            posChanged = true;
        if (posChanged)
            lastPos.copy(playerChunk);
        posChanged = true;
        if (posChanged)
            for (var x = px - radius; x < px + radius; x++) {
                for (var z = pz - radius; z < pz + radius; z++) {
                    for (var y = py - h; y < py + h; y++) {
                        var key = coordkey(x, y, z);
                        if (sectionBuffer[key] === undefined) {
                            buildQueue.push(sectionBuffer[key] = {x:x, y:y, z:z, key:key, empty:true})
                        }
                    }
                }
            }

        var abs = (a)=>a < 0 ? -a : a
        var maxabs = (a,b)=>{
            a = abs(a);
            b = abs(b);
            return a > b ? a : b
        }
        ;

        for (var i = 0; i < buildQueue.length; i++) {
            var e = buildQueue[i];
            e.dist = maxabs(maxabs(e.x - px, e.y - py), e.z - pz);
        }
        
        var plyrDist = (a,b)=>{
            return b.dist - a.dist;
        }

        buildQueue.sort(plyrDist);
        
        var org = buildQueue.length - buildRgnsPerFrame;
        if (org < 0)
            org = 0;

        
        var deadChunks = [];
        while (buildQueue.length > org) {

            var toBuild = buildQueue.pop();
            var x = toBuild.x;
            var y = toBuild.y
            var z = toBuild.z;
            var curRegion = toBuild.rgn;
            //regions[[toBuild[3], toBuild[4]]];
            var key = toBuild.key;
            
            var cx = Math.floor(x / 32);
            var cz = Math.floor(z / 32);


            var localX = x % 32;
            var localZ = z % 32;
            if (localX < 0)
                localX += 32;
            if (localZ < 0)
                localZ += 32;

            var rgn = curRegion = regions[[cx,cz]]
            if (!(rgn && rgn!="loading" && rgn.existsChunk(localX, localZ))) {

                
                delete sectionBuffer[key]
                /*
                var chunkBox = sectionBuffer[key] = defCube.clone();
                chunkBox.position.set(x*CHUNK_SIZE,y*CHUNK_SIZE,z*CHUNK_SIZE);
                chunkBox.position.add(chunkCenter);
                scene.add(chunkBox);
                chunkBox.updateMatrixWorld();
                chunkBox.matrixAutoUpdate = false;
                */

                //new THREE.Object3D();
                //sectionBuffer[key].visible = false;
                //buildQueue.push([x, y, z, rgn, key ,0]);//playerRegion.x, playerRegion.z])
                continue;
            }

            if (toBuild.dist > radius) {

                sectionBuffer[key] = undefined;

                continue;
                //Stop rendering far away guys....
            }


            mesh = buildSectionMesh.call(curRegion, localX, localZ, y)
            if (mesh) {
                mesh.translateX(curRegion.location.x * 32 * BLOCK_SIZE);
                mesh.translateY(curRegion.location.z * 32 * BLOCK_SIZE);
                scene.add(mesh);
                //			console.log(mesh.geometry.vertices.length);
                mesh.updateMatrix();
                mesh.updateMatrixWorld();
                mesh.matrixAutoUpdate = false;
                mesh.visible = true;
                toBuild.mesh = mesh;
                liveTiles.push(toBuild);

                loadedSectionCount++;
            }
        }


        if(liveTiles.length>MAX_CHUNKS){
           for(var i=0;i<liveTiles.length;i++){
               var e = liveTiles[i];
               e.dist = maxabs(maxabs(e.x - px, e.y - py), e.z - pz);
           }
            liveTiles.sort(plyrDist);
            var ndead = (liveTiles.length-MAX_CHUNKS);
            deadChunks = deadChunks.concat(liveTiles.slice(0,ndead));
            liveTiles = liveTiles.slice(ndead);
        }

        while(deadChunks.length>0){
            var ck=deadChunks.pop();
            var key = ck.key;
            var chunkMesh = ck.mesh;
            if( !sectionBuffer[ck.key] )continue;
            if (chunkMesh) {
                chunkMesh.parent.remove(chunkMesh);
                chunkMesh.children[0].geometry.dispose();
                //chunkMesh.children[0].dispose();
                chunkMesh.geometry.dispose();
                //chunkMesh.dispose();
                delete ck.mesh;
            }
            delete sectionBuffer[ck.key];
            //Flush this non loaded chunk..
            loadedSectionCount--;
        }
        
    }

    function render() {
        renderer.render(scene, camera);

        if (lightShadowMapViewer)
            lightShadowMapViewer.render(renderer);
    }
});
