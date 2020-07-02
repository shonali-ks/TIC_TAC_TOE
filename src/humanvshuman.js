import React, { Component } from 'react';
import Board from './board';

function nexthuman(squares,player,i){

    squares[i]=player? 'X':'O';  
    squares=squares;
    player=!player;

    return { icon:squares[i], squares:squares ,player:player};
    

}
export default nexthuman;