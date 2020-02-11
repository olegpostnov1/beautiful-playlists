import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import FormWrap from './FormWrap';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      infoPlaylist: {
        name: '',
        tracks: []
      },
      allTracks: [],
      isLoading: false,
      isModeAddTracks: false,
      wasModified: false,
      isError: false
    };

    this.backupInfo = {
      name: '',
      tracksStr: ''
    };

    this.handlerChangeMode = this.handlerChangeMode.bind(this);
    this.changeInfo = this.changeInfo.bind(this);
    this.apply = this.apply.bind(this);
    this.getLastId = this.getLastId.bind(this);
  }

  componentDidMount() {
    // pull data

    this.setState({isLoading: true});

    const idPlaylist = getIdPlaylist();

    pull(idPlaylist).then(
      (result) => {
        const [allTracks, infoPlaylist] = result;
        
        this.setState({
          allTracks: allTracks.data
        });

        if (infoPlaylist) {
          const data = preparePullData(infoPlaylist.data[0]);
          
          this.setState({
            infoPlaylist: {
              name: data.name,
              tracks: data.tracks,
              id: idPlaylist
        }
          });
        
          this.backupInfo = backup(data.name, infoPlaylist.data[0].tracks);
        }
        
        this.setState({isLoading: false});
      
      }, 
      (error) => {
        this.setState({
          isLoading: false,
          isError: true
        });
        console.log('ERROR', error);
      });
  }

  handlerChangeMode() {
    this.setState((state) => {
      return {
        isModeAddTracks: !state.isModeAddTracks
      }
    });
  }

  changeInfo(param) {
    const current = this.state.infoPlaylist;

    const info = {
      name: typeof param.name !== 'undefined' ? param.name : current.name,
      tracks: param.tracks ? param.tracks : current.tracks,
      id: current.id
    }

    this.setState({
      infoPlaylist: info,
      wasModified:  checkModified(info, this.backupInfo)
    });
  }

  apply() {
    var data = preparePushData(this.state.infoPlaylist);
    return push(data)
      .then(
        (result) => {
          window.location.href = window.location.origin + `/playlist/${result.playlist}/`;
        },
        (error) => {
          this.setState({
            isError: true
          })
          console.log('error', error)
        }
      );
  }

  getLastId() {
    const arrId = this.state.infoPlaylist.tracks.map(track => parseInt(track.id));

    return Math.max.apply(null, arrId)
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="6">
            <div className="wrap-main">
              <h3>Создать плейлист</h3>
              <div className="wrap-playlist">
                <FormWrap
                  isLoading={this.state.isLoading} 
                  isModeAddTracks={this.state.isModeAddTracks}
                  infoPlaylist={this.state.infoPlaylist}
                  allTracks={this.state.allTracks}
                  onChangeMode={this.handlerChangeMode}
                  onChangeInfo={this.changeInfo}
                  onSubmit={this.apply}
                  wasModified={this.state.wasModified}
                  lastId={this.getLastId()}
                />
              </div>
            </div>
            {
              this.state.isError && (<Alert variant='danger'>Что-то пошло не так...</Alert>)
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

function getIdPlaylist() {
  const pathUrl = window.location.pathname;

  if (pathUrl.indexOf('playlist/update/') === -1) return null;

  const id = pathUrl.split('/')[3]; // /playlist/edit/<id>/...

  return id;
}

function pull(idPlaylist) {

  const origin = window.location.origin;

  let fetches = [fetchAllTracks()];
  if (idPlaylist) fetches.push(fetchInfoPlaylist(idPlaylist));
  
  return Promise.all(fetches);

  function fetchAllTracks() {
    const path = origin + "/api/list_tracks";
    
    return fetch(path).then(res => res.json());
  }

  function fetchInfoPlaylist(id) {
    const path = `${origin}/api/playlist/${id}/`;

    return fetch(path).then(res => res.json())
  }
}

function push(data) {

  var origin = window.location.origin;
  
  const path = origin + "/api/save_playlist";
  
  const options = {
    method: 'POST',
    body: JSON.stringify(data)
  }

  return fetch(path, options).then(res => res.json())
}

function backup(name, tracks) {
  return {
    name: name,
    tracksStr: JSON.stringify(tracks)
  }
}

function checkModified(current, backup) {
    
    if (current.name !== backup.name) return true;

    const curTracks = current.tracks.map(track => track.uuid);

    if (JSON.stringify(curTracks) !== backup.tracksStr) return true;

    return false;
}

function preparePullData(data) {
  return {
    name: data.name,
    tracks: data.tracks.map(function(uuid, index) {
      return {
        id: '' + index, // индекс внутри приложения для однозначной идентификации при удалении
        uuid: uuid // индекс в бд
      }
    })
  }
}

function preparePushData(data) {
  return {
    id: data.id,
    name: data.name,
    tracks: data.tracks.map(track => track.uuid)
  }
}