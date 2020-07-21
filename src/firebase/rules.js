import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';


function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Rules
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>For 3x3</h4>
        
      <div>1. Players take turns putting their marks (either X or O) in empty squares of the grid.<br/>
2. The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.<br/>
3. When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.
Loss -100<br/>
Hints -20<br/>
Undo -10 <br/>Points only given when played against AI and is in unlimited level.
          </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Rules() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Rules
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}