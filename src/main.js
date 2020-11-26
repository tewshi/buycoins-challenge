/** @format */

import './assets/reset.css'
import './assets/main.css'

import { loader } from 'graphql.macro'

const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
// extend so we can call dayjs(...).fromNow()
dayjs.extend(relativeTime)

// load graphql query from file
const query = loader('./assets/.graphql')

const token = process.env.ACCESS_TOKEN
const baseUrl = process.env.API_URL

/**
 * Query the girhub graphql endpoint
 */
const fetchData = () => {
  fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({ query: query.loc.source.body }),
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((body) => body.data)
    .then((data) => data.user)
    .then((user) => {
      // find all the elements by their ID and modify their content
      const headerAvatar = document.getElementById('header-avatar')
      const headerUserLogin = document.getElementById('header-user-login')
      const hCardAvatar = document.getElementById('h-card-avatar')
      const hCardEmoji = document.getElementById('status-emoji')
      const hCardText = document.getElementById('status-text')
      const hCardEmoji2 = document.getElementById('status-emoji-2')
      const hCardText2 = document.getElementById('status-text-2')
      const hCardName = document.getElementById('vcard-fullname')
      const hCardLogin = document.getElementById('vcard-username')
      const hCardBio = document.getElementById('user-profile-bio')
      const repositoriesCounter = document.getElementById('repositories-count')
      const projectsCounter = document.getElementById('projects-count')
      const repositoriesCounter2 = document.getElementById('repositories-count-2')
      const projectsCounter2 = document.getElementById('projects-count-2')
      const repos = document.getElementById('repositories-wrapper')

      headerAvatar.src = user.avatarUrl
      headerAvatar.alt = `@${user.login}`
      headerUserLogin.innerText = `${user.login}`
      hCardAvatar.src = user.avatarUrl
      hCardAvatar.alt = `@${user.login}`
      hCardEmoji.innerHTML = user.status.emojiHTML
      hCardEmoji2.innerHTML = user.status.emojiHTML
      hCardText.innerText = user.status.message
      hCardText2.innerText = user.status.message
      hCardName.innerText = user.name
      hCardLogin.innerText = user.login
      hCardBio.innerHTML = user.bioHTML
      repositoriesCounter.innerText = user.repositories.totalCount
      projectsCounter.innerText = user.projects.totalCount
      repositoriesCounter2.innerText = user.repositories.totalCount
      projectsCounter2.innerText = user.projects.totalCount

      // use fragment to prevent multiple DOM redraws
      const fragment = document.createDocumentFragment()
      const repositories = user.repositories.nodes || []

      // add each repositofy to the list
      repositories.forEach((repo, i) => {
        const el = document.createElement('li')
        const nameWrap = document.createElement('div')
        const nameHeadOuter = document.createElement('div')
        const nameHead = document.createElement('h3')
        const repoLabel = document.createElement('span')
        const repoName = document.createElement('a')
        nameHeadOuter.classList.add('repository-name')
        nameWrap.classList.add('width-9')
        repoName.innerText = repo.name
        repoName.setAttribute('href', repo.url)

        nameHead.appendChild(repoName)

        if (repo.isPrivate) {
          el.classList.add('private')
          repoLabel.classList.add('label')
          repoLabel.innerText = 'Private'
          nameHead.appendChild(repoLabel)
        }

        nameHeadOuter.appendChild(nameHead)
        nameWrap.appendChild(nameHeadOuter)

        if (repo.description) {
          const descOuter = document.createElement('div')
          descOuter.classList.add('repository-description')
          descOuter.innerHTML = repo.descriptionHTML
          nameWrap.appendChild(descOuter)
        }

        const detailsOuter = document.createElement('div')
        const detailsLangWrap = document.createElement('span')
        const detailsLangColor = document.createElement('span')
        const detailsLang = document.createElement('span')
        detailsOuter.classList.add('repository-details')
        detailsLangColor.classList.add('repo-language-color')
        detailsLangColor.setAttribute('style', `background-color: ${(repo.primaryLanguage && repo.primaryLanguage.color) || '#000'}`)
        detailsLang.innerText = (repo.primaryLanguage && repo.primaryLanguage.name) || 'N/A'
        detailsLangWrap.appendChild(detailsLangColor)
        detailsLangWrap.appendChild(detailsLang)

        detailsOuter.appendChild(detailsLangWrap)

        const detailsStarWrap = document.createElement('span')
        const detailsStarLink = document.createElement('a')
        detailsStarLink.classList.add('muted-link')
        detailsStarLink.setAttribute('href', '#')
        detailsStarLink.innerHTML = `<svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"> <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg> ${repo.stargazerCount} `

        detailsStarWrap.appendChild(detailsStarLink)
        detailsOuter.appendChild(detailsStarWrap)

        const detailsForksWrap = document.createElement('span')
        const detailsForksLink = document.createElement('a')
        detailsForksLink.classList.add('muted-link')
        detailsForksLink.setAttribute('href', '#')
        detailsForksLink.innerHTML = `<svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"> <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path> </svg> ${repo.forkCount} `

        detailsForksWrap.appendChild(detailsForksLink)
        detailsOuter.appendChild(detailsForksWrap)

        const updated = dayjs(repo.updatedAt)

        const detailsUpdatedWrap = document.createElement('span')
        const detailsUpdated = document.createElement('relative-time')
        detailsUpdatedWrap.innerHTML = 'Updated&nbsp;'
        detailsUpdated.setAttribute('datetime', repo.updatedAt)
        detailsUpdated.setAttribute('title', updated.format('DD MMM YYYY, HH:mm'))
        if (updated.diff(dayjs(), 'day') < -7) {
          if (updated.year() === dayjs().year()) {
            detailsUpdated.innerText = `on ${updated.format('DD MMM')}`
          } else {
            detailsUpdated.innerText = `on ${updated.format('DD MMM YYYY')}`
          }
        } else {
          detailsUpdated.innerText = updated.fromNow()
        }

        detailsUpdatedWrap.appendChild(detailsUpdated)
        detailsOuter.appendChild(detailsUpdatedWrap)

        nameWrap.appendChild(detailsOuter)

        const actionsWrap = document.createElement('div')
        const actionsOuter = document.createElement('div')
        const actionsOuterWrap = document.createElement('div')
        const actionsForm = document.createElement('form')
        const actionsButton = document.createElement('button')
        actionsWrap.classList.add('width-3')
        actionsOuter.classList.add('repository-actions')
        actionsButton.setAttribute('type', 'button')
        actionsButton.classList.add('btn', 'btn-sm')

        if (repo.viewerHasStarred) {
          actionsButton.setAttribute('value', 'Unstar')
          actionsButton.setAttribute('aria-label', 'Unstar this repository')
          actionsButton.setAttribute('title', `Unstar ${user.login}/${repo.name}`)
          actionsButton.innerHTML =
            '<svg class="octicon octicon-star-fill mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg> Unstar'
        } else {
          actionsButton.setAttribute('value', 'Star')
          actionsButton.setAttribute('aria-label', 'Star this repository')
          actionsButton.setAttribute('title', `Star ${user.login}/${repo.name}`)
          actionsButton.innerHTML =
            '<svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" ><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg> Star'
        }

        actionsForm.appendChild(actionsButton)
        actionsOuterWrap.appendChild(actionsForm)
        actionsOuter.appendChild(actionsOuterWrap)
        actionsWrap.appendChild(actionsOuter)

        el.appendChild(nameWrap)
        el.appendChild(actionsWrap)
        fragment.appendChild(el)
      })

      repos.appendChild(fragment)

      // remove loading class so app renders everything at once
      document.body.classList.remove('loading')
      setTimeout(() => {
        document.body.classList.add('done')
      }, 1000)
    })
    .catch((err) => {
      console.log('an Error occurred fetching data from API')
      console.log(err)
    })
}

window.onload = (ev) => {
  // fetch data from api on window load
  fetchData()
  const header = document.getElementById('header')
  const hamburger = document.getElementById('hamburger')

  // expand and collapse hamburger menu on mobile
  hamburger.addEventListener('click', (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    header.classList.toggle('nav-open')
  })
}

window.onresize = (ev) => {
  const header = document.getElementById('header')
  if (window.innerWidth >= 768 && header.classList.contains('nav-open')) {
    // remove class for tablets and Pcs
    header.classList.remove('nav-open')
  }
}
