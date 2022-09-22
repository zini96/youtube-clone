import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";

const { TextArea } = Input;

function SingleComment(props) {
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const user = useSelector((state) => state.user);

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(false);
        props.refreshFunction(response.data.result);
      } else {
        alert("코멘트 등록에 실패했습니다.");
      }
    });
  };

  // const commentDeleteButton = user.userData._id === localStorage.getItem('userId') && <CommentDelete commentId={props.comment._id}/>

  return (
    <div>
      {props.comment.writer && (
        <Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} alt="avatar" />}
          content={<p>{props.comment.content}</p>}
          className="replycomment"
        />
      )}
      {OpenReply && (
        <form className="commentForm replycomment" onSubmit={onSubmit}>
          <textarea
            className="commentInput"
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <Button className="commentBtn" onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
