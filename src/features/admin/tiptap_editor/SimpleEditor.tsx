import {  useState } from "react";

// => Tiptap packages
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
//import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

import Image from "@tiptap/extension-image";
import ResizableImage from 'tiptap-resize-image'
//import styles from "./input_letter_style.module.css";
import mystyles from "./content-editor.module.css"
//import { LinkModal } from "./LinkModal";
import styled from 'styled-components'

/*
  <SimpleEditor setContent={setMyContent} />
*/

const MenuBar = (props: { editor: any }) => {
  if (!props.editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Enter the image URL')

    if (url) {
      props.editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className='menu-bar'>
      <button
        onClick={() => props.editor.chain().focus().toggleBold().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={props.editor.isActive('bold') ? 'is-active' : ''}
      >
        bold
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleItalic().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={props.editor.isActive('italic') ? 'is-active' : ''}
      >
        italic
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleStrike().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={props.editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleCode().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={props.editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHighlight().run()}
        className={props.editor.isActive("highlight") ? "is-active" : ""}
      >
        Highlight
      </button>
      <button
        onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
        className={props.editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        left
      </button>
      <button
        onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
        className={props.editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        center
      </button>
      <button
        onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
        className={props.editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        right
      </button>
      <button onClick={() => props.editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => props.editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => props.editor.chain().focus().setParagraph().run()}
        className={props.editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={props.editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={props.editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={props.editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={props.editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={props.editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={props.editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleBulletList().run()}
        className={props.editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
        className={props.editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
        className={props.editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
        className={props.editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => props.editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => props.editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
        <button onClick={() => addImage()}>Image</button>
      <button
        onClick={() => props.editor.chain().focus().undo().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => props.editor.chain().focus().redo().run()}
        disabled={
          !props.editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
    </div>
  )
}

interface MyProps {
  initialContent: string | undefined;
  parentFunc: (text: string) => void
}


export function SimpleEditor(props: MyProps) {
 // export const SimpleEditor: React.FC<SimpleEditorProps> = (fn: setContent) => {

  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      ResizableImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      
    ],
    content: props.initialContent,
    onBlur: ({ editor }) => {
      console.log(" setting content......")
      //props.setContent({
        //console.log(editor.getHTML())
        
     // })
  }
  }) as Editor;
 
  if (!editor) {
    return null;
  }

  const get_content = () => {
    props.parentFunc(editor.getHTML())
  }
  const addImage = () => {
    const url = window.prompt('Enter the image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <Container>
    <div>
        <MenuBar editor={editor} />
      <EditorContent editor={editor} className={mystyles.content} />
      <button className='bg-amber-400 p-1 m-1 rounded-md' onClick={get_content}>GET CONTENT</button>
 
    </div>
    </Container>
  );
}

const Container = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;
  width: 75%;
  .title-inp{
      width: 100%;
      height: 1.5rem;
      margin: 1rem 0;
      padding: 0.2rem;
      border: none;
      border-bottom: 1px solid #000;
      outline: none;
      font-weight: 600;
      font-size: 1.2rem;
      transition: all 0.3s ease-in-out;
      &:focus{
          border-bottom: 1px solid #11ff09;
      }      
}
  .menu-bar{
    width: 100%;
    border: 1px solid #000;
    padding: 0.2rem;

    button {
    color: #000;
    outline: none;
    padding: 0.2rem;
    border: 1px solid #000;
    background: none;
    margin: 0.2rem 0.2rem;
    cursor: pointer;
    font-family: "JetBrainsMono", monospace;
    font-size: 1rem;
    
    &:hover {
      transform: translateY(-2px);
    }
    }
  }
  .content-editor{
      width: 100%;
      border:none;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      border-left: 1px solid #000;
      padding: 1rem;
  }
  .tags{
      width: 100%;
      height: 1.5rem;
      margin: 1rem 0;
      padding: 0.2rem;
      border: none;
      border-bottom: 1px solid #000;
      outline: none;
      font-weight: 600;
      font-size: 1.2rem;
      transition: all 0.3s ease-in-out;
      &:focus{
          border-bottom: 1px solid #00fbff;
      }
  }
  .preview-btn{
      border: none;
      outline: none;
      padding: 0.2rem;
      background: #76f329a4;
      color: #000;
      font-weight: 600;
      cursor: pointer;
  }

  /* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  outline: none;

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
      display: block;
      width: 85%;
      height: 85%;
      margin-left: auto;
      margin-right: auto;
      border-radius: 0.5rem;
      object-fit: cover;
    }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
 

`;