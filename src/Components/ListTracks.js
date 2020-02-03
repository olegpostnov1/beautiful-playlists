import React from "react";
import Track from './Track';
import { Draggable } from "react-beautiful-dnd";

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
        <div key={item.id} style={getItemStyle()}>
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

  function removeTrack(uuid) {
    
    const infoTrack = props.items.find(item => item.uuid === uuid);

    if (!window.confirm(`Удалить ${infoTrack.name}?`)) return;

    const arrTracks = props.items.filter(item => item.uuid !== uuid)
                                 .map(item => item.uuid);
    
    props.onChangeInfo({tracks: arrTracks})
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
  return tracks.map(function(info) {
    return {
      name: info.name,
      id: info.uuid,
      img: 'http://188.120.254.114' + info.image,
      isAdded: info.isAdded
    }
  })
}
