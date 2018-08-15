import React, { Component } from 'react'
import { Input, List, Pagination, Tag } from 'antd'
import moment from 'moment'
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
        total: Math.min(total_count, 1000), // github limitation
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
        <div className="issues">
          <div className="issues-search">
            <Input.Search
              value={query.username}
              enterButton
              placeholder="Enter the github username"
              onSearch={() => this.search() }
              onChange={e => this.onNameChange(e.target.value)} />
          </div>
          <div className="issues-hot-names">
            {
              this.hots.map(hot => (
                <Tag
                  className="hot-tag"
                  key={hot} 
                  onClick={() => this.onTagClick(hot)}>
                  {hot}
                </Tag>
              ))
            }
          </div>
          <div className="issues-list">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={items}
              renderItem={issueItem} />
          </div>
          <Pagination
            hideOnSinglePage
            pageSize={30}
            total={total}
            onChange={this.search}
            current={current} />
        </div>
      </div>
    );
  }
}


const toRepo = (original) => {
  const name =  original.replace('https://api.github.com/repos/', '') // may be
  return {
    name,
    repo_html_url: 'https://github.com/' + name
  }
}

function issueItem (item) {
  const { name, repo_html_url } = toRepo(item.repository_url)
  return (
    <List.Item className="issue-item">
      <List.Item.Meta
        description={
          <div className="issue-item-footer">
            <a href={repo_html_url}><i>{name}</i></a>
            <span>{moment(item.created_at).fromNow()}</span>
          </div>
        }
        title={<a href={item.html_url} target="_blank">{item.title}</a>}
      />
    </List.Item>
  )
}

export default App;
