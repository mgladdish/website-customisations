// ==UserScript==
// @name         Hacker News
// @namespace    http://tampermonkey.net/
// @version      18
// @description  Make Hacker News more legible
// @author       Martin Gladdish
// @downloadURL  https://raw.githubusercontent.com/mgladdish/website-customisations/main/news.ycombinator.com/tampermonkey.js
// @updateURL    https://raw.githubusercontent.com/mgladdish/website-customisations/main/news.ycombinator.com/tampermonkey.js
// @supportURL   https://github.com/mgladdish/website-customisations
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// ==/UserScript==

const tampermonkeyScript = function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend", `<style>
      :root {
        --colour-hn-orange: #ff6600;
        --colour-hn-orange-pale: rgba(255, 102, 0, 0.05);
        --gutter: 0.5rem;
        --border-radius: 3px;
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

      .votelinks, html[op='news'] .title {
        vertical-align: inherit;
      }
      
      .comment-tree .votelinks, 
        html[op='threads'] .votelinks, 
        html[op='newcomments'] .votelinks {
        vertical-align: top;
      }

      span.titleline {
        font-size: 1rem;
        margin-top: var(--gutter);
        margin-bottom: var(--gutter);
        display: block;
      }
      
      html[op='item'] span.titleline {
        font-size: 1.2rem;
      }

      .rank {
        display: none
      }

      #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
        html[op='front'] #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
        html[op='show']  #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2) {
         margin-left: var(--gutter);
      }

      .sitebit.comhead {
        margin-left: var(--gutter);
      }

      .subtext, .subline {
        font-size: .75rem;
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
        border-radius: var(--border-radius);
      }
      input[type='button'] {
        cursor: pointer;
      }   


      /* Custom styles added via javascript */

      .downvoted {
        background-color: rgb(245, 245, 245);
        border-radius: var(--border-radius);
        padding: 6px;
      }
      .downvoted .commtext {
        color: black;
        font-size: smaller;
      }
      
      .quote {
        border-left: 3px solid var(--colour-hn-orange);
        padding: 6px 6px 6px 9px;
        font-style: italic;
        background-color: var(--colour-hn-orange-pale);
        border-radius: var(--border-radius);
      }
      
      .hidden {
        display: none;
      }

      .showComment a, .hideComment, .hideComment:link, .hideComment:visited {
        color: var(--colour-hn-orange);
        text-decoration: underline;
      }
      .hideComment {
        margin-left: var(--gutter);
      }

    </style>`);

    const comments = document.querySelectorAll('.commtext');
    comments.forEach(e => {
        if (!e.classList.contains('c00')) {
            e.parentElement.classList.add('downvoted');
        }
    });

    let node = null;
    let nodes = [];
    const ps = document.evaluate("//p[starts-with(., '>')]", document.body)
    while (node = ps.iterateNext()) {
        nodes.push(node);
    }
    const spans = document.evaluate("//span[starts-with(., '>')]", document.body)
    while (node = spans.iterateNext()) {
        nodes.push(node);
    }
    nodes.forEach((n) => {
        const textNode = Array.from(n.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
            const p = document.createElement('p');
            p.classList.add('quote');
            p.innerText = textNode.data.replace(">", "");
            n.firstChild.replaceWith(p);
        } else {
            n.classList.add('quote');
            n.innerText = n.innerText.replace(">", "");
        }
    });

    const addComment = document.querySelector("html[op='item'] .fatitem tr:nth-of-type(4)");
    if (addComment) {
        addComment.classList.add('hidden');
        const showComment = document.createElement('tr');
        showComment.innerHTML = `
           <td colspan='2'></td>
           <td>
             <a href='#'>show comment box</a>
           </td>
        `;
        showComment.classList.add('showComment');
        showComment.querySelector('a').addEventListener('click', (e) => {
            showComment.classList.toggle('hidden');
            addComment.classList.toggle('hidden');
        });
        addComment.parentNode.insertBefore(showComment, addComment);

        const hideComment = document.createElement('a');
        hideComment.setAttribute('href', '#');
        hideComment.innerText = 'hide comment box';
        hideComment.classList.add('hideComment');
        hideComment.addEventListener('click', (e) => {
            showComment.classList.toggle('hidden');
            addComment.classList.toggle('hidden');
        });

        const commentForm = document.querySelector("form[action='comment']");
        commentForm.append(hideComment);
    }
}

tampermonkeyScript();
