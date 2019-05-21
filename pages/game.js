import React from "react";
import Header from "../components/header";
import Video from "../components/video";
import Router from "next/router";
export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      players: {},
      song: 0,
      songURL: "",
      incorrect: false,
      correct: false,
      correctAwensers: [],
      correctAuthors: [],
      guess: "",
      playAudio: true,
      author: false
    };
    this.gameDoc = null;
    this.songs = 0;
  }
  static getInitialProps({ query }) {
    return { query };
  }
  componentDidMount() {
    db.collection("data")
      .doc("games")
      .onSnapshot(document => {
        var doc = document.get(this.props.query.code);
        this.gameDoc = doc;
        if (doc == null) {
          Router.push("/");
          return;
        }
        console.log(doc);
        if (doc.author == false && this.state.song == doc.song)
          this.setState({ songURL: "" });
        this.setState({
          players: doc.scores,
          running: doc.started,
          song: doc.song,
          playAudio: !doc.hostAudio,
          author: doc.author
        });
        db.collection("data")
          .doc("songs")
          .get()
          .then(doc => {
            var songData = doc.data();
            this.songs = songData.songs.length;
            this.setState({
              songURL: songData.songs[this.state.song].url,
              correctAwensers: songData.songs[this.state.song].awensers,
              correctAuthors: songData.songs[this.state.song].authors
            });
          });
      });
  }
  guess() {
    if (this.state.author) {
      if (this.state.correctAuthors.includes(this.state.guess.toLowerCase())) {
        this.setState({ correct: true, incorrect: false, author: false });
        this.nextSong();
      } else {
        this.setState({ incorrect: true, correct: false });
      }
    } else {
      if (this.state.correctAwensers.includes(this.state.guess.toLowerCase())) {
        this.setState({ correct: true, incorrect: false, author: true });
        if (this.state.correctAuthors == null) {
          this.nextSong();
        }
      } else {
        this.setState({ incorrect: true, correct: false });
      }
    }
  }
  nextSong() {
    if (this.gameDoc == null) return;
    this.gameDoc.scores[this.props.query.name] += 10;
    this.gameDoc.author = false;
    var newSong = Math.floor(Math.random() * this.songs);
    this.gameDoc.song = newSong;
    this.setState({ guess: "" });
    this.gameDoc.songCount++;
    if (this.gameDoc.songCount == 10) {
      db.collection("data")
        .doc("games")
        .set(
          {
            [this.props.query.code]: firebase.firestore.FieldValue.delete()
          },
          { merge: true }
        );
      return;
    } else {
      db.collection("data")
        .doc("games")
        .set(
          {
            [this.props.query.code]: this.gameDoc
          },
          { merge: true }
        );
      this.setState({ correct: true });
      return;
    }
  }
  render() {
    var qText = "SONG";
    if (this.state.author == true) qText = "AUTHOR";
    return (
      <div>
        <Header />
        <div className="container">
          <h1 className="text-center mt-3">Game: {this.props.query.code}</h1>
          <div className="text-center">
            {!this.state.running && (
              <div>
                <Video url="kSetQroJe-U" />
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
              <div className="row">
                <div className="col-3">
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
                <div className="col-9">
                  {this.state.playAudio && <Video url={this.state.songURL} />}
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder={qText + " NAME"}
                      value={this.state.guess}
                      onChange={e => this.setState({ guess: e.target.value })}
                    />
                    <div className="input-group-append">
                      <button
                        onClick={() => this.guess()}
                        className="btn btn-success"
                        type="button"
                      >
                        Guess!
                      </button>
                    </div>
                  </div>
                  <br />
                  {this.state.incorrect && (
                    <div class="alert alert-danger" role="alert">
                      incorrect!
                    </div>
                  )}
                  {this.state.correct && (
                    <div class="alert alert-success" role="alert">
                      correct!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
