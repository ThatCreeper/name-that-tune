export default function Video(props) {
  var autoplay = props.autoplay || 1;
  var visible = props.visible || false;
  var style = {};
  if (!visible) {
    style = { width: 0, height: 0, border: 0, border: "none" };
  }
  return (
    <div>
      <iframe
        title="video"
        width="560"
        height="315"
        src={
          "https://www.youtube-nocookie.com/embed/" +
          props.url +
          "?controls=0&autoplay=" +
          autoplay
        }
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={style}
      />
    </div>
  );
}
