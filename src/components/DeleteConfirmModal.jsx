import React from 'react';
import styled from 'styled-components';
import Theme from '../Theme';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background:  ${Theme.colors.whiteText};
  padding: 2rem;
  border-radius: 1rem;
  max-width: 40rem;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
`;

const Buttons = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  
  &.confirm {
    background-color: #e74c3c;
  }
  &.cancel {
    background-color: #7f8c8d;
  }
`;

export default function DeleteConfirmModal({ bookTitle, onConfirm, onCancel }) {
  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <ModalBox>
        <h2 id="delete-dialog-title">Delete Book</h2>
        <p>Are you sure you want to delete <strong>{bookTitle}</strong>?</p>
        <Buttons>
          <Button className="confirm" onClick={onConfirm}>Delete</Button>
          <Button className="cancel" onClick={onCancel}>Cancel</Button>
        </Buttons>
      </ModalBox>
    </Overlay>
  );
}
