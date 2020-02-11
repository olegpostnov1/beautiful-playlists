import React from "react";
import Track from './Track';
import { Draggable } from "react-beautiful-dnd";
import Helper from '../Helper';

export default function ListTracks(props) {

  const items = prepareInfoTracks(props.items);

  if (props.reorder) {
    return (
      <>
        {items.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
                <Track
                  info={item}
                  mode={props.mode}
                  onRemove={removeTrack}
                />
              </div>
            )}
          </Draggable>
        ))}
      </>
    )
  }

  return (
    <>
      {items.map((item, index) => (
        <div key={item.uuid} style={getItemStyle()}>
          <Track 
            info={item} 
            mode={props.mode}
            onRemove={props.onRemove}
            onAdd={props.onAdd}
            style={getItemStyle()}
          />    
        </div>
      ))}
    </>
  );

  function removeTrack(id) {
    
    const inxTrack = props.items.findIndex(item => item.id === id);
    if (inxTrack === -1) return;

    if (!window.confirm(`Удалить ${props.items[inxTrack].name}?`)) return;

    let tracks = Helper.deepClone(props.items);
    tracks.splice(inxTrack, 1);

    tracks = tracks.map(function(track) {
      return {
        id: track.id,
        uuid: track.uuid
      }
    });
    
    props.onChangeInfo({tracks: tracks})
  }

  function getItemStyle(isDragging, draggableStyle) {
    return {
      userSelect: "none",
      margin: `0 0 5px 0`,
      background: 'white',
      ...draggableStyle
    }
  };
}

function prepareInfoTracks(tracks) {
  const origin = window.location.origin;
  return tracks.map(function(info) {
    return {
      name: info.name,
      id: info.id,
      uuid: info.uuid,
      img: origin + info.image,
      isAdded: info.isAdded
    }
  })
}
