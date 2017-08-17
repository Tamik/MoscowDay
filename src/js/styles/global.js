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
  .timelineItem:last-child {
    border: none;
  }
  .timelineLine::before {
    content: "";
    display: block;
    position: relative;
    left: 3px;
    top: 7px;
    width: 1px;
    height: 63px;
    background-color: #607D8B;
  }
  .timelineItem:last-child .timelineLine::before{
    display: none;
  }
  .swipable-view{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
`
