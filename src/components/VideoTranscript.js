import React, { useState, useEffect } from "react";
import { FormControl, InputGroup, Button, Card, Image } from "react-bootstrap";
import axios from "axios";

const VideoTranscript = () => {
  const [link, setLink] = useState("");
  const [player, setPlayer] = useState();
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (!window.YT) {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const handleInput = (e) => {
    setLink(e.target.value);
  };

  const timeFormat = (res) => {
    var dur = parseInt(res.data.start);
    var min = ~~((dur % 3600) / 60);
    var sec = ~~(dur % 60);
    var hr = ~~(dur / 3600);
    var ret = "";
    if (hr > 0) {
      ret += "" + hr + ":" + (min < 10 ? "0" : "");
    }

    ret += "" + min + ":" + (sec < 10 ? "0" : "");
    ret += "" + sec;
    console.log(ret);
    return ret;
  };

  const bookmark = () => {
    const time = parseInt(player.getCurrentTime());
    if (time > 0) {
      axios
        .get(`http://localhost:5000/api/cclist/${time}`)
        .then((res) => {
          if (res.status === 200) {
            const timeframe = timeFormat(res);
            const data = {
              start: timeframe,
              text: res.data.text,
            };
            setTranscript(data);
          } else {
            console.error(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = () => {
    if (player) {
      const frame = document.querySelector("#player");
      const frameParent = frame.parentElement;
      frame.remove();
      const div = document.createElement("div");
      div.setAttribute("id", "player");
      div.setAttribute("style", "box-shadow:5px 5px 15px rgba(0,0,0,0.2)");
      frameParent.insertBefore(div, frameParent.childNodes[0]);
      setPlayer(null);
    }
    if (link) {
      const videoId = link.split("/").slice(-1).pop();

      axios
        .get(`http://localhost:5000/api/transcript/${videoId}`)
        .then((res) => {
          res.status === 200 ? console.log(res.data) : console.error(res.data);
        });

      const playerObj = new window.YT.Player("player", {
        height: 300,
        width: "100%",
        videoId: videoId,
        playerVars: { rel: 0 },
      });
      if (playerObj) {
        setPlayer(playerObj);
      }
    }
  };

  return (
    <div className="container p-5" style={{ height: "100vh" }}>
      <div className="row">
        <InputGroup>
          <FormControl
            onChange={handleInput}
            placeholder="Enter video link.."
          />
          <Button onClick={handleSubmit} className="btn-success">
            Get video
          </Button>
        </InputGroup>
        <div className="col-sm-12 col-md-12 col-lg-6">
          <div className="mt-5">
            <div
              id="player"
              style={{ boxShadow: "5px 5px 15px rgba(0,0,0,0.2)" }}
            ></div>
            {player ? (
              <>
                <Button
                  className="btn-primary btn-block mt-3"
                  onClick={bookmark}
                >
                  Bookmark
                </Button>
              </>
            ) : (
              <Image
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
                }}
                src="https://cdn.dribbble.com/users/141880/screenshots/2431840/dailyui-057.gif"
              />
            )}
          </div>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6">
          <div className="mt-5">
            <Card
              className="mb-3"
              style={{ boxShadow: "5px 5px 15px rgba(0,0,0,0.2)" }}
            >
              <Card.Header>
                Transcript {transcript ? "at" + " " + transcript.start : null}
              </Card.Header>
              <Card.Body>
                <p>{transcript.text}</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTranscript;
