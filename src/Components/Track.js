import React, {useState} from 'react';
import { Button, Media } from "react-bootstrap";
import ImageModal from './ImageModal';

export default function Track(props) {

  const [isShowImage, setIsShowImage] = useState(false);

  return (
    <>
      <Media className='track' style={getStyleTrack()}>
        <img
          width={100}
          height={100}
          className="align-self-center mr-3"
          src={props.info.img}
          alt='Изображение трека'
          onClick={() => setIsShowImage(true)}
        />
        <Media.Body className="align-self-center mr-3">
          <h6>{props.info.name}</h6>
        </Media.Body>
        <Button 
          variant="link" 
          className="align-self-center" 
          onClick={() => action(props.info.id)}
        >{props.mode === 'edit' ? 'Удалить' : props.info.isAdded ? 'Отмена' : 'Добавить'}</Button>
      </Media>
      <ImageModal
        show={isShowImage}
        onHide={() => setIsShowImage(false)}
        info={props.info}
      />
    </>
  )

  function action(uuid) {
    const handler = isRemove(props) ? props.onRemove : props.onAdd;

    handler(uuid);
  }

  function getStyleTrack() {
    if (!props.info.isAdded) return;

    return {
      background: 'lightgreen'
    }
  }
}

function isRemove(props) {
  return props.mode === 'edit' || props.info.isAdded
}