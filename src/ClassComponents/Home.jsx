import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';

import NewsItem from './NewsItem'

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      articles: [],
      totalResults: 0,
      page: 1
    }
  }

  async getAPIData(page) {
    let response = await fetch(`https://newsapi.org/v2/everything?q=${this.props.search ? this.props.search : this.props.q}&pageSize=12&page=${page}}&sortBy=publishedAt&language=${this.props.language}&apiKey=ca07a6c639094b1f887d6cd15ee85d15`)
    response = await response.json()
    if (response.status === "ok") {
      if (page === 1) {
        this.setState({
          articles: response.articles.filter(x => x.title !== "[Removed]"),
          totalResults: response.totalResults
        })
      }
      else {
        this.setState({
          articles: this.state.articles.concat(response.articles.filter(x => x.title !== "[Removed]")),

        })
      }
    }

  }

  fetchData = () => {
    this.getAPIData(this.state.page + 1)
    this.setState({ page: this.state.page + 1 })
  }
  componentDidMount() {
    this.getAPIData(1)
  }
  componentDidUpdate(oldprops) {
    console.log(window.location.href)
    if (this.props !== oldprops) {
      this.getAPIData(1)
    }
  }
  render() {
    return (
      <>
        <h5 className='background text-center p-2 my-1 text-capitalize'>{this.props.search ? this.props.search : this.props.q} News Aritcles</h5>
        <InfiniteScroll
          dataLength={this.state.articles.length} //This is important field to render the next data
          next={this.fetchData}
          hasMore={this.state.articles.length < this.state.totalResults}
          loader={<div className='my-3 text-center'>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>}
        >
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
        </InfiniteScroll>
      </>
    )
  }
}
