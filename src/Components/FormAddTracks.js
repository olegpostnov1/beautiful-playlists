import React from "react";
import { Form, Button } from 'react-bootstrap';
import AreaTracks from './AreaTracks';
import Helper from "../Helper";

export default class FormAddTracks extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      list: Helper.deepClone(props.tracks),
      added: []
    };

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.addToPlylist = this.addToPlylist.bind(this);
  }

  add(uuid) {
    this.setState((state) => {
      let added = state.added;
      added.push(uuid);

      let list = state.list;
      setIsAdded(list, uuid, true);

      return {
        list: list,
        added: added
      }
    })
  }

  remove(uuid) {
    this.setState((state) => {
      let list = state.list;
      setIsAdded(list, uuid, false);
      return {
        list: list,
        added: state.added.filter(item => item !== uuid)
      }
    })
  }

  addToPlylist() {
    const newTracks = this.state.added.map((uuid, inx) => {
      const id = this.props.lastId + inx + 1;
      return {
        id: '' + id,
        uuid: uuid
      }
    })

    this.props.onAddTracks(newTracks);
    this.props.onChangeMode();
  }

  render() {
    return (
      <Form>
        <Form.Group controlId="formTracks">
          <Form.Label>Все треки</Form.Label>
          <div className='scrollable'>
            <AreaTracks 
              tracks={this.state.list} 
              mode='add'
              onAdd={this.add}
              onRemove={this.remove}
            />          
          </div>
        </Form.Group>
        
        <Button 
          variant="primary" 
          onClick={this.addToPlylist}
          disabled={!this.state.added.length}
          style={{width: '90px'}}
        >ОК</Button>
        <Button variant="link" onClick={this.props.onChangeMode}>Отмена</Button>
      </Form>
    );
  }
}

function setIsAdded(list, id, value) {
  const inxTrack = list.findIndex(track => track.uuid === id);
  list[inxTrack].isAdded = value;
}