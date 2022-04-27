import react, { useEffect, useState } from 'react';
import GearIcon from '../public/settings-gear.svg';
import Modal from 'react-modal';
import { SettingsData } from '../utils/types';
import axios from 'axios';

const Config = ({ pageRoot }: { pageRoot: any }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [removeSubstringsText, setRemoveSubstringsText] = useState('');
  const [orderSubstringsText, setOrderSubstringsText] = useState('');

  const saveSettings = async () => {
    const settingsObject: SettingsData = {
      removeSubstrings: removeSubstringsText?.split('\n').filter(value => !!value) ?? [],
      orderSubstrings: orderSubstringsText?.split('\n').filter(value => !!value) ?? [],
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

      if (response.data.orderSubstrings) {
        setOrderSubstringsText(response.data.orderSubstrings.join('\n'))
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

      <h3>Order substrings</h3>
      <p>
        Use this list to determine the sort order of the ingredients in your grocery list. This is helpful for grouping
        and ordering items as they appear in your grocery store, and saves you from having to sort them manually.
      </p>
      <p>
       For example, if you start at produce, then the meat section, then the aisles, you may want something like:
      </p>
      <ul>
        <li>lime</li>
        <li>carrot</li>
        <li>chicken</li>
        <li>pasta</li>
        <li>tomato paste</li>
      </ul>
      <p>
        Enter one value on each line.
      </p>
      <textarea
        value={orderSubstringsText}
        onChange={(event) => setOrderSubstringsText(event.target.value)}
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