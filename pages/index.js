import Link from "next/link";
import Header from "../components/header";
import React from "react";
import Video from "../components/video";
export default class Index extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="pt-3" />
          <div className="text-center">
            <Video url="kSetQroJe-U" visible={true} />
            <br />
            <span>
              <em>
                If this video does not autoplay, please click it. Otherwise this
                game <strong>will not work</strong>. Please then reload to see
                if it plays. If you're on firefox you might see an icon appear
                next to the url. Click that and enable it, and it will work.
              </em>
            </span>
            <br />
            <Link href="/join">
              <button
                type="button"
                className="mt-3 btn btn-outline-dark btn-lg"
              >
                Join Game
              </button>
            </Link>
            <br />

            <Link href="/host">
              <button
                type="button"
                className="mt-5 btn btn-outline-dark btn-lg"
              >
                Host Game
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
