import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Node } from 'slate'
import {
  SlatePlugins,
  createDeserializeHTMLPlugin,
  serializeHTMLFromNodes,
  deserializeHTMLToDocumentFragment,
  useSlatePluginsActions,
} from '@udecode/slate-plugins'

import {
  InlineToolbarElements,
  initialValueEmpty,
  defaultPlugins,
  components,
  editor,
  options,
} from './options'

const editableProps = {
  placeholder: 'Share...',
  style: {
    padding: '15px',
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    cursor: 'text',
    borderRadius: '2px',
    marginBottom: '1em',
    minHeight: '60px',
  },
}

const serializePlainText = (nodes) => {
  return nodes.map((n) => Node.string(n)).join('\n')
}

const OnPageEditor = ({ id = '', feedId = '', content = '', postEntry }) => {
  const eid = id + 'editor'
  const [editorValue, setEditorValue] = useState(null)
  const { setValue, resetEditor } = useSlatePluginsActions(eid)

  const plugins = useMemo(() => {
    const p = [...defaultPlugins]
    p.push(createDeserializeHTMLPlugin({ plugins: p }))
    return p
  }, [])

  const initialValue = useMemo(() => {
    if (content) {
      try {
        // how to test content is raw?
        return JSON.parse(content)
      } catch (e) {
        // fail safe to html parse
        return deserializeHTMLToDocumentFragment(editor, {
          plugins,
          element: content,
        })
      }
    }
    return initialValueEmpty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  // TODO:
  // automatic save
  useEffect(() => {
    // if (editorValue) {
    //   const html = serializeHTMLFromNodes(editor, {
    //     plugins,
    //     nodes: editorValue,
    //   });
    //   console.log(html);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue])

  const onChange = (slateValue) => {
    // console.log(JSON.stringify(slateValue));
    setEditorValue(slateValue)
  }

  const onPostEntry = () => {
    if (!editorValue) {
      return
    }

    const htmlBody = serializeHTMLFromNodes(editor, {
      plugins,
      nodes: editorValue,
    })
    console.log(htmlBody)
  }

  return (
    <div className="sharebox">
      <InlineToolbarElements />
      <SlatePlugins
        id={eid}
        plugins={plugins}
        components={components}
        options={options}
        editableProps={editableProps}
        initialValue={initialValue}
        onChange={(newValue) => {
          onChange(newValue)
        }}
      />
      <div className="post">
        <span className="max_info"></span>
        <input
          className="submit"
          type="submit"
          value="submit"
          onClick={onPostEntry}
        />
      </div>
    </div>
  )
}

export default OnPageEditor

const rootElement = document.getElementById('root')
ReactDOM.render(<OnPageEditor />, rootElement)
