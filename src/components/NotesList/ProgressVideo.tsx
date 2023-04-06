import { MouseEvent, memo, useEffect, useRef, useState } from 'react';
import css from './NotesList.module.css'
import Video from './Video';
import getBlobDuration from './getBlobDuration';

type VideoProps = {
  video: Blob,
}

const ProgressVideo = ({video}: VideoProps) => {
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const click = (evt: MouseEvent): void => {
    evt.stopPropagation();
    if (!playing) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  useEffect(() => {
    async function wrapper() {
      const duration = await getBlobDuration(video);
      setDuration(duration);
    }
    wrapper();
  }, [video]);

  useEffect(() => {
    const play = () => {
      setPlaying(true);
    };

    const pause = () => {
      setPlaying(false);
    };

    const progress = () => {
      const angle = (360 * (videoRef.current?.currentTime || 0)) / duration;

      if (progressRef.current)
        progressRef.current.style.background = `conic-gradient(#646cff ${angle}deg, white 0deg)`;
    };

    const ended = () => {
      if (progressRef.current)
        progressRef.current.style.background = `conic-gradient(#646cff 0deg, white 0deg)`;
    };

    if(videoRef.current) {
      videoRef.current.addEventListener('play', play);
      videoRef.current.addEventListener('pause', pause);
      videoRef.current.addEventListener('timeupdate', progress);
      videoRef.current.addEventListener('ended', ended);
    }

    return () => {
      if(videoRef.current) {
        videoRef.current.removeEventListener('play', play);
        videoRef.current.removeEventListener('pause', pause);
        videoRef.current.removeEventListener('timeupdate', progress);
        videoRef.current.removeEventListener('ended', ended);
      }
    };
  }, [videoRef.current]);

  return (
    <div className={css.timerProgress} ref={progressRef} onClick={click}>
      <Video video={video} ref={videoRef} />
    </div>
    
  );
};

export default ProgressVideo;