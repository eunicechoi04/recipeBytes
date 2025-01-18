const Embed = ({ link }) => {
  const container = {
    position: "relative",
    width: "100%",
    height: "0",
    paddingBottom:
      "56.25%" /* The height of the item will now be 56.25% of the width. */,
  };

  const iframeStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "0",
    top: "0",
  };

  return (
    <div className="aspect-ratio" style={container}>
      <iframe
        src={link}
        frameBorder="0"
        width="550"
        height="275"
        style={iframeStyle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Embed;
