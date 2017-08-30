import { css } from 'styled-components'

export const globalStyle = css`
  *,
  *::before,
  *::after {
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

  .eventsTabs > div:nth-child(2) {
    margin: auto;
  }

  .eventsTabs > div:nth-child(2) > div {
    bottom: -1px !important;
  }

  .bottom-navigation {
    position: relative;
  }

  .timelineItem::after {
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(207, 216, 220, 0.35);
    width: 100%;
    height: 1px;
    z-index: 1;
    content: "";
  }

  .timelineItem:last-child {
    border: none;
  }

  .timelineLine::before {
    display: block;
    position: relative;
    left: 3px;
    top: 7px;
    background-color: #607D8B;
    width: 1px;
    height: 100px;
    content: "";
  }

  .timelineLine::after {
    display: block;
    position: relative;
    left: 3px;
    top: -200px;
    background-color: #607D8B;
    width: 1px;
    height: 100px;
    content: "";
  }

  .timelineItem:first-child .timelineLine::after {
    display: none;
  }

  .timelineItem:last-child .timelineLine::before {
    display: none;
  }

  .timelineItem:last-child .timelineLine::after {
    top: -100px;
  }

  .swipable-view {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .modal-content-wrap {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .maps-wrap {
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

  .maps-wrap > div:first-child {
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

  .btn-goto-mylocation {
    touch-action: none;
  }

  .btn-goto-mylocation:active {
    background-color: #33586b;
  }

  .btn-goto-mylocation__loading {
    background-color: #909ea5;
    transition: background-color 0.5s;
  }

  .btn-goto-mylocation__loading > svg {
    opacity: 0.8;
    transition: background-color 0.3s;
  }

  .simple-spinner {
    position: absolute;
    top: 35vh;
    left: 50vw;
    width: 40px;
    height: 40px;
    margin-left:-20px;
    z-index: 2000;
  }

  .simple-spinner__bounce1, .simple-spinner__bounce2 {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(96, 125, 139, 1);
    border-radius: 50%;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    animation: sk-bounce 2.0s infinite ease-in-out;
    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  }

  .simple-spinner__bounce2 {
    animation-delay: -1.0s;
    -webkit-animation-delay: -1.0s;
  }

  @-webkit-keyframes sk-bounce {
    0%, 100% {
      -webkit-transform: scale(0.0);
    }

    50% {
      -webkit-transform: scale(1.0);
    }
  }

  @keyframes sk-bounce {
    0%, 100% { 
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    }

    50% { 
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }

  .radar-spinner {
    position: absolute;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 100%;
    width: 56px;
    height: 56px;
    animation: sk-scaleout 1.0s infinite ease-in-out;
    -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
  }

  @-webkit-keyframes sk-scaleout {
    0% {
      -webkit-transform: scale(0);
    }

    100% {
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }

  @keyframes sk-scaleout {
    0% { 
      transform: scale(0);
      -webkit-transform: scale(0);
    } 100% {
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
      opacity: 0;
    }
  }
`
