// ==UserScript==
// @name         Hacker News
// @namespace    http://tampermonkey.net/
// @version      30
// @description  Make Hacker News more legible
// @author       Martin Gladdish
// @downloadURL  https://raw.githubusercontent.com/mgladdish/website-customisations/main/news.ycombinator.com/tampermonkey.js
// @updateURL    https://raw.githubusercontent.com/mgladdish/website-customisations/main/news.ycombinator.com/tampermonkey.js
// @supportURL   https://github.com/mgladdish/website-customisations
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license      MIT
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

      html[op='news'] .title,
      .votelinks, 
      .fatitem .title+.votelinks {
        vertical-align: inherit;
      }
      
      .comment-tree .votelinks,
      html[op='threads'] .votelinks,
      html[op='item'] .votelinks,
      xhtml[op='newcomments'] .votelinks{
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

      html[op='news']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newest']      #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='ask']         #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='newcomments'] #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='shownew']     #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1), 
      html[op='submitted']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1),
      html[op='favorites']   #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='front']       #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2),
      html[op='show']        #hnmain > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(2) {
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
      .toptext, a {
        color: black;
      }
      a:visited {
        color: #4c2c92;
      }
      a:hover {
        text-decoration: underline;
      }
      

      input {
        padding: var(--gutter);
      }
      input, textarea {
        background-color: white;
        border: 2px solid var(--colour-hn-orange);
        border-radius: var(--border-radius);
      }
      input[type='button'], input[type='submit'] {
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

    let nodes = [];

    function findElementContentsStartingWithQuoteChar(elementNames, nodes) {
        let node = null;
        elementNames.forEach(elementName => {
            const es = document.evaluate(`//${elementName}[starts-with(normalize-space(text()), '>')]`, document.body);
            while (node = es.iterateNext()) {
                nodes.push(node);
            }
        })
    }

    findElementContentsStartingWithQuoteChar(['i', 'p', 'span'], nodes);

    nodes.forEach((n) => {
        const textNode = Array.from(n.childNodes).find((n) => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
            const p = document.createElement('p');
            p.classList.add('quote');
            if (textNode.data.trim() === ">") {
                const quotedContent = textNode.nextSibling;
                p.innerText = quotedContent.innerHTML.trim();
                quotedContent.remove();
            } else {
                p.innerText = textNode.data.replace(">", "").trim();
            }
            n.firstChild.replaceWith(p);
        } else {
            n.classList.add('quote');
            n.innerText = n.innerText.replace(">", "");
        }
    });

    const addComment = document.querySelector("html[op='item'] .fatitem tr:last-of-type");
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
