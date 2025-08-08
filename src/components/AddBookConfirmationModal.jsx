import React from 'react';
import styled from 'styled-components';
import Theme from '../Theme';

const ModalOverlay = styled.div`
 position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
 background:  ${Theme.colors.whiteText};
  padding: 2rem;
  border-radius: 1rem;
  max-width: 30rem;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1.5rem;
  background: ${Theme.colors.primary};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  color:  ${Theme.colors.whiteText};
  cursor: pointer;
  font-size: 1.4rem;

  &:hover {
    opacity: 0.85;
  }
`;

export default function AddBookConfirmationModal({ title, onClose }) {
  return (
    <ModalOverlay>
      <ModalContent>
        <p>Added <strong>"{title}"</strong> to your library!</p>
        <CloseButton onClick={onClose}>OK</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}
