import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import recipePrinter from '../utils/goodfoodRecipePrinter'
import ReactMarkdown from 'react-markdown'

const Home = () => {
  const [inputString, setInputString] = useState<string>('')
  const [responseMarkdown, setResponseMarkdown] = useState<string>('')

  const handleInputChanged = (e: any) => {
    setInputString(e.target.value)
  }

  const submitUrls = async () => {
    const recipeData = await axios.post('/api/recipes', {
      recipeUrls: inputString.split('\n').filter(inputLine => !inputLine.match(/^\s*$/))
    })

    console.log(recipeData.data)

    setResponseMarkdown(recipePrinter.getMarkdownPageContent(recipeData.data, "01/03/2021"))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Goodfood Scraper
        </h1>

        <textarea onChange={e => handleInputChanged(e)} rows={10} cols={50} />
        <button onClick={() => submitUrls()}>Submit</button>

        <div style={{border: '1px solid black'}}>
          <textarea readOnly value={responseMarkdown} rows={100} cols={100} />
        </div>
      </main>
    </div>
  )
}

export default Home