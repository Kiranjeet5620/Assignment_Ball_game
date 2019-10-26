<html>
<script type="text/javascript">

class Rectangle
{
   constructor( given_upper_left_corner_x,
                given_upper_left_corner_y,
                given_width,
                given_height )
   {
      this.x = given_upper_left_corner_x ;
      this.y = given_upper_left_corner_y ;
      this.width  = given_width ;
      this.height = given_height ;
   }
}


class CollisionCounter
{
   constructor()
   {
      this.count = 0 ;
      this.instance_of_this_class = null ;
   }

   
   static get_instance()
   {
      if ( this.instance_of_this_class == null )
      {
         this.instance_of_this_class = new CollisionCounter() ;
      }

      return this.instance_of_this_class ;
   }

   increment()
   {
      this.count ++ ;
   }

   get_count()
   {
      return this.count ;
   }

   reset()
   {
      this.count = 0 ;
   }
}

class GraphicalObject
{
   constructor()
   {
      this.object_center_point_x = 400 ;
      this.object_center_point_y = 400 ;

      
      this.object_velocity = 4.0 ;
      this.object_color    = "red" ;
   }

   get_object_position_x()
   {
      return this.object_center_point_x ;
   }

   get_object_position_y()
   {
      return this.object_center_point_y ;
   }

   set_color( new_color )
   {
      this.object_color  =  new_color ;
   }

   move_right()
   {
      this.object_center_point_x += this.object_velocity ;
   }


   move_left()
   {
      this.object_center_point_x -= this.object_velocity ;
   }

   move_up()
   {
      this.object_center_point_y -= this.object_velocity ;
   }

   move_down()
   {
      this.object_center_point_y += this.object_velocity ;
   }


   move_this_object( movement_in_direction_x, movement_in_direction_y )
   {
      this.object_center_point_x += movement_in_direction_x ;
      this.object_center_point_y += movement_in_direction_y ;
   }

   move_to_position( new_position_x, new_position_y )
   {
      this.object_center_point_x = new_position_x ;
      this.object_center_point_y = new_position_y ;
   }

} 


class Bouncer extends GraphicalObject
{
   constructor( given_position_x,
                given_position_y,
                given_color,
                given_bouncing_area )
   {
      super() ; 

      this.object_center_point_x = given_position_x ;
      this.object_center_point_y = given_position_y ;
      this.object_color   = given_color ;
      this.bouncing_area  = given_bouncing_area ;

      this.bouncer_radius  =  60 ;

      this.collision_counter = CollisionCounter.get_instance();
    
      this.bouncer_direction  =  Math.random() * Math.PI * 2 ;
   }

   get_bouncer_radius()
   {
      return this.bouncer_radius ;
   }

   shrink()
   {
     

      if ( this.bouncer_radius  > 5 )
      {
         this.bouncer_radius  -=  3 ;
      }
   }


   enlarge()
   {
      this.bouncer_radius  = this.bouncer_radius + 3 ;
   }


   set_radius( new_radius )
   {
      if ( new_radius  >  3 )
      {
         this.bouncer_radius  =  new_radius ;
      }
   }

   contains_point( given_point_x, given_point_y )
   {
     
      var distance_from_given_point_to_ball_center  =

         Math.sqrt( 
           Math.pow( this.object_center_point_x  -  given_point_x, 2 )  +
           Math.pow( this.object_center_point_y  -  given_point_y, 2 )  ) ;

      return ( distance_from_given_point_to_ball_center 
                                                <=  this.bouncer_radius ) ;
   }


   move()
   {
     
      this.object_center_point_x +=
              this.object_velocity * Math.cos( this.bouncer_direction ) ;


      this.object_center_point_y -= 
              this.object_velocity * Math.sin( this.bouncer_direction ) ;

    
      if ( this.object_center_point_y - this.bouncer_radius <=
                                                 this.bouncing_area.y )
      {
         
         this.bouncer_direction = 2 * Math.PI - this.bouncer_direction ;
         this.collision_counter.increment();
      }

      if ( this.object_center_point_x - this.bouncer_radius <=
                                                  this.bouncing_area.x )
      {
         

         this.bouncer_direction = Math.PI - this.bouncer_direction ;
         this.collision_counter.increment();
      }

      if ( ( this.object_center_point_y  +  this.bouncer_radius )  >=
                   ( this.bouncing_area.y  +  this.bouncing_area.height ) )
      {
         

         this.bouncer_direction = 2 * Math.PI - this.bouncer_direction ;
         this.collision_counter.increment();
      }

      if ( ( this.object_center_point_x  +  this.bouncer_radius )  >=
                     ( this.bouncing_area.x  +  this.bouncing_area.width ) )
      {
        

         this.bouncer_direction = Math.PI - this.bouncer_direction ;
         this.collision_counter.increment();
      }
   }


