import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import Axios from "axios";
import moment from "moment";
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [Video, setVideo] = useState([]);

  useEffect(() => {
    Axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        // console.log(response.data)
        setVideo(response.data.videos);
      } else {
        alert("비디오 가져오기를 실패했습니다.");
      }
    });
  }, [Video.length]);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    // Col 사이즈별로 들어가는 동영상이 다르게 설정 (총 윈도우 너비=24)
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <a href={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="썸네일"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
          description=""
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span> -{" "}
        <span>{moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  // const onSubmit = (e) => {
  //     e.preventDefault();
  //     const { page } = qs.parse(location.search, {
  //         ignoreQueryPrefix: true,
  //     });

  //     dispatch(searchPosts({ page: page, option: options, content: value }));
  //     setValue('');
  // };

  // const searchPosts = ({ page, option, content }) => {
  //     const queryString = qs.stringify({
  //         page,
  //         option,
  //         content
  //     });
  //     return client.get(`/api/posts/search?${queryString}`);
  // }

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>추천 비디오</Title>
      <hr style={{ marginBottom: "2rem" }} />
      <Row gutter={[32, 16]}>{renderCards}</Row>

      {/* <form method="get" onSubmit={onSubmit}>
                <select value={options} onChange={selectHandle}>
                    <option value="title">제목</option>
                    <option value="body">내용</option>
                    <option value="title_body">제목+내용</option>
                </select>
                <input
                    type="text" name="searchText"
                    onChange={handleChange}
                    value={value}
                    placeholder="검색어를 입력하세요" />
                <div>
                    <Cbutton type="submit" onClick={onSubmit}>검색</Cbutton>
                </div>
            </form> */}
    </div>
  );
}

export default LandingPage;
