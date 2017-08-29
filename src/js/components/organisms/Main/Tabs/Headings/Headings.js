import React, { Component } from 'react'
import styled from 'styled-components'
import localforage from 'localforage'

import { Icon, CategoriesPack as IconsCategoriesPack } from 'components/atoms'
import { EventsList, Modal } from 'components/molecules'
import { MDApi } from 'utils'

const AppStore = localforage.createInstance({
  name: 'App',
})

const styles = {
  root: {
    WebkitFlexWrap: 'wrap',
    flexWrap: 'wrap',
    WebkitBoxPack: 'space-around',
    WebkitJustifyContent: 'center',
    justifyContent: 'space-around',
  },
}

const ICON_COLOR = '#607D8B'

const GridList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding-bottom: 10px;
  overflow-y: auto;
`
const GridItem = styled.div`
  display: flex;
  flex-basis: 150px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 110px;
  width: 49%;
  margin-bottom: 15px;
`

const IconWrap = styled.div`
  margin-top: 22px;
`

const CategoryTitle = styled.p`
  font-size: 12pt;
  color: rgba(69, 90, 100, 1);
`

export default class Headings extends Component {
  state = {
    isModalVisible: false,
    modalTitle: null,
    headings: [],
  }

  componentDidMount() {
    MDApi.getCategories({})
      .then(response => (response.json()))
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
      <div style={styles.root} className={'swipable-view'}>
        <GridList>
          {this.state.headings.map(heading => (
            <GridItem
              key={heading.id}
              onClick={() => this.openEventsViewModal(heading.title, heading.id)}
            >
              <IconWrap>
                <Icon
                  path={IconsCategoriesPack[heading.icon_name]}
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
