import React, {useState} from 'react';
import { Button, Media } from "react-bootstrap";
import ImageModal from './ImageModal';
import * as Icon from 'react-bootstrap-icons';

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
        >{getIconBtn()}</Button>
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

  function getIconBtn() {
    if (props.mode === 'edit') return <Icon.Trash size={32}/>

    return props.info.isAdded ? <Icon.Dash size={44}/> : <Icon.Plus size={44}/>
  }
}
