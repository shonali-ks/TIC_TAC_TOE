import React, { Component } from 'react';
import Board from './board';

function nexthuman(square,player,i,isAi,computer){

    square[i]=player? 'X':'O';  
    
    //console.log(square);
    if(!isAi)
    {player=!player;computer=false;}
    else
    {
        computer=!computer;
        player=!player;
    }

    return { "icon":square[i], "squares":square ,"player":player,"computer":computer};
    
    
    

}
export default nexthuman;