import { memo } from 'react';
import css from './NotesList.module.css'

type VideoProps = {
  video: Blob,
  onClick: () => void
}

const Video = memo(({video, onClick}: VideoProps) => {
  return (
    <video className={css.videoElement} src={URL.createObjectURL(video)} onClick={onClick}></video>
  );
}, (oldProps, newProps) => oldProps.video === newProps.video);

export default Video;