import React from "react";
import Link from "next/link";
import Header from "../components/header";
import Video from "../components/video";
export default class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      players: {},
      gameDone: false,
      gameCode: "000000",
      song: 0,
      songURL: "",
      playAudio: false
    };
    this.gameDoc = null;
  }
  static getInitialProps({ query }) {
    return { query };
  }
  componentDidMount() {
    var random =
      "" +
      Math.floor(Math.random() * 10) +
      "" +
      Math.floor(Math.random() * 10) +
      "" +
      Math.floor(Math.random() * 10) +
      "" +
      Math.floor(Math.random() * 10) +
      "" +
      Math.floor(Math.random() * 10) +
      "" +
      Math.floor(Math.random() * 10);
    this.setState({ gameCode: random });
    db.collection("data")
      .doc("games")
      .set(
        {
          [random]: {
            scores: {},
            song: 0,
            songCount: 0,
            started: false,
            hostAudio: false
          }
        },
        { merge: true }
      );
    db.collection("data")
      .doc("games")
      .onSnapshot(document => {
        var doc = document.get(this.state.gameCode);
        this.gameDoc = doc;
        if (doc == null) {
          this.setState({ gameDone: true });
          return;
        }
        console.log(doc);
        this.setState({
          players: doc.scores,
          running: doc.started,
          song: doc.song,
          playAudio: doc.hostAudio
        });
        db.collection("data")
          .doc("songs")
          .get()
          .then(doc => {
            var songData = doc.data();
            this.songs = songData.songs.length;
            this.setState({
              songURL: songData.songs[this.state.song].url
            });
          });
      });
  }
  startGame() {
    this.gameDoc.started = true;
    db.collection("data")
      .doc("games")
      .set({ [this.state.gameCode]: this.gameDoc }, { merge: true });
  }
  switchHostAudio() {
    this.gameDoc.hostAudio = !this.gameDoc.hostAudio;
    db.collection("data")
      .doc("games")
      .set({ [this.state.gameCode]: this.gameDoc }, { merge: true });
  }
  componentWillUnmount() {
    db.collection("data")
      .doc("games")
      .set(
        { [this.state.gameCode]: firebase.firestore.FieldValue.delete() },
        { merge: true }
      );
  }
  render() {
    return (
      <div>
        <Header />
        <div className="container text-center">
          {!this.state.running && (
            <h1 className="text-center">Game Code: {this.state.gameCode}</h1>
          )}
          {this.state.running && !this.state.gameDone && (
            <h1 className="text-center">Game Running</h1>
          )}
          {this.state.gameDone && <h1 className="text-center">Game Done!</h1>}
          <h2 className="text-center">Players</h2>
          {!this.state.running && (
            <div>
              <ul className="list-group">
                {Object.keys(this.state.players).map(val => {
                  return (
                    <li className="list-group-item" key={val}>
                      {val}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {this.state.running && (
            <div>
              {this.state.playAudio && <Video url={this.state.songURL} />}
              <table className="table table-bordered table-dark col-sm-12 col-md-3">
                <thead className="thead-light">
                  <tr>
                    <th>Username</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(this.state.players).map(key => {
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{this.state.players[key]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!this.state.running && (
            <button
              onClick={() => this.startGame()}
              className="btn btn-outline-success btn-lg"
            >
              Start Game
            </button>
          )}
          {!this.state.running && this.state.hostAudio && (
            <button
              className="btn btn-outline-dark"
              onClick={() => this.switchHostAudio()}
            >
              Turn host audio off
            </button>
          )}
          {!this.state.running && !this.state.hostAudio && (
            <button
              className="btn btn-outline-dark"
              onClick={() => this.switchHostAudio()}
            >
              Turn host audio on
            </button>
          )}
          {this.state.gameDone && (
            <Link href="/">
              <button className="btn btn-outline-primary btn-lg">Return</button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
