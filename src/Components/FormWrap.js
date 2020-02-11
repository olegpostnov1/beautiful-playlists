import React from "react";
import { Spinner } from "react-bootstrap";
import PlaylistEdit from './PlaylistEdit';
import FormAddTracks from './FormAddTracks';

export default function FormWrap(props) {
  
  const formPlaylistEdit = (
    <PlaylistEdit 
      info={props.infoPlaylist}
      allTracks={props.allTracks}
      onChangeInfo={props.onChangeInfo}
      onChangeMode={props.onChangeMode}
      onSubmit={props.onSubmit}
      wasModified={props.wasModified}
    />
  );
  
  const formAddTracks = (
    <FormAddTracks 
      tracks={props.allTracks}
      lastId={props.lastId}
      onChangeMode={props.onChangeMode}
      onAddTracks={handlerAddTracks}
    />
  );

  const spinner = (
    <div className="d-flex justify-content-center align-items-center wrap-spinner">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>

    </div>
  );

  if (props.isLoading) return spinner;
  
  if (props.isModeAddTracks) return formAddTracks;

  return formPlaylistEdit

  function handlerAddTracks(added) {
    const list = props.infoPlaylist.tracks.concat(added);

    props.onChangeInfo({tracks: list});
  }
}
