import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import recipePrinter from '../utils/goodfoodRecipePrinter'
import ReactMarkdown from 'react-markdown'
import { GoodfoodRecipeListItem } from '../utils/types'

const Home = () => {
  const [responseMarkdown, setResponseMarkdown] = useState<string>('')
  const [recipeListData, setRecipeListData] = useState<GoodfoodRecipeListItem[]>([])
  const [pickedRecipeLinks, setPickedRecipeLinks] = useState<string[]>([])

  useEffect(() => {
    parseRecipesPage()
  }, [])

  const submitUrls = async () => {
    const recipeData = await axios.post('/api/recipes', {
      recipeUrls: pickedRecipeLinks,
    })

    const today = new Date()
    const dateString = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`
    setResponseMarkdown(recipePrinter.getMarkdownPageContent(recipeData.data, dateString))
  }

  const parseRecipesPage = async () => {
    console.log('invoking parse recipes page...')
    const recipeListData: any = await axios.get('/api/recipes')

    setRecipeListData(recipeListData.data);
    console.log(recipeListData.data)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Goodfood Scraper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Goodfood Scraper
        </h1>

        <h2>
          Recipe list for this week
        </h2>
        <p style={{ fontSize: '20px'}}>Picked <b>{pickedRecipeLinks.length}</b> recipes</p>
        <div style={{border: '1px solid black', height: '600px', width: '100%', overflow: 'scroll'}}>
          {recipeListData.map(((recipeData, index) =>
            <div key={index} style={{width: '400px', height: '400px', display: 'inline-block', margin: '8px'}}>
              <a href={recipeData.link} target='_blank'>
                <img src={recipeData.image} style={{width: '100%'}} />
              </a>
              <div style={{display: 'inline-block', width: '70%', height: '150px'}}>
                <h3>{recipeData.title}</h3>
                <h4>{recipeData.detail}</h4>
              </div>
              <button
                style={pickedRecipeLinks.includes(recipeData.link) ? { background: 'green', padding: '20px' } : { background: 'white', padding: '20px' }}
                onClick={() => {
                  const indexOfPickedLink = pickedRecipeLinks.indexOf(recipeData.link)
                  if (indexOfPickedLink == -1) {
                    setPickedRecipeLinks(pickedRecipeLinks.concat(recipeData.link))
                  } else {
                    setPickedRecipeLinks(pickedRecipeLinks.splice(indexOfPickedLink, indexOfPickedLink))
                  }
                }}>
                  {pickedRecipeLinks.includes(recipeData.link) ? 'Picked' : 'Pick me'}</button>
            </div>
          ))}
        </div>

        <button onClick={() => submitUrls()}>Submit</button>

        <div style={{border: '1px solid black'}}>
          <textarea readOnly value={responseMarkdown} rows={100} cols={100} />
        </div>
      </main>
    </div>
  )
}

export default Home