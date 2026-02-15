import type { MarkdownTransformContext } from '@slidev/types'
import { defineTransformersSetup } from '@slidev/types'
import lz from 'lz-string'

function transformD2(ctx: MarkdownTransformContext) {
  ctx.s.replace(
    /^```d2 *(\{[^\n]*\})?\n([\s\S]+?)\n```/gm,
    (full: string, options = '', code = '') => {
      code = code.trim()
      options = options.trim() || '{}'
      const encoded = lz.compressToBase64(code)
      return `<D2Diagram code-lz="${encoded}" v-bind="${options}" />`
    },
  )
}

export default defineTransformersSetup(() => {
  return {
    preCodeblock: [transformD2],
  }
})