   draw( context )
   {
      context.save() ;

      context.fillStyle = this.object_color ;
      context.strokeStyle = "black" ;

      context.beginPath() ;
      context.arc( this.object_center_point_x, this.object_center_point_y,
                   this.bouncer_radius, 0, 2 * Math.PI, true ) ;
      context.closePath() ;
      context.stroke() ;
      context.fill() ;

      context.restore() ;
   }
} 
class RotatingBouncer extends Bouncer
{
   constructor( given_position_x,
                given_position_y,
                given_color,
                given_bouncing_area )
   {
      
      super( given_position_x, given_position_y, given_color, 
             given_bouncing_area ) ; 

      this.current_rotation = 0 ;

      this.another_ball_color = "green" ;
   }

   move()
   {
     
      super.move() ;

      this.current_rotation  =  this.current_rotation + 2 ;

      if ( this.current_rotation >= 360 )
      {
         this.current_rotation  =  0 ;
      }
   }


   draw( context )
   {
      super.draw( context ) ; 
      context.save() ;

      context.fillStyle = this.another_ball_color ;

      
      context.translate( this.object_center_point_x,
                         this.object_center_point_y ) ;

     
      context.rotate( 2 * Math.PI * this.current_rotation / 360 ) ;

      
      context.beginPath() ;
      context.moveTo( 0, 0 ) ;
      context.arc( 0, 0, this.bouncer_radius, 0, 0.5 * Math.PI, false ) ;
      context.lineTo( 0, 0 ) ;
      context.closePath() ;
      context.stroke() ;
      context.fill() ;

    
      context.beginPath() ;
      context.moveTo( 0, 0 ) ;
      context.arc( 0, 0, this.bouncer_radius,
                         Math.PI, 1.5 * Math.PI, false ) ;
      context.lineTo( 0, 0 ) ;
      context.closePath() ;
      context.stroke() ;
      context.fill() ;

     
      context.restore() ;
   }
}

const BALL_ALIVE_AND_WELL  =  0 ;
const BALL_EXPLODING       =  1 ;
const BALL_EXPLODED        =  2 ;

class ExplodingBouncer extends RotatingBouncer
{
   constructor( given_position_x,
                given_position_y,
                given_color,
                given_bouncing_area )
   {
    
      super( given_position_x, given_position_y,
             given_color, given_bouncing_area ) ; 

      this.ball_state  =  BALL_ALIVE_AND_WELL ;
      this.explosion_color_alpha_value = 0.0 ;
   }

   explode_ball()
   {
      this.ball_state = BALL_EXPLODING ;
      this.enlarge() ; 
      this.enlarge() ;
   }

   is_exploded()
   {
      return ( this.ball_state == BALL_EXPLODED ) ;
   }

   move()
   {
      

      if ( this.ball_state == BALL_ALIVE_AND_WELL )
      {
         
         super.move() ;
      }
   }

   draw( context )
   {
      if (  this.ball_state == BALL_ALIVE_AND_WELL )
      {
        
         super.draw( context ) ;
      }
      else if ( this.ball_state == BALL_EXPLODING )
      {
         if ( this.explosion_color_alpha_value > 1.0 )
         {
            this.ball_state = BALL_EXPLODED ;
         }
         else
         {
          
            super.draw( context ) ;

            context.save() ;

            context.fillStyle   = "yellow" ; 
            context.globalAlpha = this.explosion_color_alpha_value ;

            context.translate( this.object_center_point_x,
                               this.object_center_point_y ) ;


            context.beginPath() ;
            context.arc( 0, 0, this.bouncer_radius + 2,
                         0, 2.0 * Math.PI ) ;
            context.closePath() ;
            context.stroke() ;
            context.fill() ;

            context.restore() ;

            this.explosion_color_alpha_value += 0.02 ; 
         }
      }
   }
}  


