import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { updateFeedItem } from '../api/feed-api'
import { FeedItem } from '../types/FeedItem'

enum UploadState {
  NoFetch,
  Fetching,
}

interface EditFeedProps {
  match: {
    params: {
      feedId: string
    }
  },
  location: {
    state: {
      feedItem: FeedItem
    }
  }
  auth: Auth
}

interface EditFeedState {
  feedItem: FeedItem,
  uploadState: UploadState
}

export class EditFeed extends React.PureComponent<EditFeedProps,EditFeedState> {

  constructor(props: EditFeedProps) {
    super(props);
    this.state = {
      feedItem: this.props.location.state.feedItem,
      uploadState: UploadState.NoFetch
    }

  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {

      this.setUploadState(UploadState.Fetching)
      await updateFeedItem(this.props.auth.getIdToken(), this.state.feedItem)
      
      alert('File was edited!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoFetch)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
            <Form.Field>
            <label>Name</label>
            <input
              placeholder='My awesome image'
              value={this.state.feedItem.name}
              onChange={ e => this.setState({ feedItem: { ...this.state.feedItem, name: e.target.value }})}
            />
          </Form.Field>
          <Form.Field>
            <label>Caption</label>
            <input 
              placeholder='Me in some place'
              value={this.state.feedItem.caption}
              onChange={ e => this.setState({ feedItem: { ...this.state.feedItem, caption: e.target.value }})}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.Fetching && <p>Editing image data</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoFetch}
          type="submit"
        >
          Edit
        </Button>
      </div>
    )
  }
}
