/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores,roundScore,activePlayer,dice,gamePlaying ;
//gamePlaying is a state variable that keeps whether the game is on, or has stopped(since there'a a winner) ,
//so that roll and hold button do not work after the winner is declared
init();     //initializing the game

//math.random() gives a random number between 0 and 1
//math.random()*6 gives a number between 0 and 5
//math.random()*6+1 gives a number between 1 and 6
//math.floor(4.6)=4

document.querySelector('.btn-roll').addEventListener("click",function()
{
    if(gamePlaying)
    {
    
    // 1. Random number 
    var dice=Math.floor(Math.random()*6)+1;

    //2. Display the results
    const diceDOM = document.querySelector('.dice');
    diceDOM.style.display='block';
    diceDOM.src='dice-'+dice+'.png';

    //3. Update the round score if the rolled number was not a one
    if(dice!==1)
    {
        //update the score
        roundScore+=dice;
        document.getElementById('current-'+activePlayer).textContent=roundScore;
    }
    else{
        //next player's turn
        nextPlayer();

        }
}    
});

document.querySelector('.btn-hold').addEventListener("click",function()
{
    if(gamePlaying)
    {
    
    //1. Add current score to global score
    scores[activePlayer]+=roundScore;

    //2.Update the Ui
    document.getElementById('score-'+activePlayer).textContent=scores[activePlayer];
    

    //3.Check if the player won the game
    if(scores[activePlayer]>=100)
    {
        document.getElementById('name-'+activePlayer).textContent='Winner!';
         //Hide the dice when winner is declared
    document.querySelector('.dice').style.display='none';
    //Changing the active player to winner player
    document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
    document.querySelector('.player-'+activePlayer+'-panel').classList.add('winner');
    gamePlaying=false;

    }
else
{
    nextPlayer();
}
        
}

});

function nextPlayer()
{
    
    activePlayer=== 0 ?activePlayer=1:activePlayer = 0;
    roundScore=0;
    var current0 = document.getElementById('current-0');
    var current1 = document.getElementById('current-1');
    current0.textContent='0';
    current1.textContent='0';

    //Toggling the classes through js
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
        
    //Hide the dice when 1 appears
    document.querySelector('.dice').style.display='none';
}

//Note1: we do not put () after the function name in addEbentListeber, since we are not clicking it.

document.querySelector(".btn-new").addEventListener("click",init);


function init()
{
    scores = [0,0];
    roundScore =0;
    activePlayer=0;//0 is the first player , 1 is the second player

    gamePlaying=true;

var current0 = document.getElementById('current-0');
var current1 = document.getElementById('current-1');
current0.textContent='0';
current1.textContent='0';
document.getElementById('score-0').textContent=0;
document.getElementById('score-1').textContent=0;
document.querySelector('#name-0').textContent='Player 1';
document.querySelector('#name-1').textContent='Player 2';

//Changing the css-so the dice is not displayed initially
document.querySelector('.dice').style.display='none';

//Removing the winner and active class
document.querySelector('.player-0-panel').classList.remove('winner');
document.querySelector('.player-1-panel').classList.remove('winner');
document.querySelector('.player-0-panel').classList.remove('active');
document.querySelector('.player-1-panel').classList.remove('active');

//Making the first player as the active player
document.querySelector('.player-0-panel').classList.add('active');


}



















