import React, { Component } from 'react'
import localforage from 'localforage'

import { Modal, EventsList } from 'components/modals'
import styled from 'styled-components'
import Icon from 'atoms/Icon'
import CategoryIconsPack from 'atoms/iconsPacks/CategoryIconsPack'

import MDApi from 'utils/MDApi'

const AppStore = localforage.createInstance({
  name: 'App',
})

const styles = {
  root: {
    display: 'flex',
    display: 'webkit-box',
    display: '-webkit-flex',
    flexWrap: 'wrap',
    WebkitFlexWrap: 'wrap',
    justifyContent: 'space-around',
    WebkitBoxPack: 'space-around',
    WebkitJustifyContent: 'center',
  },
}

const ICON_COLOR = '#607D8B'

const GridList = styled.div`
  display: flex;
  display: webkit-box;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: space-around;
  -webkit-box-pack: space-around;
  -webkit-justify-content: center;
  padding-bottom: 10px;
  overflow-y: auto;
`
const GridItem = styled.div`
  display: flex;
  display: webkit-box,
  display: -webkit-flex,
  flex-basis: 150px;
  -webkit-flex-basis: 150px;
  flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  height: 110px;
  width: 49%;
  margin-bottom: 15px;
`

const IconWrap = styled.div`
  margin-top: 22px;
`

const CategoryTitle = styled.p`
  color: rgb(69, 90, 100);
  font-size: 12pt;
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
    AppStore.getItem('client_id')
      .then((clientId) => {
        const object = {}
        object[`${title} (id: ${catId})`] = {
          client_id: clientId,
        }
        window.appMetrica.reportEvent('Просмотр категории', object)
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
            <GridItem
              key={heading.id}
              onClick={() => this.openEventsViewModal(heading.title, heading.id)}
            >
              <IconWrap>
                <Icon
                  path={CategoryIconsPack[heading.icon_name]}
                  size='56px'
                  viewBox='0 0 512 512'
                  color={ICON_COLOR}
                />
              </IconWrap>
              <CategoryTitle>{heading.title} ({heading.events_count})</CategoryTitle>
            </GridItem>
          ))}
        </GridList>
        <Modal
          isOpen={this.state.isModalVisible}
          title={this.state.modalTitle}
          isVisibleTopBar
          content={<EventsList event={this.state} />}
          close={this.closeEventsViewModal}
        />
      </div>
    )
  }
}
