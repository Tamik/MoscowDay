import { css } from 'styled-components'

export const globalStyle = css`
  *,
  *:before,
  *:after {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: none;
    -webkit-user-select: none;
  }
  .eventsTabs > div:nth-child(2){
    margin: auto;
  }
  .eventsTabs > div:nth-child(2) > div{
    bottom: -1px !important;
  }

  .bottom-navigation {
    position: relative;
  }

  .timelineItem:last-child{
    border: none;
  }
  .timelineLine::before{
    content: "";
    display: block;
    position: relative;
    left: 3px;
    top: 7px;
    width: 1px;
    height: 100px;
    background-color: #607D8B;
  }
  .timelineLine::after{
    content: "";
    display: block;
    position: relative;
    left: 3px;
    top: -200px;
    width: 1px;
    height: 100px;
    background-color: #607D8B;
  }
  .timelineItem:first-child .timelineLine::after{
    display: none;
  }
  .timelineItem:last-child .timelineLine::before{
    display: none;
  }
  .timelineItem:last-child .timelineLine::after{
    top: -100px;
  }

  .swipable-view{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .modal-content-wrap{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .maps-wrap{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
  }
  .maps-wrap > div:first-child{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    height: 100% !important
  }
`
