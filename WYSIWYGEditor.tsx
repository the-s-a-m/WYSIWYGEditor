import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faUndo, faRedo, faFont, faBold, faStrikethrough, faAlignLeft,
    faAlignCenter, faAlignRight, faAlignJustify,
    faIndent, faOutdent, faListUl, faListOl, faLink,
    faUnlink, faImage, faSubscript, faSuperscript, faItalic, faUnderline
} from '@fortawesome/free-solid-svg-icons';

//Based on
//https://code.tutsplus.com/tutorials/create-a-wysiwyg-editor-with-the-contenteditable-attribute--cms-25657
//https://codepen.io/Shokeen/pen/pgryyN

interface WYSIWYGEditorState {
    content: string,
    onUpdate: (updatedContent: string) => void,
}

export class WYSIWYGEditor extends React.Component<WYSIWYGEditorState, WYSIWYGEditorState> {
    constructor(props: WYSIWYGEditorState) {
        super(props);

        this.state = {
            content: props.content,
            onUpdate: props.onUpdate,
        };
    }

    componentDidMount() {
        var editorContent = document.getElementById('WYSIWYGEditorContent');
        if (editorContent != undefined) {
            editorContent.innerHTML = this.state.content;
        }
    }
    
    runCommand = (command: string) => (ev: React.ChangeEvent<any>) => {
        ev.preventDefault();
        if (command == 'h1' || command == 'h2' || command == 'h3' || command == 'h4' || command == 'h5' || command == 'p') {
            document.execCommand('formatBlock', false, command);
        }
        if (command == 'createlink') {
            var url = prompt('Enter the link here: ', 'http:\/\/');
            document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, null);
        }
        this.onInputChanged();
    }

    uploadImage = () => (event: React.ChangeEvent<any>) => {
        var tgt = event.target || (window.event != undefined ? window.event.srcElement : undefined);
        var files = tgt.files;
        if (FileReader && files && files.length > 0) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (e.target != null) {
                    var result = e.target.result;

                    var editorContent = document.getElementById('WYSIWYGEditorContent');
                    if (editorContent != undefined) {
                        var image = document.createElement('img');
                        image.src = result;
                        editorContent.appendChild(image);
                    }
                }
            }
            reader.onerror = function(evt) {
                alert('Could not load image');
            }
            reader.readAsDataURL(files[0]);
        }
        this.onInputChanged();
    }

    onInputChanged()  {
        var editorContent = document.getElementById('WYSIWYGEditorContent');
        if (editorContent != undefined) {
            this.state.onUpdate(editorContent.innerHTML);
        }
    }

    render(): JSX.Element | null {
        return <div className="height90">
            <div className="toolbar">
                <a href="#" onClick={this.runCommand("undo")}><FontAwesomeIcon icon={faUndo}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("redo")}><FontAwesomeIcon icon={faRedo}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("bold")}><FontAwesomeIcon icon={faBold}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("italic")}><FontAwesomeIcon icon={faItalic}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("underline")}><FontAwesomeIcon icon={faUnderline}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("strikeThrough")}><FontAwesomeIcon icon={faStrikethrough}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("subscript")}><FontAwesomeIcon icon={faSubscript}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("superscript")}><FontAwesomeIcon icon={faSuperscript}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("justifyLeft")}><FontAwesomeIcon icon={faAlignLeft}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("justifyCenter")}><FontAwesomeIcon icon={faAlignCenter}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("justifyRight")}><FontAwesomeIcon icon={faAlignRight}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("justifyFull")}><FontAwesomeIcon icon={faAlignJustify}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("indent")}><FontAwesomeIcon icon={faIndent}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("outdent")}><FontAwesomeIcon icon={faOutdent}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("insertUnorderedList")}><FontAwesomeIcon icon={faListUl}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("insertOrderedList")}><FontAwesomeIcon icon={faListOl}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("p")}>P</a>&nbsp;
                <a href="#" onClick={this.runCommand("h1")}>H1</a>&nbsp;
                <a href="#" onClick={this.runCommand("h2")}>H2</a>&nbsp;
                <a href="#" onClick={this.runCommand("h3")}>H3</a>&nbsp;
                <a href="#" onClick={this.runCommand("h4")}>H4</a>&nbsp;
                <a href="#" onClick={this.runCommand("h5")}>H5</a>&nbsp;
                &nbsp;&nbsp;
                <a href="#" onClick={this.runCommand("createlink")}><FontAwesomeIcon icon={faLink}></FontAwesomeIcon></a>&nbsp;
                <a href="#" onClick={this.runCommand("unlink")}><FontAwesomeIcon icon={faUnlink}></FontAwesomeIcon></a>&nbsp;
                &nbsp;&nbsp;
                <input type="file" onChange={this.uploadImage()}/><FontAwesomeIcon icon={faImage}></FontAwesomeIcon>&nbsp;
            </div>
            <div id="WYSIWYGEditorContent" contentEditable={true} className="height90"
                onInput={(ev) => this.onInputChanged()}>
                {this.state.content}
            </div>
        </div>
    }
}