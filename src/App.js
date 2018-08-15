import React, { Component } from 'react'
import { Input, List, Pagination, Tag, Affix } from 'antd'
import './App.css'

// eslint-disable-next-line
const octokit = new Octokit()

class App extends Component {
  hots = [
    'gaearon',
    'yyx990803',
    'addyosmani',
    'donnemartin',
  ]

  state = {
    query: {
      username: 'gaearon',
    },
    total: null,
    items: [],
    current: 1,
    loading: true,
  }

  search = (page = 1) => {
    const { username } = this.state.query
    this.setState({
      loading: true
    })
    octokit.search.issues({
      q: `involves:${username}`,
      page,
    }).then(({data, headers, status}) => {
      const { items, total_count } = data
      this.setState({
        current: page,
        items, 
        total: total_count, 
        loading: false,
      })
    }).catch((msg) => {
      this.setState({
        loading: false,
      })
    })
  }

  onNameChange = (username) => {
    this.setState({
      query: {
        username
      }
    })
  }

  onTagClick = (username) => {
    this.setState({
      query: { 
        username
      }
    }, () => {
      this.search()
    })
  }

  componentDidMount() {
    this.search()
  }

  render() {
    const { loading, items, total, query, current } = this.state
    return (
      <div className="App">
        <Affix offsetTop={10}>
          <div className="issues-search">
            <Input.Search
              value={query.username}
              enterButton
              placeholder="Enter the github username"
              onSearch={() => this.search() }
              onChange={e => this.onNameChange(e.target.value)} />
          </div>
        </Affix>
        <div className="issues-hot-names">
          {
            this.hots.map(hot => (
              <Tag key={hot} onClick={() => this.onTagClick(hot)}>{hot}</Tag>
            ))
          }
        </div>
        <div className="issues-list">
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={items}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<a href={item.html_url} target="_blank">{item.title}</a>}
                />
              </List.Item>
            )} />
        </div>
        <Pagination
          hideOnSinglePage
          pageSize={30}
          total={total}
          onChange={this.search}
          current={current} />
      </div>
    );
  }
}

export default App;
