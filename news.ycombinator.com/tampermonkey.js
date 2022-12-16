// ==UserScript==
// @name         Hacker News
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Martin Gladdish
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_addStyle
// ==/UserScript==



(function() {
    'use strict';

    GM_addStyle(`

      :root {
        --colour-hn-orange: #ff6600;
        --gutter: 0.5rem;
      }

      /* Reset font everywhere */
      html, body, td, .title, .comment, .default {
        font-family: 'Verdana', 'Arial', sans-serif;
      }

      html, body {
        margin-top: 0;
      }

      body {
        padding: 0;
        margin: 0;
      }

      body, td, .title, .pagetop, .comment {
        font-size: 1rem;
      }

      html[op='news'] .votelinks, html[op='news'] .title, .fatitem .votelinks {
        vertical-align: inherit;
      }

      span.titleline {
        display: block;
        font-size: 1.2rem;
        margin-top: var(--gutter);
        margin-bottom: var(--gutter);
      }

      html[op='news'] span.titleline {
        font-size: 1rem;
      }

      .rank {
        display: none
      }

      html[op='news'] #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1)  {
        margin-left: var(--gutter);
      }

      .sitebit.comhead {
        margin-left: var(--gutter);
      }



      #hnmain {
        width: 100%;
        background-color: white;
      }

      /* Menu bar */

      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding: var(--gutter);
      }
      #hnmain > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) {
        padding-right: var(--gutter) !important;
      }


      .comment, .toptext {
        max-width: 40em;
      }

      input {
        padding: var(--gutter);
      }

      input, textarea {
        background-color: white;
        border: 2px solid var(--colour-hn-orange);
        border-radius: 3px;
      }


      /* Custom styles added via javascript */

      .downvoted {
        border-left: 3px solid red;
        padding-left: 6px;
      }
    `);

    const comments = document.querySelectorAll('.commtext');
    comments.forEach(e => {
        if (!e.classList.contains('c00')) {
            e.parentElement.classList.add('downvoted');
        }
    });
})();
