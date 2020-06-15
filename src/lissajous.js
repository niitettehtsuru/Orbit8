'use strict';
/* Draws and rotates lissajous curves.
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      13th June, 2020
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Orbit8 
 * @codepen:   https://codepen.io/niitettehtsuru/pen/yLeJwrG
 * @license:   GNU General Public License v3.0
 */   
/* A lissajous curve is a graph of the following two parametric equations: 
 * 
 * x = Asin(at+?)  --------- (1)
 * y = Bsin(bt)    --------- (2)
 * 
 * In the constructor: 
 *  A is this.relativeWidth
 *  B is this.relativeHeight
 *  a is this.numHorizontalTangents
 *  b is this.numVerticalTangents
 *  ? is this.rotationAngle
 *  t is this.parameter
 */
class Lissajous
{
    constructor(data)
    {         
        this.heightOffSet   = data.heightOffset; 
        this.screenHeight   = data.screenHeight;  
        this.screenWidth    = data.screenWidth; 
        /* The ratio this.relativeWidth/this.relativeHeight determines the relative width-to-height ratio of the curve.  
         * For example, a ratio of 2/1 produces a figure that is twice as wide as it is high.*/
        this.relativeWidth  = data.relativeWidth;//relative width of the curve to the height; 
        this.relativeHeight = data.relativeHeight;//relative height of the curve to the width; 
        /*Visually, the ratio this.numHorizontalTangents/this.numVerticalTangents determines the number of "lobes" of the figure. 
         *For example, a ratio of 3/1 or 1/3 produces a figure with three major lobes.*/ 
        this.numHorizontalTangents = data.numXTan;//number of horizontal tangents(lobes) to the curve 
        this.numVerticalTangents = data.numYTan;//number of vertical tangents(lobes) to the curve  
        this.deltaAngle = 0.5; //adjusts the rotation angle
        /*this.rotationAngle is the phase shift for the lissajous curve. 
         *It determines the apparent "rotation" angle of the figure, viewed as if it were actually a three-dimensional curve.*/ 
        this.rotationAngle = -Math.PI + this.deltaAngle;//phase shift 
        this.parameter  = 0;//the parameter, (t) in the parametric equation 
        this.xCoord = data.xCoord;//set x coordinate of the center of the curve  
        this.yCoord = data.yCoord;//set y coordinate of the center of the curve   
        this.step = 629;//700; //controls the drawing of the curve. A step from 0 to 629 draws the curve.   
        this.color  =  data.color;//stroke color  
        this.fillStyle = 'white';//fill color 
        this.currentOrbitalPoint = {index:0,x:0,y:0};//coordinates of the small circle that moves along the curve 
    }  
    getColor() 
    {    
        return this.color; 
    }   
    drawCircle(ctx,point)//draws the small circles that move along the curve
    {     
        let radius  = 1; 
        let color   = 'white'; 
        let colors  = [`rgba(255,255,255,1)`,`rgba(255,255,255,0.6)`,`rgba(255,255,255,0.2)`];//white colors 
        for(let i = 0; i < 3; i++)
        { 
            switch(i)//create three circles with same center
            {
                case 0:   
                    color = colors[i]; 
                    break; 
                case 1: 
                    radius+=  2;//bigger circle 
                    color = colors[i];               
                    break; 
                case 2: 
                    radius+=  3;//biggest circle 
                    color = colors[i];               
                    break; 
            }
            //draw the circle
            ctx.beginPath(); 
            ctx.arc(point.x,point.y,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill();  
        } 
    }  
    draw(ctx)//animates the drawing and rotation of the curve
    {  
        let rodPosition = [];//the coordinates of the points at which rods are attached to the curve 
        this.parameter = 0;//reset parameter 
        ctx.beginPath(); 
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = this.getColor(); 
        for(let i = 0; i <  this.step;i++)//draw the complete curve 
        {  
            this.parameter+=0.01;   
            //Apply Lissajous Parametric Equations
            /*this.xCoord is added to the first equation.
             *this.yCoord is added to the second equation. 
             *This is so the curve is centered at (this.xCoord,this.yCoord) position on the canvas.*/
            let x = (this.relativeWidth  * Math.sin(this.numHorizontalTangents*this.parameter + this.rotationAngle))+this.xCoord;//first equation  
            let y = (this.relativeHeight * Math.sin(this.numVerticalTangents*this.parameter))+this.yCoord;//second equation  
            ctx.lineTo(x,y);   
            if(i % 10 === 0)//attach a rod at this point
            {
                rodPosition.push({x:x,y:y});
            }
            if(this.currentOrbitalPoint.index ===   this.step  - 1 )//if last iteration
            {
                this.currentOrbitalPoint.index = 0;//reset the index 
            }  
            if(this.currentOrbitalPoint.index === i )//update the positon of the circle that orbits the curve.
            {   
                this.currentOrbitalPoint.x = x;  
                this.currentOrbitalPoint.y = y;
            }  
        }   
        ctx.stroke(); 
        ctx.fillStyle = 'rgba(255,255,255,0.05)';//transparent white
        ctx.fill(); 
        ctx.closePath();  
        this.currentOrbitalPoint.index++;//move the circle along the curve
        //draw the circle that orbits the curve
        this.drawCircle(ctx,{x:this.currentOrbitalPoint.x, y:this.currentOrbitalPoint.y});  
        for(let k = 0;k < rodPosition.length;k++)//draw the rods that are attached to the curve
        {  
            this.drawLine(ctx,rodPosition[k],rodPosition[rodPosition.length-1-k]); 
            this.drawLine(ctx,rodPosition[k],rodPosition[rodPosition.length-5-k]);
            if(k > rodPosition.length/2)
            {
                break; 
            } 
        }    
        this.rotationAngle += 0.01;//increase rotation angle
        if(this.rotationAngle > Math.PI + this.deltaAngle)//if rotation is complete
        { 
            this.rotationAngle = -Math.PI + this.deltaAngle;//reset rotation angle
        }   
    }
    drawLine(ctx,point1,point2)//draws the rods
    {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.3; 
        ctx.beginPath();  
        ctx.moveTo(point1.x,point1.y);  
        ctx.lineTo(point2.x,point2.y);   
        ctx.stroke();
        ctx.closePath();
    }      
    resize(screenWidth,screenHeight)
    {   
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        {    
            let dy              = screenHeight/this.screenHeight;//percentage change in browser window height 
            let dx              = screenWidth/this.screenWidth;//percentage change in browser window width  
            this.screenHeight   = screenHeight;  
            this.screenWidth    = screenWidth; 
            this.xCoord *= dx; 
            this.yCoord *= dy;  
            
            this.relativeWidth *= dx;//relative width of the curve to the height; 
            this.relativeHeight *= dy;//relative height of the curve to the width; 
            if(this.relativeHeight > 200 + this.heightOffSet)
            {  
                this.relativeHeight = 200 + this.heightOffSet; 
            }   
            if(this.relativeWidth > 200)
            {
                this.relativeWidth = 200; 
            } 
        } 
    }  
}