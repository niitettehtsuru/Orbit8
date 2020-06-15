'use strict'; 
/* Sets everything up
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      13th June, 2020
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Orbit8
 * @license:   GNU General Public License v3.0
 */  
function getBrowserWindowSize() 
{
    let win = window,
    doc = document,
    offset = 20,//
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;  
    return {x:browserWindowWidth-offset,y:browserWindowHeight-offset}; 
} 
function onWindowResize()//called every time the window gets resized. 
{  
    windowSize = getBrowserWindowSize();
    c.width = windowSize.x; 
    c.height = windowSize.y; 
    SCREEN_WIDTH = windowSize.x;
    SCREEN_HEIGHT = windowSize.y;   
    curves.forEach(function(curve)//let curves respond to window resizing  
    { 
        curve.resize(SCREEN_WIDTH,SCREEN_HEIGHT); 
    });  
}
function updateCanvas()
{
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);    
    ctx.fillStyle   = 'black';  
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}  
//gets the relative height and relative width of the curve, assuming that the the window was in 
//fullscreen mode and is now reduced to it's present dimensions
function getCurveDimensions(inputRelativeWidth,inputRelativeHeight)
{
    let fullScreenWidth = 1346;//assumed browser window width of device
    let fullScreenHeight = 644;//assumed browser window height of device 
    let dy  = SCREEN_HEIGHT/fullScreenHeight;//percentage change in browser window height 
    let dx  = SCREEN_WIDTH/fullScreenWidth;//percentage change in browser window width  
    let relativeWidth = inputRelativeWidth * dx; 
    let relativeHeight = inputRelativeHeight * dy; 
    return {w:relativeWidth,h:relativeHeight};   
}
function createCurves()
{ 
    let 
    lissajousCurves = [],   
    numOfNestedCurves = 10,
    //position the curve at the center of the canvas
    xCoord = SCREEN_WIDTH/2,//x-coordinate of curve center  
    yCoord = SCREEN_HEIGHT/2,//y-coordinate of curve center 
    numHorizontalTangents = 2,//number of horizontal tangents(lobes) to the curve 
    numVerticalTangents = 1,//number of vertical tangents(lobes) to the curve
    unitOffset = 10,
    relativeWidth  = 200,//default relative width of the curve to the height
    relativeHeight = 200;//default relative height of the curve to the width
    for(let j=0;j < numOfNestedCurves; j++)  
    {    
        let dimensions = getCurveDimensions(relativeWidth,relativeHeight + (j*unitOffset)) ;
        let data = 
        {       
            heightOffset: j*unitOffset, 
            relativeWidth: dimensions.w,
            relativeHeight:dimensions.h,  
            numXTan:numHorizontalTangents,
            numYTan:numVerticalTangents,
            rotationAngle: -Math.PI, 
            xCoord: xCoord,
            yCoord: yCoord, 
            screenWidth: SCREEN_WIDTH,
            screenHeight: SCREEN_HEIGHT,
            color: 'white' //stroke color 
        }; 
        lissajousCurves.push(new Lissajous(data)); 
    }    
    return lissajousCurves; 
}  
let browserWindowSize   = getBrowserWindowSize(),
c   = document.getElementById("orbit8Canvas"),
ctx = c.getContext("2d"); 
//set size of canvas
c.width = browserWindowSize.x; 
c.height = browserWindowSize.y; 
let 
SCREEN_WIDTH = browserWindowSize.x,
SCREEN_HEIGHT = browserWindowSize.y,   
curves = createCurves(),  
lastTime = 100,  
windowSize;   
window.addEventListener('resize',onWindowResize); 
function doAnimationLoop(timestamp)
{           
    updateCanvas(); 
    let deltaTime  = timestamp - lastTime; 
        lastTime   = timestamp;
    curves.forEach(function(curve)
    {   
        curve.draw(ctx); 
    });  
    requestAnimationFrame(doAnimationLoop); 
} 
requestAnimationFrame(doAnimationLoop); 

 
 