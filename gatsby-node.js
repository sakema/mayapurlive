const path = require('path')
const _ = require('lodash')
const { createFilePath } = require('gatsby-source-filesystem')
// const { fmImagesToRelative } = require('gatsby-remark-relative-images')
// const locales = require('./src/constants/locales')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              locale
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(edge => {
      // Check if pages has a template key
      const locale = edge.node.frontmatter.locale
      if (edge.node.frontmatter.templateKey != null) {
        const id = edge.node.id
        createPage({
          path: edge.node.fields.slug,
          // path: `${edge.node.frontmatter.templateKey}/${edge.node.fields.slug}`,
          component: path.resolve(`src/templates/${String(edge.node.frontmatter.templateKey)}.js`),
          // additional data can be passed via context
          context: {
            id,
            locale,
            slug: edge.node.fields.slug
          }
        })
      }
    })
    // Tag pages:
    const tags = new Map()
    // Iterate through each post, putting all found tags into 'tags'
    posts.forEach(edge => {
      const locale = edge.node.frontmatter.locale
      const _tags = _.get(edge, 'node.frontmatter.tags')
      if (_tags) {
        _tags.forEach(_tag => {
          tags.set(_tag, { value: _tag, locale })
        })
        // tags.concat(edge.node.frontmatter.tags.map(tag => ({ value: tag, locale })))
      }
    })
    // Eliminate duplicate tags
    // tags = _.uniq(tags)
    // Make tag pages
    tags.forEach(({ value, locale }) => {
      const tagPath = `${locale}/tags/${_.kebabCase(value)}/`

      createPage({
        path: tagPath,
        component: path.resolve('src/templates/tags.js'),
        context: {
          tag: value,
          locale
        }
      })
    })
  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  const locales = { // FIXME: remove hardcode!
    en: {
      path: 'en',
      locale: 'English',
      default: true
    },
    ru: {
      path: 'ru',
      locale: 'Russian'
    }
  }
  return new Promise(resolve => {
    // deletePage(page)
    console.log('page', page.path)
    Object.keys(locales).map(lang => {
      // const localizedPath = locales[lang].default ? page.path : locales[lang].path + page.path
      const localizedPath = locales[lang].path + page.path

      return createPage({
        ...page,
        path: localizedPath,
        context: {
          locale: lang
        }
      })
    })
    resolve()
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  // fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    console.log('slug', value)
    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}
