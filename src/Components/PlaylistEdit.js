import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import AreaTracks from './AreaTracks';

export default function PlaylistEdit(props) {

  const [isLoading, setLoading] = useState(false);

  return (
    <Form onSubmit={handlerSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Название</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Новый плейлист"
          required
          value={props.info.name} 
          onChange={handlerChangeName}
        />
      </Form.Group>
      <Form.Group controlId="formTracks">
        <Form.Label>Треки</Form.Label>
        <AreaTracks 
          reorder 
          tracks={getInfoTracks(props.info.tracks, props.allTracks)}
          mode='edit'
          onChangeInfo={props.onChangeInfo}
        />
        <Button variant="link" onClick={props.onChangeMode}>Добавить</Button>
      </Form.Group>
      <Button 
        variant="primary" 
        type="submit"
        disabled={!props.wasModified || !isValidForm() || isLoading}
      >Применить</Button>
    </Form>
  );

  function handlerSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    setLoading(true);
    props.onSubmit().then( () => setLoading(false) );
  }

  function handlerChangeName(event) {
    const name = event.target.value;
    
    props.onChangeInfo({name: name});
  }

  function isValidForm() {
    if (!props.info.name.length) return false;
    if (!props.info.tracks.length) return false;

    return true;
  }
}

function getInfoTracks(tracksOfPlaylist, allTracks) {
  let infoTracks = [];
  for (let i in tracksOfPlaylist) {
  
    const objTrack = tracksOfPlaylist[i];
    let info = allTracks.find(track => track.uuid === objTrack.uuid);
  
    if (info) {
      let obj = Object.assign({}, info);
      obj.id = objTrack.id;
      infoTracks.push(obj);
    }
  }
  
  return infoTracks
}
