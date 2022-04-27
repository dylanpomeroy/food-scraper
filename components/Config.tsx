import react, { useEffect, useState } from 'react';
import GearIcon from '../public/settings-gear.svg';
import Modal from 'react-modal';
import { SettingsData } from '../utils/types';
import axios from 'axios';

const Config = ({ pageRoot }: { pageRoot: any }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [removeSubstringsText, setRemoveSubstringsText] = useState('');

  const saveSettings = async () => {
    const settingsObject: SettingsData = {
      removeSubstrings: removeSubstringsText?.split('\n').filter(value => !!value) ?? [],
      sortSubstrings: [],
    }

    await axios.post('/api/settings', settingsObject)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await axios.get<SettingsData>('/api/settings')

      console.log(response)
      if (response.data.removeSubstrings) {
        setRemoveSubstringsText(response.data.removeSubstrings.join('\n'))
      }
    }

    fetchSettings()
  }, [])

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
        Enter one value on each line.
      </p>
      <textarea
        value={removeSubstringsText}
        onChange={(event) => setRemoveSubstringsText(event.target.value)}
        style={{
          display: 'block',
          height: '200px',
        }}
      />

      <button onClick={() => {
        setIsModalOpen(false)
        saveSettings()
      }}>Save &amp; Close</button>
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