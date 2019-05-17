import React from "react";
import Router from "next/router";
import Header from "../components/header";
export default class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
    this.codeRef = React.createRef();
    this.nameRef = React.createRef();
  }
  joinGame() {
    if (this.codeRef.current.value.length != 6) {
      this.setState({ err: "Code not right length!" });
      return;
    }
    if (this.codeRef.current.value.length == 0) {
      this.setState({ err: "You need a name!" });
    }
    db.collection("data")
      .doc("games")
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          var doc = doc.get(this.codeRef.current.value);
          if (doc != null) {
            if (doc.started == false) {
              doc.scores[this.nameRef.current.value] = 0;
              db.collection("data")
                .doc("games")
                .set(
                  {
                    [this.codeRef.current.value]: doc
                  },
                  { merge: true }
                );
              Router.push({
                pathname: "/game",
                query: {
                  code: this.codeRef.current.value,
                  name: this.nameRef.current.value
                }
              });
            } else {
              this.setState({ err: "Game running!" });
            }
          } else {
            this.setState({ err: "Game not found!" });
          }
        }
      });
  }
  render() {
    return (
      <div>
        <Header />
        <div className="container mt-3">
          <div className="row">
            <table className="table table-bordered table-dark col-sm-12 col-md-3">
              <thead className="thead-light">
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Work in</td>
                  <td>progress</td>
                </tr>
              </tbody>
            </table>
            <div className="col-sm-12 col-md-9 text-center">
              <input
                className="form-control form-control-lg text-center"
                placeholder="CODE"
                ref={this.codeRef}
              />
              <input
                className="form-control form-control-lg text-center"
                placeholder="USERNAME"
                ref={this.nameRef}
              />
              <button
                onClick={() => this.joinGame()}
                className="btn btn-outline-dark btn-lg mt-3"
              >
                JOIN
              </button>
              {this.state.err != null && (
                <div className="mt-3 alert alert-danger" role="alert">
                  There is an error: {this.state.err}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
