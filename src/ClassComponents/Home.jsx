import React, { Component } from 'react'
import NewsItem from './NewsItem'

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      articles: [],
      totalResults: 0
    }
  }

  async getAPIData() {
    let response = await fetch(`https://newsapi.org/v2/everything?q=${this.props.search?this.props.search:this.props.q}&sortBy=publishedAt&language=${this.props.language}&apiKey=ca07a6c639094b1f887d6cd15ee85d15`)
    response = await response.json()
    if (response.status === "ok") {
      this.setState({
        articles: response.articles.filter(x=>x.title!=="[Removed]"),
        totalResults: response.totalResults
      })
    }
  }
  componentDidMount() {
    this.getAPIData()
}
  componentDidUpdate(oldprops) {
    console.log(window.location.href)
    if (this.props !== oldprops) {
      this.getAPIData()
    }
  }
  render() {
    return ( 
      <>
        <h5 className='background text-center p-2 my-1'>{this.props.q} News Aritcles</h5>
        <div className="row">
          {
            this.state.articles.map((item, index) => {
              return <NewsItem
                source={item.source?.name}
                title={item.title}
                description={item.description}
                url={item.url}
                pic={item.urlToImage}
                publishedAt={item.publishedAt}
                key={index} />
            })
          }
        </div>
      </>
    )
  }
}
