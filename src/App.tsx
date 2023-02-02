import {useCallback, useState, useDeferredValue} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [card, setCard] =  useState([])
  const [page, setPage] = useState(0)
  // const deferredText = useDeferredValue(card)
  const handleChange = (value: string) => {
      const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&formatversion=2&srsearch=${value}&srnamespace=0&srlimit=30`
      fetch(url)
          .then((response) => response.json())
          .then((data) => setCard(data.query.search))
  };

  function NewHtml() {

      return (
        <div>
            {paginate(card, page).map((ele) => (
                <article>
                    <h3>{ele.title}</h3>
                    <p dangerouslySetInnerHTML={{__html: `${ele.snippet}`}}/>
                    <a href={`https://en.wikipedia.org/wiki/?curid=${ele.pageid}`} target={"_blank"}>Leia Mais</a>
                </article>
            ))}
        </div>
      )
  }

  const paginate = (data: any[],num:number) => {
      const start = num * 5;
      return data.slice(start, start + 5)
  }


  function Pages() {
      const itens = card.length / 5
      const arr = Array(itens).fill(0)
      return (
          <div>
              {
                  arr.map((ele,index) =>
                    <button onClick={() => setPage(index)} key={index}>{index + 1}</button>
                  )
              }
          </div>
      )
  }


  const debounce = (func:number) => {
      let timer;
      return function (...args) {
          const context = this;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
              timer = null;
              func.apply(context, args);
          }, 500);
      };
  };

  const optimizedFn = useCallback(debounce(handleChange), [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
          <input type={"text"} onChange={(e) => optimizedFn(e.target.value)}/>
      </div>

      <NewHtml />

      <Pages />
    </div>
  )
}

export default App
