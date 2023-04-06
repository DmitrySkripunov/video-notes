import { forwardRef, memo } from 'react';
import css from './NotesList.module.css'

type VideoProps = {
  video: Blob,
}

const Video = memo(forwardRef<HTMLVideoElement, VideoProps>(({video}, ref) => (
      <video ref={ref} className={css.videoElement} src={URL.createObjectURL(video)} preload='memetadata'></video>
)), (oldProps, newProps) => oldProps.video === newProps.video);

export default Video;