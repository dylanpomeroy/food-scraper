import react, { useState } from 'react';
import GearIcon from '../public/settings-gear.svg';
import Modal from 'react-modal';

const Config = ({ pageRoot }: { pageRoot: any }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [removeSubstringsText, setRemoveSubstringsText] = useState('');

  return (
  <span>
    <Modal isOpen={isModalOpen} appElement={pageRoot.current}>
      <h2>Settings</h2>

      <h3>Remove substrings</h3>
      <p>
        Any ingredient that contains a string you enter here will be excluded from the grocery list.
        Use this to exclude ingredients you will not need to buy (for example: rice, if you have a big bag at home).
      </p>
      <p>
        Enter values separated by newlines.
      </p>
      <textarea
        value={removeSubstringsText}
        onChange={(event) => setRemoveSubstringsText(event.target.value)}
        style={{
          display: 'block',
          height: '200px',
        }}
      />

      <button onClick={() => setIsModalOpen(false)}>Save &amp; Close</button>
    </Modal>
    <button
      style={{
        width: '80px',
        position:
        'absolute',
        right: '16px',
        top: '24px',
        background: 'white',
        border: '0px'
      }}
      onClick={() => setIsModalOpen(true)}
      >
      <GearIcon />
    </button>
  </span>
  )
}

export default Config;