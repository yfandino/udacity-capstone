import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Modal,
  Form,
  Dimmer
} from 'semantic-ui-react'

import { createFeedItem, deleteFeedItem, getFeed, updateFeedItem } from '../api/feed-api'
import Auth from '../auth/Auth'
import { FeedItem } from '../types/FeedItem'
import { CreateFeedItemRequest } from '../types/CreateFeedItemRequest'
import { Link } from 'react-router-dom'

interface FeedProps {
  auth: Auth
  history: History
}

interface FeedState {
  feed: FeedItem[]
  newFeedName: string,
  newFeedCaption: string,
  loadingFeed: boolean,
  modalOpen: boolean,
  isUploading: boolean,
  [x: string]: any,
}

export class Feed extends React.PureComponent<FeedProps, FeedState> {
  state: FeedState = {
    feed: [],
    newFeedName: '',
    newFeedCaption: '',
    loadingFeed: true,
    modalOpen: false,
    isUploading: false
  }

  handleModalClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ modalOpen: false })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFeedName: event.target.value })
  }

  handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFeedCaption: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fileName: string = event.target.files![0].name.split('.').shift() || '';
    this.setState({ newFile: event.target.files![0], newFeedName: fileName })
  }

  onEditButtonClick = (feedId: string) => {
    this.props.history.push(`/feed/${feedId}/edit`)
  }

  onFeedCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.state.newFile) {
      alert('File should be selected')
      return
    }
    try {

      const item: CreateFeedItemRequest = {
        name: this.state.newFeedName,
        file: this.state.newFile
      }

      if(this.state.newFeedCaption) {
        item.caption = this.state.newFeedCaption
      }

      this.setState({ isUploading: true })
      const newFeedItem = await createFeedItem(this.props.auth.getIdToken(), item)
      this.setState({
        feed: [...this.state.feed, newFeedItem],
        newFeedName: '',
        isUploading: false,
        modalOpen: false
      })
    } catch {
      this.setState({ isUploading: false, modalOpen: false })
      alert('Feed creation failed')
    }
  }

  onUpdateFeed = async (pos: number) => {
    try {
      const feedItem = this.state.feed[pos]
      await updateFeedItem(this.props.auth.getIdToken(), feedItem)
      this.setState({
        feed: update(this.state.feed, {
          [pos]: { $set: feedItem }
        })
      })
    } catch {
      alert('Feed update failed')
    }
  }

  onFeedDelete = async (feedId: string) => {
    try {
      await deleteFeedItem(this.props.auth.getIdToken(), feedId)
      this.setState({
        feed: this.state.feed.filter( feedItem => feedItem.id != feedId)
      })
    } catch {
      alert('Feed deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const feed = await getFeed(this.props.auth.getIdToken())
      this.setState({
        feed,
        loadingFeed: false
      })
    } catch (e) {
      alert(`Failed to fetch feed: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">My images</Header>

        {this.renderCreateFeedInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateFeedInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Modal 
            open={this.state.modalOpen}
            onClose={this.handleModalClose}
            trigger={<Button onClick={() => this.setState({ modalOpen: true })}>Add new image</Button>}
          >
          <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <input type="file" accept="image/*" placeholder="Image to upload" onChange={this.handleFileChange}/>
                </Form.Field>
                <Form.Field>
                  <label>Name</label>
                  <input placeholder='My awesome image' value={this.state.newFeedName} onChange={this.handleNameChange}/>
                </Form.Field>
                <Form.Field>
                  <label>Caption</label>
                  <input placeholder='Me in some place' onChange={this.handleCaptionChange}/>
                </Form.Field>
                {this.state.isUploading ? 
                  <Button loading>Loading</Button>
                  : <Button type='submit' onClick={this.onFeedCreate}>Submit</Button>
                }
              </Form>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingFeed) {
      return this.renderLoading()
    }

    return this.renderFeedList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Feed
        </Loader>
      </Grid.Row>
    )
  }

  renderFeedList() {
    return (
      <Grid padded>
        {this.state.feed.map((feedItem, pos) => {
          return (
            <Grid.Row key={feedItem.id}>
              <Grid.Column width={10} verticalAlign="middle">
                {feedItem.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {feedItem.caption}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Link 
                  to={{
                    pathname: `/feed/${feedItem.id}/edit`,
                    state: {
                      feedItem
                    }
                  }}
                >
                  <Button
                    icon
                    color="blue"
                  >
                    <Icon name="pencil" />
                  </Button>
                </Link>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFeedDelete(feedItem.id)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {feedItem.url && (
                <Image src={feedItem.url} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