var bouncing_area  =  new Rectangle( 0, 0, 800, 600 ) ;

var ball_on_screen  =  new ExplodingBouncer( 400, 300, "lime",
                                             bouncing_area ) ;
// Exercise 1 code
var another_ball  =  new ExplodingBouncer( 400, 300, "cyan",
                                             bouncing_area ) ;
//Exercise 5 code
var game_is_being_played=false;
//Exercise 6 code
var counter = 0;
//Exercise 7 code
var collision_counter=CollisionCounter.get_instance();


function on_key_down( event )
{
   if ( event.which  ==  27 ) 
   {
      ball_on_screen.explode_ball() ;
   }
}
//Exercise 5 code
function on_space_key_down( event )
{
   if ( event.which  ==  32 ) 
   {
      game_is_being_played=true ;
   }
}

//Exercise 4 code
function on_mouse_click(event){
    var pointer_position_x = event.offsetX ;
    var pointer_position_y = event.offsetY ;
   //  count = 0;
   //Exercise 5 code
    if(game_is_being_played){
        for (let ball_index = 0; ball_index < game_balls.length; ball_index++) {
            const ball = game_balls[ball_index];
            if(ball.contains_point(pointer_position_x,pointer_position_y)){
                ball.explode_ball();
                draw_on_canvas();
                break;
            }  
        }   
   }
}


function draw_on_canvas()
{
   var canvas = document.getElementById( "bouncing_ball_canvas" ) ;
   var context = canvas.getContext( "2d" ) ;

   context.fillStyle = "GhostWhite" ;  // bg color
   context.fillRect( 0, 0, canvas.width, canvas.height ) ;

   context.fillStyle="Black";
   context.fillText("Collosions : "+collision_counter.get_count(),20,20);

//Exercise 2 code
  for ( var ball_index = 0 ;
             ball_index < game_balls.length ;
             ball_index ++ ){
        game_balls[ball_index].draw(context) ;
    }
}


function prepare_a_new_game()
{
   game_balls = [] ; 
   //Exercise 3 code
    ball_colors = ["Gold","FireBrick","DarkViolet","DeepSkyBlue",
                    "Olive","Orchid","OrangeRed","PeachPuff",
                    "Snow","Thistle"];
   var ball_center_x = 100 ;
   var ball_center_y = 225 ;   

   for ( var ball_index = 0 ;
             ball_index < 10 ;
             ball_index ++ )
   {

      ball_center_x = 100 + 150 * ball_index ;

      if ( ball_index > 4 )
      {
         ball_center_x = 100 + 150 * ( ball_index - 5 ) ;
         ball_center_y = 375 ;
      }

      var new_ball = new ExplodingBouncer( ball_center_x,
                                           ball_center_y,
                                           ball_colors[ball_index],
                                           bouncing_area ) ;
      game_balls.push( new_ball ) ;
   }
}

function run_this_application(event)
{
   
  //Exercise 5 code
    if(game_is_being_played)  {
      //Exercise 2 code
        for ( var ball_index = 0 ;
                ball_index < game_balls.length ;
                ball_index ++ )
        { 
                   game_balls[ball_index].move() ;
        }


    }
    draw_on_canvas();

    //Exercise 6 code
    counter=0;
    for (let ball_index = 0; ball_index < game_balls.length; ball_index++) {
            const ball = game_balls[ball_index];
                if(ball.is_exploded()){
                    counter++;
                   
                }
        }
    if(counter==game_balls.length){
            counter=0;
            game_is_being_played=false;
            prepare_a_new_game();
            collision_counter.reset();
        }
   
   setTimeout( "run_this_application()", 40 ) ;
    }




</script> 

<style type="text/css">

   #centered
   {
      width:  800px;
      height: 600px;
      margin: 30px auto;  
      border: 1px solid black;
   }

</style> 
</head>

<body onload    = "prepare_a_new_game(); run_this_application(event);"
      onmousedown = "on_mouse_click( event )" onkeydown="on_space_key_down(event)">

   <div id="centered">
      <canvas id="bouncing_ball_canvas" width="800" height="600">
      </canvas>
   </div>
</body>
</html>



