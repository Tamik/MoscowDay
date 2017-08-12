import React, { Component } from 'react'

import { Modal } from 'components/modals'
import { EventsList } from 'components/modals'
import styled from 'styled-components'
import Icon from 'material-ui/svg-icons/social/sentiment-neutral'
import MDApi from 'utils/MDApi'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }
}

const GridList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: -10px;
  overflow-y: auto;
`
const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  width: 49%;
  margin-bottom: 10px;
`
const Image = styled.img`
  display: block;
  width: 100%;
  height: 60px;
  object-fit: cover;
`

export default class Headings extends Component {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     isModalVisible: false,
  //     modalTitle: null,
  //     headings: [],
  //   }

  //   this.openEventsViewModal = this.openEventsViewModal.bind(this)
  //   this.closeEventsViewModal = this.closeEventsViewModal.bind(this)
  // }
  state = {
    isModalVisible: false,
    modalTitle: null,
    headings: [],
  }

  componentDidMount() {
    MDApi.getCategories({})
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.setState({
          headings: response.data,
        })
      })
  }

  openEventsViewModal = (title, catId) => {
    this.setState({
      id: catId,
      type: 'headings',
      isModalVisible: true,
      modalTitle: title,
    })
  }

  closeEventsViewModal = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <GridList>
          {this.state.headings.map(heading => (
            <GridItem key={heading.id} onClick={() => this.openEventsViewModal(heading.title, heading.id)}>
              {/*<Image src=""/>*/}
              <Icon style={{width: 60, height: 60}}/>
              <p>{heading.title} ({heading.events_count})</p>
            </GridItem>
          ))}
        </GridList>
        <Modal
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle}
          isVisibleTopBar={true}
          content={<EventsList event={this.state} />}
          close={this.closeEventsViewModal}
        />
      </div>
    )
  }
}
