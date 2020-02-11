import React from "react";
import ListTracks from './ListTracks';
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function AreaTracks(props) {

  if (props.reorder) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ListTracks 
                reorder 
                items={props.tracks} 
                mode={props.mode}
                onChangeInfo={props.onChangeInfo}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }

  return (
    <ListTracks 
      items={props.tracks} 
      mode={props.mode}
      onRemove={props.onRemove}
      onAdd={props.onAdd}
    />
  )

  function onDragEnd(resultDrag) {
    
    // dropped outside the list
    if (!resultDrag.destination) return;

    reorder(
      props,
      resultDrag.source.index,
      resultDrag.destination.index
    );
  }
}

function reorder(props, startIndex, endIndex) {

  const tracks = Array.from(props.tracks);
  const [removed] = tracks.splice(startIndex, 1);
  tracks.splice(endIndex, 0, removed);

  const newTracks = tracks.map(function(item) {
    return {
      id: item.id,
      uuid: item.uuid
    }
  });

  props.onChangeInfo({tracks: newTracks});
};
