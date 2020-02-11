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
          onClick={() => action(props.info)}
        >{props.mode === 'edit' ? 'Удалить' : props.info.isAdded ? 'Отмена' : 'Добавить'}</Button>
      </Media>
      <ImageModal
        show={isShowImage}
        onHide={() => setIsShowImage(false)}
        info={props.info}
      />
    </>
  )

  function action(info) {

    if (props.mode === 'edit') return props.onRemove(info.id)
    if (props.mode === 'add' && info.isAdded) return props.onRemove(info.uuid)

    return props.onAdd(info.uuid)
  }

  function getStyleTrack() {
    if (!props.info.isAdded) return;

    return {
      background: 'lightgreen'
    }
  }
}
